import { useEffect, useState } from 'react'
import { notificationService } from '../../services/notificationService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Send, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { relativeTime } from '../../utils/date.js'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export default function AdminNotifications() {
  const toast = useToast()
  const { user } = useAuth()
  const [form, setForm] = useState({ role: 'all', title: '', body: '', type: 'info' })
  const [mine, setMine] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setMine(await notificationService.listForUser(user.id))
  }

  useEffect(() => { load() }, [user.id])

  const send = async (event) => {
    event.preventDefault()
    if (!form.title || !form.body) return toast.error('أكمل البيانات')
    setLoading(true)
    try {
      const count = await notificationService.sendToRole(form.role, { title: form.title, body: form.body, type: form.type })
      toast.success(`تم إرسال الإشعار إلى ${count} مستخدم`)
      setForm({ ...form, title: '', body: '' })
      load()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader title="إرسال إشعار جماعي" subtitle="إرسال إشعار للطلاب أو لكل المستخدمين الظاهرين." />
        <form onSubmit={send} className="space-y-4">
          <Select
            label="المستلمون"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[
              { value: 'all', label: 'الجميع' },
              { value: 'student', label: 'الطلاب' },
              { value: 'admin', label: 'المالك' }
            ]}
          />
          <Select
            label="النوع"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { value: 'info', label: 'معلومات' },
              { value: 'success', label: 'نجاح' },
              { value: 'warning', label: 'تنبيه' }
            ]}
          />
          <Input label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="النص" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Button type="submit" loading={loading} icon={Send} className="w-full">إرسال</Button>
        </form>
      </Card>

      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100"><CardHeader title="إشعاراتي" /></div>
        {mine.length === 0 ? (
          <EmptyState icon={Bell} title="لا توجد إشعارات" />
        ) : (
          <div className="divide-y divide-ink-100 max-h-[500px] overflow-y-auto">
            {mine.map((notification) => (
              <div key={notification.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">{notification.title}</p>
                  <Badge tone={notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'}>{notification.type}</Badge>
                </div>
                <p className="text-sm text-ink-500 mt-1">{notification.body}</p>
                <p className="text-xs text-ink-400 mt-1">{relativeTime(notification.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
