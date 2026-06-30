import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl'
  }

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
        >
          <button
            type="button"
            className="fixed inset-0 cursor-default bg-[#0B1220]/45 backdrop-blur-sm"
            onClick={onClose}
            aria-label="إغلاق النافذة"
          />

          <div className="relative flex min-h-full w-full items-start justify-center px-4 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`relative flex max-h-[calc(100vh-48px)] w-full ${sizes[size] || sizes.md} flex-col overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/95 shadow-2xl shadow-[#0B1220]/20 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/30`}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex items-center justify-between gap-4 border-b border-[#DCEAF3] bg-white/80 px-5 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-[#0B6F7A] dark:text-cyan-300">
                    منصة الأوائل
                  </p>

                  <h3 className="mt-0.5 truncate text-base font-black text-[#0B2B3F] dark:text-slate-50">
                    {title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[#6B8293] transition-colors hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                  aria-label="إغلاق"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}