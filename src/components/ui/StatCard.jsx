import {
  Activity,
  Award,
  BookMarked,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Library,
  Receipt,
  Trophy,
  Users,
  Wallet,
  XCircle
} from 'lucide-react'

import { Counter } from './Counter.jsx'

const ICONS = {
  Activity,
  Award,
  BookMarked,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Library,
  Receipt,
  Trophy,
  Users,
  Wallet,
  XCircle
}

const TONES = {
  blue: {
    icon: 'bg-[#2563EB] text-white',
    glow: 'bg-[#2563EB]/18',
    ring: 'group-hover:border-[#2563EB]/35'
  },
  teal: {
    icon: 'bg-[#0B6F7A] text-white',
    glow: 'bg-[#0B6F7A]/18',
    ring: 'group-hover:border-[#0B6F7A]/35'
  },
  cyan: {
    icon: 'bg-[#089CC9] text-white',
    glow: 'bg-[#089CC9]/18',
    ring: 'group-hover:border-[#089CC9]/35'
  },
  green: {
    icon: 'bg-[#16A34A] text-white',
    glow: 'bg-[#16A34A]/18',
    ring: 'group-hover:border-[#16A34A]/35'
  },
  emerald: {
    icon: 'bg-[#14B8A6] text-white',
    glow: 'bg-[#14B8A6]/18',
    ring: 'group-hover:border-[#14B8A6]/35'
  },
  orange: {
    icon: 'bg-[#EA580C] text-white',
    glow: 'bg-[#EA580C]/18',
    ring: 'group-hover:border-[#EA580C]/35'
  },
  yellow: {
    icon: 'bg-[#CA8A04] text-white',
    glow: 'bg-[#CA8A04]/18',
    ring: 'group-hover:border-[#CA8A04]/35'
  },
  red: {
    icon: 'bg-[#DC2626] text-white',
    glow: 'bg-[#DC2626]/18',
    ring: 'group-hover:border-[#DC2626]/35'
  },
  burgundy: {
    icon: 'bg-[#9F1239] text-white',
    glow: 'bg-[#9F1239]/18',
    ring: 'group-hover:border-[#9F1239]/35'
  },
  violet: {
    icon: 'bg-[#7C3AED] text-white',
    glow: 'bg-[#7C3AED]/18',
    ring: 'group-hover:border-[#7C3AED]/35'
  },
  slate: {
    icon: 'bg-[#334155] text-white',
    glow: 'bg-[#334155]/16',
    ring: 'group-hover:border-[#334155]/35'
  },

  brand: {
    icon: 'bg-[#0B6F7A] text-white',
    glow: 'bg-[#0B6F7A]/18',
    ring: 'group-hover:border-[#0B6F7A]/35'
  },
  accent: {
    icon: 'bg-[#089CC9] text-white',
    glow: 'bg-[#089CC9]/18',
    ring: 'group-hover:border-[#089CC9]/35'
  },
  gold: {
    icon: 'bg-[#CA8A04] text-white',
    glow: 'bg-[#CA8A04]/18',
    ring: 'group-hover:border-[#CA8A04]/35'
  },
  dark: {
    icon: 'bg-[#334155] text-white',
    glow: 'bg-[#334155]/16',
    ring: 'group-hover:border-[#334155]/35'
  }
}

export const StatCard = ({
  title,
  value,
  icon = 'Activity',
  tone = 'brand',
  suffix = '',
  delta = undefined,
  hint = '',
  description = ''
}) => {
  const Icon = ICONS[icon] || Activity
  const currentTone = TONES[tone] || TONES.brand
  const text = description || hint

  return (
    <article
      className={[
        'group relative min-w-0 overflow-hidden rounded-[1.25rem] border border-[#DCEAF3] bg-white/85 shadow-lg shadow-[#0B5F7A]/10 backdrop-blur-xl transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0B5F7A]/12',
        'dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none',
        'sm:rounded-[1.6rem]',
        currentTone.ring
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute -left-8 -top-8 h-20 w-20 rounded-full blur-2xl sm:-left-10 sm:-top-10 sm:h-28 sm:w-28',
          currentTone.glow
        ].join(' ')}
      />

      <div className="relative flex min-w-0 flex-col gap-3 p-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 sm:block">
            <p className="min-w-0 truncate text-[10px] font-black leading-5 tracking-wide text-[#6B8293] dark:text-slate-400 sm:text-xs">
              {title}
            </p>

            <div
              className={[
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105 sm:hidden',
                currentTone.icon
              ].join(' ')}
            >
              <Icon size={18} strokeWidth={2.25} />
            </div>
          </div>

          <div className="mt-2 flex min-w-0 flex-wrap items-end gap-1.5 sm:mt-3 sm:gap-2">
            <Counter
              value={value}
              className="text-2xl font-black leading-none text-[#0B2B3F] dark:text-slate-50 sm:text-3xl"
            />

            {suffix && (
              <span className="mb-0.5 text-[10px] font-black text-[#6B8293] dark:text-slate-400 sm:mb-1 sm:text-xs">
                {suffix}
              </span>
            )}
          </div>

          {text && (
            <p className="mt-2 line-clamp-2 text-[10px] font-bold leading-4 text-[#41596B] dark:text-slate-300 sm:mt-3 sm:max-w-[220px] sm:text-xs sm:leading-5">
              {text}
            </p>
          )}

          {delta !== undefined && (
            <p
              className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black sm:mt-3 sm:px-2.5 sm:py-1 sm:text-xs ${
                delta >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
              }`}
            >
              {delta >= 0 ? 'صعود' : 'هبوط'} {Math.abs(delta)}%
            </p>
          )}
        </div>

        <div
          className={[
            'hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform duration-200 group-hover:scale-105 sm:flex',
            currentTone.icon
          ].join(' ')}
        >
          <Icon size={22} strokeWidth={2.25} />
        </div>
      </div>
    </article>
  )
}