import { Bell, Menu } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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

const getUserAvatar = (user) => {
  return (
    user?.avatarUrl ||
    user?.photoUrl ||
    user?.imageUrl ||
    user?.profileImageUrl ||
    user?.profileImage ||
    user?.avatar ||"/images/user.webp"||
    ''
  )
}

export const Topbar = ({ onToggleSidebar, title }) => {
  const { user } = useAuth()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!user?.id) return undefined

    let cancelled = false

    const loadUnreadCount = async () => {
      try {
        const count = await notificationService.unreadCount(user.id)

        if (!cancelled) {
          setUnread(count)
        }
      } catch {
        if (!cancelled) {
          setUnread(0)
        }
      }
    }

    loadUnreadCount()

    const intervalId = setInterval(loadUnreadCount, 3000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [user?.id])

  const notificationsUrl = notifPath[user?.role] || '/student/notifications'
  const userName = user?.name || 'مستخدم'
  const userInitial = userName.charAt(0)
  const roleLabel = ROLE_LABELS[user?.role] || 'حساب مستخدم'

  const avatarSrc = useMemo(() => getUserAvatar(user), [user])

  return (
    <header
      dir="rtl"
      className="relative border-b border-[#DCEAF3] bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-700 dark:bg-slate-900/75"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#0B6F7A]/20 to-transparent dark:via-cyan-300/20" />

      <div className="flex min-h-[72px] items-center gap-3 px-4 md:px-5">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DCEAF3] bg-white/85 text-[#0B2B3F] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B6F7A]/30 hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800 dark:hover:text-cyan-300 lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-10 w-1 rounded-full bg-[#0B6F7A] dark:bg-cyan-400 sm:block" />

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#0B6F7A] dark:text-cyan-300">
                منصة الأوائل
              </p>

              <h1 className="mt-0.5 truncate text-lg font-black text-[#0B2B3F] dark:text-slate-50 md:text-xl">
                {title}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle compact />

          <Link
            to={notificationsUrl}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DCEAF3] bg-white/85 text-[#41596B] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B6F7A]/30 hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
            aria-label="الإشعارات"
          >
            <Bell size={19} />

            {unread > 0 && (
              <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black leading-none text-white ring-2 ring-white dark:ring-slate-900">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </Link>

          <div className="hidden h-8 w-px bg-[#DCEAF3] dark:bg-slate-700 md:block" />

          <div className="hidden items-center gap-3 rounded-2xl border border-[#DCEAF3] bg-white/70 px-3 py-2 shadow-sm backdrop-blur transition-colors dark:border-slate-700 dark:bg-slate-800/65 sm:flex">
            <UserAvatar
              src={avatarSrc}
              name={userName}
              fallback={userInitial}
            />

            <div className="min-w-0 text-right">
              <p className="max-w-[150px] truncate text-xs font-black text-[#0B2B3F] dark:text-slate-50">
                {userName}
              </p>

              <p className="mt-0.5 max-w-[150px] truncate text-[11px] font-bold text-[#6B8293] dark:text-slate-400">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function UserAvatar({ src, name, fallback }) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [src])

  if (src && !imageError) {
    return (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-[#DCEAF3] bg-[#E8F8FA] shadow-sm dark:border-slate-700 dark:bg-cyan-400/15">
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FA] text-sm font-black text-[#0B6F7A] shadow-sm dark:bg-cyan-400/15 dark:text-cyan-300">
      {fallback || 'أ'}
    </div>
  )
}