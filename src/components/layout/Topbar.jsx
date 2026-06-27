import { Bell, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { notificationService } from '../../services/notificationService.js'
import { ROLES, ROLE_LABELS } from '../../utils/constants.js'
import { ThemeToggle } from '../ui/ThemeToggle.jsx'

const notifPath = {
  [ROLES.STUDENT]: '/student/notifications',
  [ROLES.TEACHER]: '/teacher/announcements',
  [ROLES.ADMIN]: '/admin/notifications'
}

export const Topbar = ({ onToggleSidebar, title }) => {
  const { user } = useAuth()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    let cancel = false
    const load = async () => {
      const count = await notificationService.unreadCount(user.id)
      if (!cancel) setUnread(count)
    }
    load()
    const id = setInterval(load, 3000)
    return () => {
      cancel = true
      clearInterval(id)
    }
  }, [user.id])

  return (
    <header dir="ltr" className="border-b border-ink-100 bg-white">
      <div className="flex min-h-[58px] items-start gap-3 px-4">
        <div className="flex items-start gap-2">
          <div className="rounded-b-lg bg-brand-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-none">
            {title}
          </div>
          <button onClick={onToggleSidebar} className="mt-2 rounded-xl p-2 text-ink-700 transition-colors hover:bg-ink-100 lg:hidden" aria-label="فتح القائمة">
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1" />

        <div dir="rtl" className="flex items-center gap-2 py-3">
          <ThemeToggle compact />
          <Link
            to={notifPath[user.role]}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-colors hover:border-brand-200 hover:text-brand-700"
            aria-label="الإشعارات"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right">
              <p className="text-xs font-extrabold text-ink-900">{user.name}</p>
              <p className="text-[11px] text-ink-500">{ROLE_LABELS[user.role]}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-700">
              {user.name?.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
