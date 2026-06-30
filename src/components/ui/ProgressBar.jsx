const toneStyles = {
  brand: 'bg-[#0B6F7A] dark:bg-cyan-400',
  accent: 'bg-[#089CC9] dark:bg-sky-400',
  emerald: 'bg-[#14B8A6] dark:bg-emerald-400',
  danger: 'bg-red-500',
  warning: 'bg-[#089CC9] dark:bg-sky-400',
  gold: 'bg-[#0B6F7A] dark:bg-cyan-400'
}

export const ProgressBar = ({ value = 0, tone = 'brand', showLabel = true, className = '' }) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0))

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-500">
          <span>التقدم</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-2 overflow-hidden rounded-full border border-[#DCEAF3] bg-[#EEF6F8] dark:border-slate-700 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className={`h-full rounded-full ${toneStyles[tone] || toneStyles.brand}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
