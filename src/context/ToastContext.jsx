import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const TOASTS = {
  success: { icon: CheckCircle2, iconClass: 'text-emerald-600 bg-emerald-50 border-emerald-100', title: 'تم بنجاح' },
  error: { icon: XCircle, iconClass: 'text-red-600 bg-red-50 border-red-100', title: 'حدث خطأ' },
  info: { icon: Info, iconClass: 'text-brand-600 bg-brand-50 border-brand-100', title: 'تنبيه' },
  warning: { icon: AlertTriangle, iconClass: 'text-amber-600 bg-amber-50 border-amber-100', title: 'تحذير' }
}

let idCounter = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const push = useCallback((type, message, duration = 3000) => {
    const id = ++idCounter
    setToasts((current) => [...current, { id, type, message }])
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), duration)
  }, [])

  const api = {
    success: (message) => push('success', message),
    error: (message) => push('error', message),
    info: (message) => push('info', message),
    warning: (message) => push('warning', message)
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed left-4 top-4 z-[1000] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const meta = TOASTS[toast.type] || TOASTS.info
            const Icon = meta.icon
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
                className="pointer-events-auto rounded-[14px] border border-ink-200 bg-white p-3 shadow-elevated"
                role="status"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 rounded-xl border p-2 ${meta.iconClass}`}>
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink-900">{meta.title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-ink-600">{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
