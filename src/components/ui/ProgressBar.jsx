const toneStyles = {
  brand: 'bg-brand-600',
  accent: 'bg-accent-500',
  emerald: 'bg-emerald-500',
  danger: 'bg-red-500',
  warning: 'bg-amber-500'
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
        className="h-2 overflow-hidden rounded-full border border-ink-200 bg-ink-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className={`h-full rounded-full ${toneStyles[tone] || toneStyles.brand}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
