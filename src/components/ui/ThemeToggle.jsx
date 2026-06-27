import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

export const ThemeToggle = ({ compact = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm font-bold text-ink-700 transition-colors duration-150 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-brand-900/40 ${compact ? 'w-10 px-0' : ''} ${className}`}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <Icon size={17} />
      {!compact && <span>{isDark ? 'فاتح' : 'داكن'}</span>}
    </button>
  )
}
