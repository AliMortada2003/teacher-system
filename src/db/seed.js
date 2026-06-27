import { uid } from '../utils/id.js'
import { SUBJECT_SEED, ROLES, TEACHER_STATUS, ATTENDANCE_STATUS } from '../utils/constants.js'
import { daysAgo } from '../utils/date.js'

const pick = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const STUDENT_NAMES = [
  'أحمد محمد', 'سارة علي', 'يوسف حسين', 'ليلى الكندي', 'عمر الشريف',
  'نور الهدى', 'خالد إبراهيم', 'مريم عبدالله', 'زياد الطاهر', 'رنا المصري',
  'محمود فاروق', 'هدى سليم', 'بلال كريم', 'جنى ياسين', 'سيف الدين'
]
const TEACHER_NAMES = [
  'د. هشام الخولي', 'أ. منى البدوي', 'د. طارق الحسيني', 'أ. فاطمة النجار',
  'د. سامي الراشد', 'أ. دينا عبدالله', 'د. أيمن قاسم'
]

/** @type {(role: any, name: any, email: any, extras?: any) => any} */
const mkUser = (role, name, email, extras = {}) => ({
  id: uid('user'),
  role,
  name,
  email,
  password: '123456',
  avatar: null,
  phone: extras.phone || `+20 10 ${randInt(1000, 9999)} ${randInt(1000, 9999)}`,
  city: extras.city || 'القاهرة',
  bio: extras.bio || '',
  createdAt: extras.createdAt || new Date().toISOString(),
  status: extras.status || 'active',
  ...extras
})

export const seedData = () => {
  // SUBJECTS
  const subjects = SUBJECT_SEED.map((s) => ({
    id: uid('sub'),
    name: s.name,
    code: s.code,
    color: s.color,
    icon: s.icon,
    description: `مادة ${s.name} — منهج متكامل مع دروس تفاعلية وتقييمات مستمرة.`,
    createdAt: new Date().toISOString(),
    active: true
  }))

  // USERS
  const admin = mkUser(ROLES.ADMIN, 'مدير الأكاديمية', 'admin@academy.sa', { bio: 'مسؤول المنصة' })
  const admin2 = mkUser(ROLES.ADMIN, 'أمين النظام', 'owner@academy.sa', { bio: 'مالك الأكاديمية' })

  const teachers = TEACHER_NAMES.map((n, i) => {
    const subj = subjects[i % subjects.length]
    return mkUser(ROLES.TEACHER, n, `teacher${i + 1}@academy.sa`, {
      status: TEACHER_STATUS.APPROVED,
      subjectIds: [subj.id, subjects[(i + 2) % subjects.length].id],
      bio: `مدرس ${subj.name} بخبرة ${randInt(5, 18)} سنوات.`,
      createdAt: daysAgo(randInt(30, 300))
    })
  })
  // one pending teacher
  teachers.push(
    mkUser(ROLES.TEACHER, 'أ. حسام العتيبي', 'pending@academy.sa', {
      status: TEACHER_STATUS.PENDING,
      subjectIds: [subjects[0].id],
      bio: 'أرجو الانضمام لطاقم الأكاديمية.',
      createdAt: daysAgo(2)
    })
  )

  const students = STUDENT_NAMES.map((n, i) => {
    const enrolled = pick(subjects, randInt(3, 5)).map((s) => s.id)
    return mkUser(ROLES.STUDENT, n, `student${i + 1}@academy.sa`, {
      subjectIds: enrolled,
      grade: `الصف ${['العاشر', 'الحادي عشر', 'الثاني عشر'][i % 3]}`,
      createdAt: daysAgo(randInt(10, 250))
    })
  })

  const users = [admin, admin2, ...teachers, ...students]

  // LESSONS (per subject, 4-6 lessons)
  const lessons = []
  subjects.forEach((s) => {
    const count = randInt(4, 6)
    const teacher = teachers.find((t) => t.subjectIds?.includes(s.id) && t.status === TEACHER_STATUS.APPROVED) || teachers[0]
    for (let i = 1; i <= count; i++) {
      lessons.push({
        id: uid('lsn'),
        subjectId: s.id,
        teacherId: teacher.id,
        title: `الدرس ${i} - ${s.name}`,
        summary: `شرح مبسط ومتكامل للدرس ${i} من منهج ${s.name} مع أمثلة تطبيقية.`,
        duration: randInt(30, 75),
        order: i,
        createdAt: daysAgo(randInt(5, 120))
      })
    }
  })

  // EXAMS (1-2 per subject)
  const exams = []
  const questions = []
  subjects.forEach((s) => {
    const teacher = teachers.find((t) => t.subjectIds?.includes(s.id) && t.status === TEACHER_STATUS.APPROVED) || teachers[0]
    for (let i = 0; i < 2; i++) {
      const examId = uid('exm')
      const qCount = randInt(4, 6)
      const qs = []
      let total = 0
      for (let q = 1; q <= qCount; q++) {
        const correct = randInt(0, 3)
        const points = 5
        total += points
        const question = {
          id: uid('q'),
          examId,
          order: q,
          text: `سؤال ${q} في ${s.name}: اختر الإجابة الصحيحة من بين الخيارات التالية.`,
          choices: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
          correctIndex: correct,
          points
        }
        qs.push(question)
        questions.push(question)
      }
      exams.push({
        id: examId,
        subjectId: s.id,
        teacherId: teacher.id,
        title: `${i === 0 ? 'اختبار منتصف' : 'اختبار نهاية'} الفصل - ${s.name}`,
        description: `تقييم شامل لمحاور مادة ${s.name}.`,
        duration: [30, 45, 60][randInt(0, 2)],
        totalScore: total,
        questionIds: qs.map((q) => q.id),
        published: true,
        availableFrom: daysAgo(randInt(5, 30)),
        availableTo: new Date(Date.now() + randInt(3, 30) * 86400000).toISOString(),
        createdAt: daysAgo(randInt(5, 60))
      })
    }
  })

  // ATTEMPTS (some completed)
  const attempts = []
  exams.forEach((exam) => {
    const examQuestions = questions.filter((q) => q.examId === exam.id)
    const takers = pick(students, randInt(3, 8))
    takers.forEach((st) => {
      const answers = {}
      let score = 0
      examQuestions.forEach((q) => {
        const picked = Math.random() < 0.7 ? q.correctIndex : randInt(0, 3)
        answers[q.id] = picked
        if (picked === q.correctIndex) score += q.points
      })
      attempts.push({
        id: uid('att'),
        examId: exam.id,
        subjectId: exam.subjectId,
        studentId: st.id,
        answers,
        score,
        totalScore: exam.totalScore,
        percentage: Math.round((score / exam.totalScore) * 100),
        status: 'submitted',
        startedAt: daysAgo(randInt(1, 20)),
        submittedAt: daysAgo(randInt(0, 20))
      })
    })
  })

  // ATTENDANCE (per student, per subject, last 10 sessions)
  const attendance = []
  students.forEach((st) => {
    st.subjectIds.forEach((sid) => {
      const sessions = 10
      for (let i = 0; i < sessions; i++) {
        const r = Math.random()
        const status =
          r < 0.78 ? ATTENDANCE_STATUS.PRESENT :
          r < 0.92 ? ATTENDANCE_STATUS.LATE :
          ATTENDANCE_STATUS.ABSENT
        attendance.push({
          id: uid('att-r'),
          subjectId: sid,
          studentId: st.id,
          teacherId: (teachers.find((t) => t.subjectIds?.includes(sid)) || teachers[0]).id,
          status,
          sessionDate: daysAgo(i * 2 + randInt(0, 1)),
          note: ''
        })
      }
    })
  })

  // NOTIFICATIONS
  const notifications = []
  users.forEach((u) => {
    const n = randInt(2, 4)
    for (let i = 0; i < n; i++) {
      notifications.push({
        id: uid('ntf'),
        userId: u.id,
        title: ['اختبار جديد متاح', 'تم نشر النتائج', 'إعلان جديد', 'تحديث في الجدول'][i % 4],
        body: 'اطّلع على التفاصيل من صفحة الامتحانات.',
        type: ['info', 'success', 'warning'][i % 3],
        read: Math.random() < 0.3,
        createdAt: daysAgo(randInt(0, 14))
      })
    }
  })

  // ANNOUNCEMENTS (per subject)
  const announcements = []
  subjects.forEach((s) => {
    const teacher = teachers.find((t) => t.subjectIds?.includes(s.id) && t.status === TEACHER_STATUS.APPROVED) || teachers[0]
    announcements.push({
      id: uid('ann'),
      subjectId: s.id,
      authorId: teacher.id,
      title: `إعلان هام - ${s.name}`,
      body: `سيتم عقد مراجعة شاملة لمادة ${s.name} يوم السبت القادم الساعة السابعة مساءً.`,
      createdAt: daysAgo(randInt(0, 10))
    })
  })

  // ACTIVITY LOGS
  const activityLogs = [
    { id: uid('log'), userId: admin.id, action: 'تسجيل دخول إلى النظام', createdAt: daysAgo(0) },
    { id: uid('log'), userId: teachers[0].id, action: 'نشر امتحان جديد', createdAt: daysAgo(1) },
    { id: uid('log'), userId: students[0].id, action: 'أكمل اختبار الرياضيات', createdAt: daysAgo(2) }
  ]

  // SESSIONS (empty initially)
  const sessions = []

  // SETTINGS
  const settings = {
    academyName: 'أكاديمية المعرفة',
    tagline: 'نحو تعلم ذكي، سريع، وممتع',
    allowRegistration: true,
    autoApproveTeachers: false,
    leaderboardWeights: { exams: 0.6, attendance: 0.25, participation: 0.15 },
    theme: 'light'
  }

  return {
    users,
    subjects,
    lessons,
    exams,
    questions,
    attempts,
    attendance,
    notifications,
    announcements,
    activityLogs,
    sessions,
    settings
  }
}
