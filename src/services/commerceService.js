import { db } from '../db/database.js'
import { uid, delay } from '../utils/id.js'
import { notificationRepo } from '../repositories/index.js'

const money = (amount) => Math.max(0, Math.round(Number(amount || 0)))

const submittedAttempts = (studentId, subjectId) =>
  db.all('attempts').filter(
    (attempt) => attempt.studentId === studentId && attempt.subjectId === subjectId && attempt.status === 'submitted'
  )

const courseLessons = (subjectId) =>
  db.all('lessons')
    .filter((lesson) => lesson.subjectId === subjectId)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

export const commerceService = {
  async catalog(studentId) {
    await delay(80)
    const student = db.find('users', studentId)
    const lessons = db.all('lessons')
    const exams = db.all('exams')
    return db.all('subjects')
      .filter((subject) => subject.published !== false)
      .map((subject) => ({
        ...subject,
        purchased: !!student?.subjectIds?.includes(subject.id),
        lessonsCount: lessons.filter((lesson) => lesson.subjectId === subject.id).length,
        quizzesCount: exams.filter((exam) => exam.subjectId === subject.id && exam.published).length
      }))
  },

  applyCoupon(code, subtotal) {
    if (!code) return { coupon: null, discount: 0, total: money(subtotal) }
    const coupon = db.all('coupons').find(
      (item) => item.active && item.code.toLowerCase() === code.trim().toLowerCase()
    )
    if (!coupon) throw new Error('كود الخصم غير صالح')
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new Error('انتهت صلاحية كود الخصم')
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error('تم استخدام كود الخصم بالكامل')
    const discount = coupon.type === 'fixed'
      ? money(coupon.value)
      : money((subtotal * coupon.value) / 100)
    return { coupon, discount, total: money(subtotal - discount) }
  },

  async purchaseCourse({ studentId, subjectId, couponCode = '' }) {
    await delay(180)
    const student = db.find('users', studentId)
    const subject = db.find('subjects', subjectId)
    if (!student) throw new Error('لم يتم العثور على الطالب')
    if (!subject) throw new Error('لم يتم العثور على الكورس')
    if (student.subjectIds?.includes(subjectId)) return { alreadyPurchased: true, subject }

    const subtotal = money(subject.price)
    const { coupon, discount, total } = this.applyCoupon(couponCode, subtotal)
    const order = db.insert('orders', {
      id: uid('ord'),
      studentId,
      subjectId,
      instructorId: subject.instructorId,
      courseTitle: subject.name,
      subtotal,
      discount,
      total,
      currency: subject.currency || 'EGP',
      couponCode: coupon?.code || '',
      status: 'paid',
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })

    db.update('users', studentId, {
      subjectIds: [...(student.subjectIds || []), subjectId]
    })

    if (coupon) {
      db.update('coupons', coupon.id, { usedCount: (coupon.usedCount || 0) + 1 })
    }

    notificationRepo.create({
      userId: studentId,
      title: 'تم تفعيل الكورس',
      body: `تم تسجيلك في ${subject.name}. يمكنك الآن متابعة الدروس.`,
      type: 'success',
      read: false
    })

    return { order, subject }
  },

  async ordersForStudent(studentId) {
    await delay(80)
    return db.all('orders')
      .filter((order) => order.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async allOrders() {
    await delay(80)
    return db.all('orders').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  progressForCourse(studentId, subjectId) {
    const lessons = courseLessons(subjectId)
    const completed = db.all('lessonProgress').filter(
      (item) => item.studentId === studentId && item.subjectId === subjectId && item.completed
    )
    const completedCount = lessons.filter((lesson) => completed.some((item) => item.lessonId === lesson.id)).length
    const percentage = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0
    return { lessons, completed, completedCount, totalLessons: lessons.length, percentage }
  },

  markLessonComplete(studentId, lessonId) {
    const lesson = db.find('lessons', lessonId)
    if (!lesson) throw new Error('لم يتم العثور على الدرس')
    const existing = db.all('lessonProgress').find(
      (item) => item.studentId === studentId && item.lessonId === lessonId
    )
    if (existing) {
      return db.update('lessonProgress', existing.id, {
        completed: true,
        completedAt: new Date().toISOString(),
        lastWatchedAt: new Date().toISOString()
      })
    }
    return db.insert('lessonProgress', {
      id: uid('prg'),
      studentId,
      subjectId: lesson.subjectId,
      lessonId,
      completed: true,
      completedAt: new Date().toISOString(),
      lastWatchedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
  },

  recordResourceDownload(resourceId) {
    const resource = db.find('resources', resourceId)
    if (!resource) return null
    return db.update('resources', resourceId, { downloads: (resource.downloads || 0) + 1 })
  },

  certificateFor(studentId, subjectId) {
    return db.all('certificates').find(
      (certificate) => certificate.studentId === studentId && certificate.subjectId === subjectId
    ) || null
  },

  issueCertificate(studentId, subjectId) {
    const student = db.find('users', studentId)
    const subject = db.find('subjects', subjectId)
    if (!student || !subject) throw new Error('بيانات الشهادة غير مكتملة')

    const existing = this.certificateFor(studentId, subjectId)
    if (existing) return existing

    const progress = this.progressForCourse(studentId, subjectId)
    const attempts = submittedAttempts(studentId, subjectId)
    const avgQuiz = attempts.length
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
      : 0

    if (progress.percentage < 100 && avgQuiz < 70) {
      throw new Error('أكمل الدروس أو حقق 70% في الاختبارات لإصدار الشهادة')
    }

    const certificate = db.insert('certificates', {
      id: uid('crt'),
      studentId,
      subjectId,
      studentName: student.name,
      courseTitle: subject.name,
      score: avgQuiz,
      progress: progress.percentage,
      code: `CERT-${Date.now().toString(36).toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })

    notificationRepo.create({
      userId: studentId,
      title: 'تم إصدار شهادة جديدة',
      body: `شهادتك في ${subject.name} أصبحت جاهزة.`,
      type: 'success',
      read: false
    })

    return certificate
  },

  certificatesForStudent(studentId) {
    return db.all('certificates')
      .filter((certificate) => certificate.studentId === studentId)
      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
  },

  reportMetrics() {
    const orders = db.all('orders')
    const paid = orders.filter((order) => order.status === 'paid')
    const revenue = paid.reduce((sum, order) => sum + money(order.total), 0)
    return {
      revenue,
      orders: paid.length,
      coupons: db.all('coupons').length,
      certificates: db.all('certificates').length,
      resources: db.all('resources').reduce((sum, resource) => sum + (resource.downloads || 0), 0)
    }
  }
}
