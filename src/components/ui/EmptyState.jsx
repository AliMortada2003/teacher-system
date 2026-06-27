import { Inbox } from 'lucide-react'

export const EmptyState = ({ icon: Icon = Inbox, title = 'لا توجد بيانات', description = '', action = null }) => (
  <div className="rounded-xl border border-dashed border-ink-200 bg-white px-6 py-10 text-center">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-ink-50 text-ink-500">
      <Icon size={22} />
    </div>
    <h3 className="mb-1 text-base font-extrabold text-ink-900">{title}</h3>
    {description && <p className="mx-auto max-w-md text-sm leading-7 text-ink-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)
