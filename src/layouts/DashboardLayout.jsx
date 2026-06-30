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

  '/teacher/dashboard': 'لوحة المالك',
  '/teacher/assistants': 'إدارة المساعدين',
  '/teacher/orders': 'الطلبات',
  '/teacher/reports': 'التقارير',
  '/teacher/settings': 'إعدادات المنصة',
  '/teacher/profile': 'الملف الشخصي',

  '/assistant/dashboard': 'لوحة المساعد',
  '/assistant/courses': 'إدارة الكورسات',
  '/assistant/sections': 'أقسام الكورسات',
  '/assistant/lessons': 'إدارة الدروس',
  '/assistant/quizzes': 'إدارة الاختبارات',
  '/assistant/assignments': 'إدارة الواجبات',
  '/assistant/students': 'الطلاب',
  '/assistant/orders': 'الطلبات',
  '/assistant/coupons': 'الكوبونات',
  '/assistant/attendance': 'الحضور والغياب',
  '/assistant/leaderboard': 'لوحة المتصدرين',
  '/assistant/announcements': 'الإعلانات',
  '/assistant/reports': 'التقارير',
  '/assistant/profile': 'الملف الشخصي'
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
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F6FAFB]  text-[#0B2B3F] transition-colors duration-300 dark:bg-[#0B1220] dark:text-slate-100"
    >
      <DashboardBackground />

      <div className="relative z-10 mx-auto flex max-w-[1560px] gap-4">
        <Sidebar open={open} onClose={() => setOpen(false)} />

        <div className="min-w-0 flex-1 overflow-hidden  border border-[#DCEAF3] bg-white/85 shadow-2xl shadow-[#0B5F7A]/10 backdrop-blur-xl transition-colors dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none">
          <Topbar
            onToggleSidebar={() => setOpen((current) => !current)}
            title={title}
          />

          <main className="min-h-[calc(100vh-120px)] px-4 py-5 md:px-6 lg:px-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function DashboardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-[#F7FAF9] dark:bg-[#0B1220]" />

      {/* نفس wash بتاع الهوم */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(11,111,122,0.105),transparent_30%),radial-gradient(circle_at_12%_22%,rgba(195,145,53,0.085),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(120,198,176,0.09),transparent_35%),linear-gradient(180deg,#F7FAF9_0%,#FFFFFF_38%,#F4F8FA_100%)] dark:bg-[radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_12%_22%,rgba(247,215,25,0.08),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.08),transparent_35%),linear-gradient(180deg,#0B1220_0%,#111827_42%,#0B1220_100%)]" />

      {/* paper grain */}
      <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(#0B2B3F_0.55px,transparent_0.55px)] [background-size:22px_22px] dark:opacity-[0.08] dark:[background-image:radial-gradient(#FFFFFF_0.55px,transparent_0.55px)]" />

      {/* notebook lines */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_bottom,#0B2B3F_1px,transparent_1px)] [background-size:100%_46px] dark:opacity-[0.045] dark:[background-image:linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)]" />

      {/* blobs */}
      <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#BEE8F4]/20 blur-[90px] dark:bg-cyan-400/10" />
      <div className="absolute -left-32 top-[520px] h-[420px] w-[420px] rounded-full bg-[#F5D58A]/16 blur-[95px] dark:bg-yellow-300/10" />
      <div className="absolute right-[35%] bottom-0 h-80 w-80 rounded-full bg-[#D8F0E9]/16 blur-[90px] dark:bg-emerald-300/10" />

      {/* soft shapes */}
      <div className="absolute -right-20 top-32 h-72 w-72 rounded-[42%_58%_51%_49%/46%_40%_60%_54%] border border-[#0B6F7A]/10 dark:border-cyan-300/10" />
      <div className="absolute -left-24 top-[620px] h-80 w-80 rounded-[48%_52%_38%_62%/52%_42%_58%_48%] border border-[#C39135]/10 dark:border-yellow-300/10" />

      {/* calm vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_62%,rgba(11,43,63,0.035)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.28)_100%)]" />
    </div>
  )
}
