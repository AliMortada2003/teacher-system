export const Card = ({ className = '', children = null, hover = false, glow = false, ...props }) => (
  <section
    className={`surface relative p-5 ${hover ? 'transition-colors hover:border-brand-200' : ''} ${glow ? 'hover:border-brand-200' : ''} ${className}`}
    {...props}
  >
    {children}
  </section>
)

export const CardHeader = ({ title = '', subtitle = '', action = null, eyebrow = '' }) => (
  <div className="mb-4 flex items-start justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && <p className="mb-1 text-xs font-bold text-brand-600">{eyebrow}</p>}
      <h3 className="text-base font-bold text-ink-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm leading-6 text-ink-500">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

export const SectionPanel = ({ title = '', subtitle = '', action = null, children = null, className = '' }) => (
  <section className={`surface overflow-hidden ${className}`}>
    {(title || subtitle || action) && (
      <div className="panel-header flex items-start justify-between gap-4">
        <div className="min-w-0">
          {title && <h2 className="text-base font-bold text-ink-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm leading-6 text-ink-500">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    )}
    <div className="panel-body">{children}</div>
  </section>
)
