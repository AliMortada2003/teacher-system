import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { NAV_ADMIN, NAV_STUDENT, NAV_TEACHER, ROLES, ROLE_LABELS } from '../../utils/constants.js'
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
          className="fixed inset-0 z-40 bg-ink-900/35 lg:hidden"
          aria-label="إغلاق القائمة"
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-[210px] flex-col border-l border-ink-200 bg-white transition-transform duration-200 lg:sticky lg:h-[calc(100vh-32px)] lg:translate-x-0 lg:rounded-xl lg:border lg:shadow-soft ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-4 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-ink-900">{user?.name || settings.academyName}</p>
              <p className="truncate text-[11px] font-medium text-ink-500">{ROLE_LABELS[user?.role]}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 lg:hidden" aria-label="إغلاق القائمة">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const Icon = ICONS[item.icon] || Circle
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} strokeWidth={2.1} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-ink-100 p-3">
          <button onClick={handleLogout} className="sidebar-item w-full text-red-600 hover:bg-red-50">
            <LogOut size={15} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  )
}
