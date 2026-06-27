import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import { notificationService } from '../../services/notificationService.js'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react'
import { relativeTime } from '../../utils/date.js'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const ICON = { info: Info, warning: AlertTriangle, success: CheckCircle2 }
const TONE = { info: 'bg-brand-100 text-brand-600', warning: 'bg-amber-100 text-amber-600', success: 'bg-emerald-100 text-emerald-600' }

export default function Notifications() {
  const { user } = useAuth()
  const toast = useToast()
  const [list, setList] = useState([])

  const load = async () => {
    const data = await notificationService.listForUser(user.id)
    setList(data)
  }
  useEffect(() => { load() }, [user.id])

  const markAll = async () => {
    await notificationService.markAllRead(user.id)
    toast.success('تم تعليم الكل كمقروء')
    load()
  }

  const markOne = async (id) => {
    await notificationService.markRead(id)
    load()
  }

  const remove = async (id) => {
    await notificationService.remove(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-ink-900">الإشعارات</h2>
          <p className="text-sm text-ink-500">{list.filter((n) => !n.read).length} إشعار غير مقروء</p>
        </div>
        <Button variant="outline" icon={CheckCheck} onClick={markAll}>تعليم الكل كمقروء</Button>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Bell} title="لا توجد إشعارات" />
      ) : (
        <div className="space-y-2">
          {list.map((n, i) => {
            const Icon = ICON[n.type] || Info
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`card p-4 flex items-start gap-3 ${!n.read ? 'ring-2 ring-brand-100' : ''}`}
              >
                <div className={`${TONE[n.type] || TONE.info} p-2.5 rounded-xl`}><Icon size={18} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink-900">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="text-sm text-ink-500 mt-0.5">{n.body}</p>
                  <p className="text-[11px] text-ink-400 mt-1">{relativeTime(n.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!n.read && (
                    <button onClick={() => markOne(n.id)} className="p-2 rounded-lg hover:bg-ink-100 text-ink-500">
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button onClick={() => remove(n.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
