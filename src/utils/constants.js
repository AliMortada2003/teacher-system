export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ASSISTANT: 'assistant'
}

export const ROLE_LABELS = {
  student: 'طالب',
  teacher: 'المدرس المالك',
  assistant: 'مساعد المدرس'
}

export const SUBJECT_SEED = [
  { name: 'عربي الصف الأول الثانوي', color: '#2563EB', colorHex: '#2563EB', icon: 'BookOpenText', code: 'ARB-1' },
  { name: 'عربي الصف الثاني الثانوي', color: '#F97316', colorHex: '#F97316', icon: 'BookOpenText', code: 'ARB-2' },
  { name: 'عربي الصف الثالث الثانوي', color: '#2563EB', colorHex: '#2563EB', icon: 'BookOpenText', code: 'ARB-3' },
  { name: 'عربي الصف الأول الثانوي - نحو', color: '#F97316', colorHex: '#F97316', icon: 'BookOpenText', code: 'ARB-1-N' },
  { name: 'عربي الصف الثاني الثانوي - بلاغة ونصوص', color: '#334155', colorHex: '#334155', icon: 'BookOpenText', code: 'ARB-2-B' },
  { name: 'عربي الصف الثالث الثانوي - مراجعة شاملة', color: '#2563EB', colorHex: '#2563EB', icon: 'BookOpenText', code: 'ARB-3-R' },
  { name: 'عربي الصف الثالث الثانوي - تدريبات الامتحان', color: '#F97316', colorHex: '#F97316', icon: 'BookOpenText', code: 'ARB-3-E' }
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
  { path: '/teacher/assistants', label: 'المساعدين', icon: 'UsersRound' },
  { path: '/teacher/orders', label: 'الطلبات', icon: 'Receipt' },
  { path: '/teacher/reports', label: 'التقارير', icon: 'BarChart3' },
  { path: '/teacher/settings', label: 'إعدادات المنصة', icon: 'Settings' },
  { path: '/teacher/profile', label: 'الملف الشخصي', icon: 'UserCircle' }
]

export const NAV_ASSISTANT = [
  { path: '/assistant/dashboard', label: 'الرئيسية', icon: 'LayoutDashboard' },
  { path: '/assistant/courses', label: 'الكورسات', icon: 'BookMarked' },
  { path: '/assistant/sections', label: 'الأقسام', icon: 'ListTree' },
  { path: '/assistant/lessons', label: 'الدروس', icon: 'BookOpen' },
  { path: '/assistant/quizzes', label: 'الاختبارات', icon: 'FileText' },
  { path: '/assistant/assignments', label: 'الواجبات', icon: 'ClipboardList' },
  { path: '/assistant/students', label: 'الطلاب', icon: 'GraduationCap' },
  { path: '/assistant/orders', label: 'الطلبات', icon: 'Receipt' },
  { path: '/assistant/coupons', label: 'الكوبونات', icon: 'TicketPercent' },
  { path: '/assistant/attendance', label: 'الحضور والغياب', icon: 'CalendarCheck' },
  { path: '/assistant/announcements', label: 'الإعلانات', icon: 'Megaphone' },
  { path: '/assistant/reports', label: 'التقارير', icon: 'BarChart3' },
  { path: '/assistant/profile', label: 'الملف الشخصي', icon: 'UserCircle' }
]
