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
  brand: 'text-brand-600 bg-brand-50 border-brand-100',
  accent: 'text-accent-600 bg-accent-50 border-accent-100',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  violet: 'text-slate-600 bg-slate-100 border-slate-200',
  gold: 'text-amber-600 bg-amber-50 border-amber-100',
  dark: 'text-slate-700 bg-slate-100 border-slate-200'
}

export const StatCard = ({ title, value, icon = 'Activity', tone = 'brand', suffix = '', delta = undefined, hint = '' }) => {
  const Icon = ICONS[icon] || Activity

  return (
    <article className="surface overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-ink-500">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <Counter value={value} className="text-3xl font-extrabold text-ink-900" />
            {suffix && <span className="text-xs font-extrabold text-ink-500">{suffix}</span>}
          </div>
          {hint && <p className="mt-2 text-xs leading-5 text-ink-500">{hint}</p>}
          {delta !== undefined && (
            <p className={`mt-2 text-xs font-bold ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {delta >= 0 ? 'صعود' : 'هبوط'} {Math.abs(delta)}%
            </p>
          )}
        </div>
        <div className={`rounded-xl border p-2.5 ${TONES[tone] || TONES.brand}`}>
          <Icon size={19} />
        </div>
      </div>
    </article>
  )
}
