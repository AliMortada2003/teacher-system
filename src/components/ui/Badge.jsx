const tones = {
  default: 'border-[#DCEAF3] bg-[#F7FBFF] text-[#41596B] before:bg-[#6B8293] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:before:bg-slate-400',
  brand: 'border-[#CBEAF0] bg-[#E8F8FA] text-[#0B6F7A] before:bg-[#0B6F7A] dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-300 dark:before:bg-cyan-300',
  success: 'border-[#C8F2EA] bg-[#E8FBF8] text-[#14B8A6] before:bg-[#14B8A6] dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:before:bg-emerald-300',
  warning: 'border-[#CDEFF8] bg-[#EAF7FC] text-[#089CC9] before:bg-[#089CC9] dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-300 dark:before:bg-sky-300',
  danger: 'border-red-100 bg-red-50 text-red-700 before:bg-red-500 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-300 dark:before:bg-red-300',
  info: 'border-[#CDEFF8] bg-[#EAF7FC] text-[#089CC9] before:bg-[#089CC9] dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-300 dark:before:bg-sky-300'
}

export const Badge = ({ tone = 'default', children, className = '' }) => (
  <span className={`chip before:h-1.5 before:w-1.5 before:rounded-full ${tones[tone] || tones.default} ${className}`}>
    {children}
  </span>
)
