import { db } from '../db/database.js'
import { userRepo, activityRepo } from '../repositories/index.js'
import { ROLES, TEACHER_STATUS } from '../utils/constants.js'
import { delay, uid } from '../utils/id.js'
import { singleInstructorService } from './singleInstructorService.js'

const SESSION_KEY = 'academy_session_v1'

export const authService = {
  async login(email, password) {
    await delay(200)
    const users = db.all('users')
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) throw new Error('البريد الإلكتروني غير مسجل')
    if (user.password !== password) throw new Error('كلمة المرور غير صحيحة')
    if (user.hidden) throw new Error('هذا الحساب غير نشط')
    if (user.role === ROLES.TEACHER && !singleInstructorService.isGlobalInstructor(user.id)) {
      throw new Error('هذا الحساب ليس حساب المدرس المالك')
    }
    if (user.role === ROLES.TEACHER && user.status !== TEACHER_STATUS.APPROVED) {
      throw new Error('حساب المدرس المالك غير مفعّل')
    }
    if (user.role === ROLES.ASSISTANT && user.status === 'disabled') {
      throw new Error('حساب المساعد موقوف')
    }
    const session = { id: uid('ses'), userId: user.id, createdAt: new Date().toISOString() }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    activityRepo.create({ userId: user.id, action: 'تسجيل دخول إلى المنصة' })
    return { user, session }
  },

  async registerStudent(payload) {
    await delay(250)
    const users = db.all('users')
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل')
    }
    const user = await userRepo.create({
      role: ROLES.STUDENT,
      status: 'active',
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone || '',
      city: payload.city || '',
      grade: payload.grade || 'الصف العاشر',
      subjectIds: payload.subjectIds || [],
      bio: ''
    })
    activityRepo.create({ userId: user.id, action: 'تسجيل حساب طالب جديد' })
    return user
  },

  async logout() {
    await delay(80)
    const current = this.current()
    if (current) activityRepo.create({ userId: current.id, action: 'تسجيل خروج' })
    localStorage.removeItem(SESSION_KEY)
  },

  current() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const session = JSON.parse(raw)
      const user = db.find('users', session.userId)
      if (
        user?.hidden ||
        (user?.role === ROLES.TEACHER && !singleInstructorService.isGlobalInstructor(user.id)) ||
        (user?.role === ROLES.ASSISTANT && user.status === 'disabled')
      ) {
        localStorage.removeItem(SESSION_KEY)
        return null
      }
      return user
    } catch {
      return null
    }
  },

  async updateProfile(userId, patch) {
    await delay(150)
    return userRepo.update(userId, patch)
  },

  async changePassword(userId, oldPw, newPw) {
    await delay(150)
    const u = db.find('users', userId)
    if (!u) throw new Error('المستخدم غير موجود')
    if (u.password !== oldPw) throw new Error('كلمة المرور الحالية غير صحيحة')
    return userRepo.update(userId, { password: newPw })
  }
}
