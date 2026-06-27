import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar.jsx'
import { Topbar } from '../components/layout/Topbar.jsx'

const TITLES = {
  '/student/dashboard': 'لوحة الطالب',
  '/student/courses': 'استكشاف الكورسات',
  '/student/subjects': 'كورساتي',
  '/student/lessons': 'صفحة الدرس',
  '/student/exams': 'الاختبارات',
  '/student/results': 'نتائجي',
  '/student/attendance': 'سجل الحضور',
  '/student/leaderboard': 'لوحة المتصدرين',
  '/student/orders': 'طلباتي',
  '/student/certificates': 'شهاداتي',
  '/student/notifications': 'الإشعارات',
  '/student/profile': 'الملف الشخصي',
  '/teacher/dashboard': 'لوحة المدرس',
  '/teacher/courses': 'إدارة الكورسات',
  '/teacher/sections': 'أقسام الكورسات',
  '/teacher/lessons': 'إدارة الدروس',
  '/teacher/quizzes': 'إدارة الاختبارات',
  '/teacher/assignments': 'إدارة الواجبات',
  '/teacher/students': 'الطلاب',
  '/teacher/orders': 'الطلبات',
  '/teacher/coupons': 'الكوبونات',
  '/teacher/attendance': 'إدارة الحضور',
  '/teacher/leaderboard': 'لوحة المتصدرين',
  '/teacher/announcements': 'الإعلانات',
  '/teacher/reports': 'التقارير',
  '/teacher/settings': 'الإعدادات',
  '/teacher/profile': 'الملف الشخصي',
  '/admin/dashboard': 'لوحة المالك',
  '/admin/users': 'المستخدمون',
  '/admin/students': 'الطلاب',
  '/admin/subjects': 'الكورسات',
  '/admin/exams': 'الاختبارات',
  '/admin/attendance': 'تحليلات الحضور',
  '/admin/leaderboard': 'لوحة المتصدرين',
  '/admin/notifications': 'الإشعارات',
  '/admin/settings': 'الإعدادات',
  '/admin/profile': 'الملف الشخصي'
}

const resolveTitle = (pathname) => {
  const exact = TITLES[pathname]
  if (exact) return exact
  const key = Object.keys(TITLES).find((item) => pathname.startsWith(item))
  return key ? TITLES[key] : 'المنصة'
}

export const DashboardLayout = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const title = resolveTitle(location.pathname)

  return (
    <div dir="rtl" className="min-h-screen bg-ink-50 p-3 lg:p-4">
      <div className="mx-auto flex max-w-[1560px] gap-4">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-soft">
          <Topbar onToggleSidebar={() => setOpen((current) => !current)} title={title} />
          <main className="px-4 py-5 md:px-6 lg:px-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
