export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
}

export const ROLE_LABELS = {
  student: 'طالب',
  teacher: 'المدرس',
  admin: 'المالك'
}

export const SUBJECT_SEED = [
  { name: 'اللغة العربية', color: '#2563EB', colorHex: '#2563EB', icon: 'BookOpenText', code: 'ARB' },
  { name: 'الفيزياء', color: '#4F46E5', colorHex: '#4F46E5', icon: 'Atom', code: 'PHY' },
  { name: 'الكيمياء', color: '#14B8A6', colorHex: '#14B8A6', icon: 'FlaskConical', code: 'CHE' },
  { name: 'الأحياء', color: '#22C55E', colorHex: '#22C55E', icon: 'Leaf', code: 'BIO' },
  { name: 'البرمجة', color: '#334155', colorHex: '#334155', icon: 'Code2', code: 'CS' },
  { name: 'الجيولوجيا', color: '#F59E0B', colorHex: '#F59E0B', icon: 'Mountain', code: 'GEO' },
  { name: 'اللغة الفرنسية', color: '#64748B', colorHex: '#64748B', icon: 'Languages', code: 'FR' }
]

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
}

export const ATTENDANCE_LABEL = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر'
}

export const TEACHER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const TEACHER_STATUS_LABEL = {
  pending: 'غير مفعل',
  approved: 'مفعل',
  rejected: 'موقوف'
}

export const NAV_STUDENT = [
  { path: '/student/dashboard', label: 'الرئيسية', icon: 'LayoutDashboard' },
  { path: '/student/courses', label: 'استكشاف الكورسات', icon: 'Search' },
  { path: '/student/subjects', label: 'كورساتي', icon: 'BookMarked' },
  { path: '/student/exams', label: 'الاختبارات', icon: 'FileText' },
  { path: '/student/results', label: 'النتائج', icon: 'Trophy' },
  { path: '/student/certificates', label: 'الشهادات', icon: 'Award' },
  { path: '/student/orders', label: 'الطلبات', icon: 'Receipt' },
  { path: '/student/notifications', label: 'الإشعارات', icon: 'Bell' },
  { path: '/student/profile', label: 'الملف الشخصي', icon: 'UserCircle' }
]

export const NAV_TEACHER = [
  { path: '/teacher/dashboard', label: 'الرئيسية', icon: 'LayoutDashboard' },
  { path: '/teacher/courses', label: 'الكورسات', icon: 'BookMarked' },
  { path: '/teacher/sections', label: 'الأقسام', icon: 'ListTree' },
  { path: '/teacher/lessons', label: 'الدروس', icon: 'BookOpen' },
  { path: '/teacher/quizzes', label: 'الاختبارات', icon: 'FileText' },
  { path: '/teacher/assignments', label: 'الواجبات', icon: 'ClipboardList' },
  { path: '/teacher/students', label: 'الطلاب', icon: 'GraduationCap' },
  { path: '/teacher/orders', label: 'الطلبات', icon: 'Receipt' },
  { path: '/teacher/coupons', label: 'الكوبونات', icon: 'TicketPercent' },
  { path: '/teacher/attendance', label: 'الحضور', icon: 'CalendarCheck' },
  { path: '/teacher/announcements', label: 'الإعلانات', icon: 'Megaphone' },
  { path: '/teacher/reports', label: 'التقارير', icon: 'BarChart3' },
  { path: '/teacher/settings', label: 'الإعدادات', icon: 'Settings' },
  { path: '/teacher/profile', label: 'الملف الشخصي', icon: 'UserCircle' }
]

export const NAV_ADMIN = [
  { path: '/admin/dashboard', label: 'الرئيسية', icon: 'LayoutDashboard' },
  { path: '/admin/students', label: 'الطلاب', icon: 'GraduationCap' },
  { path: '/admin/subjects', label: 'الكورسات', icon: 'Library' },
  { path: '/admin/exams', label: 'الاختبارات', icon: 'FileText' },
  { path: '/admin/attendance', label: 'تحليلات الحضور', icon: 'BarChart3' },
  { path: '/admin/notifications', label: 'الإشعارات', icon: 'Bell' },
  { path: '/admin/settings', label: 'الإعدادات', icon: 'Settings' }
]
