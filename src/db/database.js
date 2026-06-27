import { seedData } from './seed.js'
import { uid } from '../utils/id.js'

const DB_KEY = 'academy_db_v1'
const DB_VERSION = 2

const COURSE_LEVELS = ['مبتدئ', 'متوسط', 'متقدم']
const COURSE_COLORS = ['#2563EB', '#F97316', '#334155', '#2563EB', '#F97316', '#334155', '#2563EB']
const PLATFORM_NAME = 'منصة الأوائل'
const PLATFORM_TAGLINE = 'عربي للثانوي مع مدرس واحد وخطة واضحة لكل صف'
const GLOBAL_INSTRUCTOR = {
  name: 'أ. أحمد المسعود',
  title: 'مدرس اللغة العربية للمرحلة الثانوية',
  bio: 'مدرس لغة عربية متخصص في تبسيط النحو والبلاغة والنصوص لطلاب المرحلة الثانوية بخطة منظمة لكل صف.',
  headline: 'تعلم العربي للثانوي خطوة بخطوة مع شرح واضح وتدريب مستمر',
  experience: '10+ سنوات خبرة في تدريس اللغة العربية'
}
const ARABIC_COURSES = [
  {
    name: 'عربي الصف الأول الثانوي',
    code: 'ARB-1',
    grade: 'الصف الأول الثانوي',
    level: 'تأسيس',
    price: 199,
    colorHex: '#2563EB',
    imageUrl: 'سشسمكشنسكمشتنسكنمشتسن',
    description: 'شرح منهج العربي للصف الأول الثانوي مع تأسيس النحو والقراءة والنصوص.'
  },
  {
    name: 'عربي الصف الثاني الثانوي',
    code: 'ARB-2',
    grade: 'الصف الثاني الثانوي',
    level: 'متوسط',
    price: 249,
    colorHex: '#F97316',
    description: 'منهج الصف الثاني الثانوي في النحو والبلاغة والأدب مع تدريبات مستمرة.'
  },
  {
    name: 'عربي الصف الثالث الثانوي',
    code: 'ARB-3',
    grade: 'الصف الثالث الثانوي',
    level: 'ثانوية عامة',
    price: 299,
    colorHex: '#2563EB',
    description: 'شرح ومراجعة عربي الثانوية العامة بنظام منظم وتدريبات امتحانية.'
  },
  {
    name: 'عربي الصف الأول الثانوي - نحو',
    code: 'ARB-1-N',
    grade: 'الصف الأول الثانوي',
    level: 'نحو',
    price: 179,
    colorHex: '#F97316',
    description: 'تأسيس النحو للصف الأول الثانوي مع أمثلة وتطبيقات قصيرة.'
  },
  {
    name: 'عربي الصف الثاني الثانوي - بلاغة ونصوص',
    code: 'ARB-2-B',
    grade: 'الصف الثاني الثانوي',
    level: 'بلاغة',
    price: 229,
    colorHex: '#334155',
    description: 'شرح البلاغة والنصوص للصف الثاني الثانوي بطريقة مبسطة ومباشرة.'
  },
  {
    name: 'عربي الصف الثالث الثانوي - مراجعة شاملة',
    code: 'ARB-3-R',
    grade: 'الصف الثالث الثانوي',
    level: 'مراجعة',
    price: 349,
    colorHex: '#2563EB',
    description: 'مراجعة شاملة لطلاب الثانوية العامة مع أسئلة وتدريبات على كل الفروع.'
  },
  {
    name: 'عربي الصف الثالث الثانوي - تدريبات الامتحان',
    code: 'ARB-3-E',
    grade: 'الصف الثالث الثانوي',
    level: 'تدريب',
    price: 199,
    colorHex: '#F97316',
    description: 'تدريبات امتحانية مركزة لطلاب الصف الثالث الثانوي مع متابعة النتائج.'
  }
]

const read = () => {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const write = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data))
}

const asArray = (value) => (Array.isArray(value) ? value : [])

const ensureCollection = (data, name) => {
  data[name] = asArray(data[name])
  return data[name]
}

const pickInstructor = (data) => {
  const users = ensureCollection(data, 'users')
  const savedId = data.settings?.globalInstructorId
  const saved = users.find((user) => user.id === savedId && user.role === 'teacher')
  if (saved) return saved

  const approved = users.find((user) => user.role === 'teacher' && user.status === 'approved')
  if (approved) return approved

  const teacher = users.find((user) => user.role === 'teacher')
  if (teacher) return teacher

  const instructor = {
    id: uid('user'),
    role: 'teacher',
    status: 'approved',
    name: 'أ. هبة المنير',
    email: 'teacher@single-instructor.local',
    password: '123456',
    avatar: null,
    phone: '+20 10 0000 0000',
    city: 'القاهرة',
    bio: 'مدرسة متخصصة تقدم تجربة تعلم منظمة وشخصية.',
    subjectIds: [],
    createdAt: new Date().toISOString()
  }
  users.push(instructor)
  return instructor
}

const defaultInstructorProfile = (instructor, current = {}) => ({
  name: current.name || instructor.name,
  title: current.title || 'مدرس وخبير تعليمي',
  email: current.email || instructor.email,
  phone: current.phone || instructor.phone || '',
  city: current.city || instructor.city || '',
  bio: current.bio || instructor.bio || 'منصة شخصية تساعد الطلاب على التعلم بخطوات واضحة، دروس منظمة، اختبارات قصيرة، ومتابعة تقدم مستمرة.',
  headline: current.headline || 'تعلم بهدوء مع مدرسك الشخصي',
  experience: current.experience || '12+ سنة خبرة في التدريس والمتابعة',
  avatar: current.avatar || instructor.avatar || null
})

const ensureSections = (data) => {
  const subjects = ensureCollection(data, 'subjects')
  const sections = ensureCollection(data, 'sections')

  subjects.forEach((subject) => {
    const existing = sections.filter((section) => section.subjectId === subject.id)
    if (existing.length) return
    sections.push({
      id: uid('sec'),
      subjectId: subject.id,
      title: 'البدء المنظم',
      description: `خطة البداية في ${subject.name}`,
      order: 1,
      createdAt: new Date().toISOString()
    })
  })
}

const ensureResources = (data) => {
  const lessons = ensureCollection(data, 'lessons')
  const resources = ensureCollection(data, 'resources')

  lessons.forEach((lesson) => {
    if (lesson.resourceIds?.length) return
    const existing = resources.filter((resource) => resource.lessonId === lesson.id)
    if (existing.length) {
      lesson.resourceIds = existing.map((resource) => resource.id)
      return
    }
    const resource = {
      id: uid('res'),
      lessonId: lesson.id,
      subjectId: lesson.subjectId,
      title: `ملخص ${lesson.title}`,
      type: 'pdf',
      size: '320 KB',
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(`ملخص الدرس: ${lesson.title}`)}`,
      downloads: 0,
      createdAt: new Date().toISOString()
    }
    resources.push(resource)
    lesson.resourceIds = [resource.id]
  })
}

const normalizeSingleInstructor = (data) => {
  const users = ensureCollection(data, 'users')
  const subjects = ensureCollection(data, 'subjects')
  const lessons = ensureCollection(data, 'lessons')
  const exams = ensureCollection(data, 'exams')
  const attendance = ensureCollection(data, 'attendance')
  const announcements = ensureCollection(data, 'announcements')
  ensureCollection(data, 'questions')
  ensureCollection(data, 'attempts')
  ensureCollection(data, 'notifications')
  ensureCollection(data, 'activityLogs')
  ensureCollection(data, 'sessions')
  ensureCollection(data, 'sections')
  ensureCollection(data, 'resources')
  ensureCollection(data, 'lessonProgress')
  ensureCollection(data, 'orders')
  ensureCollection(data, 'coupons')
  ensureCollection(data, 'certificates')
  ensureCollection(data, 'assignments')
  ensureCollection(data, 'assignmentSubmissions')

  data.settings = {
    academyName: 'منصة المدرس الشخصية',
    tagline: 'تعلم منظم ومريح مع مدرس واحد',
    allowRegistration: true,
    autoApproveTeachers: false,
    leaderboardWeights: { exams: 0.6, attendance: 0.25, participation: 0.15 },
    theme: 'light',
    ...(data.settings || {})
  }

  const instructor = pickInstructor(data)
  instructor.role = 'teacher'
  instructor.status = 'approved'
  instructor.subjectIds = subjects.map((subject) => subject.id)
  instructor.name = GLOBAL_INSTRUCTOR.name
  instructor.bio = GLOBAL_INSTRUCTOR.bio
  instructor.bio = instructor.bio || 'مدرس متخصص يقدم تجربة تعليمية شخصية ومنظمة.'

  data.settings.globalInstructorId = instructor.id
  data.settings.instructorProfile = defaultInstructorProfile(
    instructor,
    data.settings.instructorProfile || {}
  )
  data.settings.instructorProfile = {
    ...data.settings.instructorProfile,
    name: GLOBAL_INSTRUCTOR.name,
    title: GLOBAL_INSTRUCTOR.title,
    bio: GLOBAL_INSTRUCTOR.bio,
    headline: GLOBAL_INSTRUCTOR.headline,
    experience: GLOBAL_INSTRUCTOR.experience
  }
  data.settings.academyName = PLATFORM_NAME
  data.settings.tagline = PLATFORM_TAGLINE
  data.settings.academyName = data.settings.academyName?.includes('أكاديمية')
    ? 'منصة المدرس الشخصية'
    : data.settings.academyName
  data.settings.academyName = PLATFORM_NAME
  data.settings.tagline = PLATFORM_TAGLINE
  data.settings.autoApproveTeachers = false

  users.forEach((user) => {
    if (user.role === 'teacher' && user.id !== instructor.id) {
      user.hidden = true
      user.status = user.status || 'archived'
    }
  })

  ensureSections(data)

  subjects.forEach((subject, index) => {
    subject.instructorId = instructor.id
    subject.price = typeof subject.price === 'number' ? subject.price : [499, 599, 699, 799][index % 4]
    subject.currency = subject.currency || 'EGP'
    subject.level = subject.level || COURSE_LEVELS[index % COURSE_LEVELS.length]
    subject.published = subject.published ?? subject.active ?? true
    subject.colorHex = subject.colorHex || COURSE_COLORS[index % COURSE_COLORS.length]
    subject.description = subject.description || `كورس ${subject.name} بخطة تعلم واضحة ودروس تطبيقية.`
  })

  subjects.forEach((subject, index) => {
    const course = ARABIC_COURSES[index % ARABIC_COURSES.length]
    subject.instructorId = instructor.id
    subject.name = course.name
    subject.code = course.code
    subject.grade = course.grade
    subject.icon = 'BookOpenText'
    subject.price = course.price
    subject.currency = subject.currency || 'EGP'
    subject.level = course.level || COURSE_LEVELS[index % COURSE_LEVELS.length]
    subject.published = subject.published ?? subject.active ?? true
    subject.colorHex = course.colorHex || COURSE_COLORS[index % COURSE_COLORS.length]
    subject.color = subject.colorHex
    subject.description = course.description
  })

  const sections = ensureCollection(data, 'sections')
  lessons.forEach((lesson, index) => {
    const section = sections.find((item) => item.subjectId === lesson.subjectId)
    if (lesson.teacherId && lesson.teacherId !== instructor.id && !lesson.legacyTeacherId) {
      lesson.legacyTeacherId = lesson.teacherId
    }
    lesson.teacherId = instructor.id
    lesson.sectionId = lesson.sectionId || section?.id || null
    lesson.videoUrl = lesson.videoUrl || ''
    lesson.content = lesson.content || lesson.summary || 'محتوى الدرس متاح داخل المشغل.'
    lesson.resourceIds = asArray(lesson.resourceIds)
    lesson.order = lesson.order || index + 1
  })

  exams.forEach((exam) => {
    if (exam.teacherId && exam.teacherId !== instructor.id && !exam.legacyTeacherId) {
      exam.legacyTeacherId = exam.teacherId
    }
    exam.teacherId = instructor.id
  })

  attendance.forEach((record) => {
    if (record.teacherId && record.teacherId !== instructor.id && !record.legacyTeacherId) {
      record.legacyTeacherId = record.teacherId
    }
    record.teacherId = instructor.id
  })

  announcements.forEach((announcement) => {
    if (announcement.authorId && announcement.authorId !== instructor.id && !announcement.legacyAuthorId) {
      announcement.legacyAuthorId = announcement.authorId
    }
    announcement.authorId = instructor.id
  })

  const coupons = ensureCollection(data, 'coupons')
  if (!coupons.length) {
    coupons.push({
      id: uid('cpn'),
      code: 'WELCOME20',
      title: 'خصم الترحيب',
      type: 'percent',
      value: 20,
      active: true,
      expiresAt: null,
      usageLimit: 100,
      usedCount: 0,
      createdAt: new Date().toISOString()
    })
  }

  const assignments = ensureCollection(data, 'assignments')
  subjects.forEach((subject, index) => {
    const exists = assignments.some((assignment) => assignment.subjectId === subject.id)
    if (!exists) {
      assignments.push({
        id: uid('asg'),
        subjectId: subject.id,
        title: `تطبيق عملي - ${subject.name}`,
        instructions: 'حل الأسئلة التدريبية وارفع إجابتك قبل الموعد المحدد.',
        points: 20,
        dueDate: new Date(Date.now() + (index + 7) * 86400000).toISOString(),
        published: true,
        createdAt: new Date().toISOString()
      })
    }
  })

  ensureResources(data)

  data.__version = DB_VERSION
  return data
}

export const initDatabase = () => {
  const existing = read()
  if (!existing) {
    const fresh = normalizeSingleInstructor(seedData())
    write(fresh)
    return
  }

  if (existing.__version !== DB_VERSION) {
    write(normalizeSingleInstructor(existing))
    return
  }

  write(normalizeSingleInstructor(existing))
}

const safeGet = () => {
  let db = read()
  if (!db) {
    initDatabase()
    db = read()
  }
  if (db?.__version !== DB_VERSION) {
    initDatabase()
    db = read()
  }
  return db
}

/**
 * Generic collection API:
 *   db.all(name) -> array
 *   db.find(name, id) -> item
 *   db.where(name, predicate) -> array
 *   db.insert(name, item) -> item
 *   db.update(name, id, patch) -> item
 *   db.remove(name, id) -> boolean
 *   db.setCollection(name, arr) -> arr
 */
export const db = {
  raw: () => safeGet(),
  all(name) {
    const data = safeGet()
    return [...(data[name] || [])]
  },
  find(name, id) {
    const arr = safeGet()[name] || []
    return arr.find((x) => x.id === id) || null
  },
  where(name, predicate) {
    const arr = safeGet()[name] || []
    return arr.filter(predicate)
  },
  insert(name, item) {
    const data = safeGet()
    data[name] = data[name] || []
    data[name].push(item)
    write(data)
    return item
  },
  update(name, id, patch) {
    const data = safeGet()
    const arr = data[name] || []
    const idx = arr.findIndex((x) => x.id === id)
    if (idx === -1) return null
    arr[idx] = { ...arr[idx], ...patch, updatedAt: new Date().toISOString() }
    data[name] = arr
    write(data)
    return arr[idx]
  },
  remove(name, id) {
    const data = safeGet()
    const arr = data[name] || []
    const next = arr.filter((x) => x.id !== id)
    data[name] = next
    write(data)
    return arr.length !== next.length
  },
  setCollection(name, arr) {
    const data = safeGet()
    data[name] = arr
    write(data)
    return arr
  },
  setting(key, value) {
    const data = safeGet()
    data.settings = data.settings || {}
    if (value === undefined) return data.settings[key]
    data.settings[key] = value
    write(data)
    return value
  },
  saveRaw(data) {
    write(normalizeSingleInstructor(data))
    return safeGet()
  },
  migrate() {
    const data = normalizeSingleInstructor(safeGet())
    write(data)
    return data
  },
  reset() {
    localStorage.removeItem(DB_KEY)
    initDatabase()
  }
}
