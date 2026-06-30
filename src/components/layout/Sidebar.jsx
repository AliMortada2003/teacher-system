import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  NAV_ADMIN,
  NAV_STUDENT,
  NAV_TEACHER,
  ROLES,
  ROLE_LABELS
} from '../../utils/constants.js'
import {
  Award,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Circle,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListTree,
  LogOut,
  Megaphone,
  Receipt,
  Search,
  Settings,
  TicketPercent,
  Trophy,
  UserCircle,
  X
} from 'lucide-react'
import { db } from '../../db/database.js'

const NAV_MAP = {
  [ROLES.STUDENT]: NAV_STUDENT,
  [ROLES.TEACHER]: NAV_TEACHER,
  [ROLES.ADMIN]: NAV_ADMIN
}

const ICONS = {
  Award,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Circle,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListTree,
  Megaphone,
  Receipt,
  Search,
  Settings,
  TicketPercent,
  Trophy,
  UserCircle
}

export const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const items = NAV_MAP[user?.role] || []
  const settings = db.raw().settings || {}

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      {open && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0B2B3F]/40 backdrop-blur-sm lg:hidden dark:bg-black/50"
          aria-label="إغلاق القائمة"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-60 flex-col overflow-hidden border-l border-[#DCEAF3] bg-white/90 shadow-2xl shadow-[#0B5F7A]/10 backdrop-blur-xl transition-transform duration-200 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none lg:sticky lg:h-[calc(100vh-32px)] lg:translate-x-0  lg:border ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative border-b border-[#DCEAF3] px-4 py-4 dark:border-slate-700">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#BEE8F4]/30 blur-3xl dark:bg-cyan-400/10" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FA] text-sm font-black text-[#0B6F7A] shadow-sm dark:bg-cyan-400/15 dark:text-cyan-300">
                {user?.name?.charAt(0) || 'أ'}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-black text-[#0B2B3F] dark:text-slate-50">
                  {user?.name || settings.academyName || 'منصة الأوائل'}
                </p>

                <p className="truncate text-[11px] font-bold text-[#6B8293] dark:text-slate-400">
                  {ROLE_LABELS[user?.role] || 'حساب مستخدم'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-[#6B8293] transition-colors hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300 lg:hidden"
              aria-label="إغلاق القائمة"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 [scrollbar-width:thin]">
          {items.map((item) => {
            const Icon = ICONS[item.icon] || Circle

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-black transition-all duration-200',
                    isActive
                      ? 'bg-[#075B78] text-white shadow-lg shadow-[#075B78]/20 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none'
                      : 'text-[#41596B] hover:-translate-x-0.5 hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300'
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors',
                        isActive
                          ? 'bg-white/15 text-white dark:bg-slate-950/10 dark:text-slate-950'
                          : 'bg-white text-[#0B6F7A] shadow-sm group-hover:bg-white dark:bg-slate-900 dark:text-cyan-300 dark:group-hover:bg-slate-900'
                      ].join(' ')}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </span>

                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-[#DCEAF3] p-3 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-black text-red-600 transition-all hover:-translate-x-0.5 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-white dark:bg-red-500/10 dark:text-red-400 dark:group-hover:bg-red-500/15">
              <LogOut size={16} strokeWidth={2.2} />
            </span>

            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  )
}