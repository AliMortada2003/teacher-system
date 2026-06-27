import { db } from '../db/database.js'
import { examRepo, attemptRepo, notificationRepo, activityRepo } from '../repositories/index.js'
import { uid, delay } from '../utils/id.js'

export const examService = {
  async listForStudent(studentId) {
    await delay(80)
    const student = db.find('users', studentId)
    if (!student) return []
    const exams = db.all('exams').filter(
      (e) => e.published && student.subjectIds?.includes(e.subjectId)
    )
    const attempts = db.all('attempts').filter((a) => a.studentId === studentId)
    return exams.map((e) => {
      const attempt = attempts.find((a) => a.examId === e.id)
      return { ...e, attempt }
    })
  },

  async listForTeacher(teacherId) {
    await delay(80)
    return db.all('exams').filter((e) => e.teacherId === teacherId)
  },

  async listAll() {
    await delay(80)
    return db.all('exams')
  },

  async getWithQuestions(examId) {
    await delay(100)
    const exam = db.find('exams', examId)
    if (!exam) return null
    const questions = db.all('questions').filter((q) => q.examId === examId)
      .sort((a, b) => a.order - b.order)
    return { ...exam, questions }
  },

  async createExam(payload) {
    await delay(150)
    const examId = uid('exm')
    const questions = (payload.questions || []).map((q, i) => ({
      id: uid('q'),
      examId,
      order: i + 1,
      text: q.text,
      choices: q.choices,
      correctIndex: q.correctIndex,
      points: q.points || 5
    }))
    questions.forEach((q) => db.insert('questions', q))
    const totalScore = questions.reduce((s, q) => s + q.points, 0)
    const exam = {
      id: examId,
      title: payload.title,
      description: payload.description || '',
      subjectId: payload.subjectId,
      teacherId: payload.teacherId,
      duration: payload.duration || 30,
      totalScore,
      questionIds: questions.map((q) => q.id),
      published: payload.published ?? true,
      availableFrom: payload.availableFrom || new Date().toISOString(),
      availableTo: payload.availableTo || new Date(Date.now() + 14 * 86400000).toISOString(),
      createdAt: new Date().toISOString()
    }
    db.insert('exams', exam)
    activityRepo.create({ userId: payload.teacherId, action: `نشر اختبار جديد: ${exam.title}` })
    // notify enrolled students
    const students = db.all('users').filter(
      (u) => u.role === 'student' && u.subjectIds?.includes(payload.subjectId)
    )
    students.forEach((s) => {
      notificationRepo.create({
        userId: s.id,
        title: 'اختبار جديد متاح',
        body: `تم نشر اختبار: ${exam.title}`,
        type: 'info',
        read: false
      })
    })
    return exam
  },

  async updateExam(examId, patch) {
    await delay(120)
    if (patch.questions) {
      // replace all questions
      const existing = db.all('questions').filter((q) => q.examId === examId)
      existing.forEach((q) => db.remove('questions', q.id))
      const questions = patch.questions.map((q, i) => ({
        id: uid('q'),
        examId,
        order: i + 1,
        text: q.text,
        choices: q.choices,
        correctIndex: q.correctIndex,
        points: q.points || 5
      }))
      questions.forEach((q) => db.insert('questions', q))
      const totalScore = questions.reduce((s, q) => s + q.points, 0)
      patch.questionIds = questions.map((q) => q.id)
      patch.totalScore = totalScore
      delete patch.questions
    }
    return examRepo.update(examId, patch)
  },

  async removeExam(examId) {
    await delay(120)
    const qs = db.all('questions').filter((q) => q.examId === examId)
    qs.forEach((q) => db.remove('questions', q.id))
    const attempts = db.all('attempts').filter((a) => a.examId === examId)
    attempts.forEach((a) => db.remove('attempts', a.id))
    return examRepo.remove(examId)
  },

  async startAttempt(examId, studentId) {
    await delay(120)
    // if an attempt exists and is in_progress, resume it; if submitted, block
    const existing = db.all('attempts').find(
      (a) => a.examId === examId && a.studentId === studentId
    )
    if (existing && existing.status === 'submitted') {
      throw new Error('لقد أكملت هذا الاختبار مسبقا')
    }
    if (existing && existing.status === 'in_progress') return existing
    const exam = db.find('exams', examId)
    const attempt = {
      id: uid('att'),
      examId,
      subjectId: exam.subjectId,
      studentId,
      answers: {},
      score: 0,
      totalScore: exam.totalScore,
      percentage: 0,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      submittedAt: null
    }
    db.insert('attempts', attempt)
    return attempt
  },

  async saveAnswer(attemptId, questionId, choiceIndex) {
    return attemptRepo.update(attemptId, {
      answers: { ...(db.find('attempts', attemptId)?.answers || {}), [questionId]: choiceIndex }
    })
  },

  async submitAttempt(attemptId, answersMap) {
    await delay(150)
    const attempt = db.find('attempts', attemptId)
    if (!attempt) throw new Error('المحاولة غير موجودة')
    const exam = db.find('exams', attempt.examId)
    const questions = db.all('questions').filter((q) => q.examId === exam.id)
    let score = 0
    questions.forEach((q) => {
      if (answersMap[q.id] === q.correctIndex) score += q.points
    })
    const percentage = Math.round((score / exam.totalScore) * 100)
    const updated = attemptRepo.update(attemptId, {
      answers: answersMap,
      score,
      percentage,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    })
    activityRepo.create({
      userId: attempt.studentId,
      action: `تم تسليم اختبار: ${exam.title} (${percentage}%)`
    })
    notificationRepo.create({
      userId: attempt.studentId,
      title: 'تم تصحيح اختبارك',
      body: `درجتك في ${exam.title}: ${score}/${exam.totalScore} (${percentage}%)`,
      type: percentage >= 50 ? 'success' : 'warning',
      read: false
    })
    return updated
  },

  async listAttemptsForStudent(studentId) {
    await delay(80)
    return db.all('attempts').filter((a) => a.studentId === studentId)
  },

  async listAttemptsForExam(examId) {
    await delay(80)
    return db.all('attempts').filter((a) => a.examId === examId)
  }
}
