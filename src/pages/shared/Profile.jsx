import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { CardHeader, SectionPanel } from '../../components/ui/Card.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { ROLE_LABELS } from '../../utils/constants.js'
import { authService } from '../../services/authService.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    city: user.city || '',
    bio: user.bio || ''
  })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const save = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await updateUser(form)
      toast.success('تم حفظ التغييرات')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const changePw = async (event) => {
    event.preventDefault()
    if (pw.next.length < 6) return toast.error('كلمة المرور 6 أحرف على الأقل')
    if (pw.next !== pw.confirm) return toast.error('كلمات المرور غير متطابقة')
    try {
      await authService.changePassword(user.id, pw.current, pw.next)
      toast.success('تم تغيير كلمة المرور')
      setPw({ current: '', next: '', confirm: '' })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="surface p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-600 text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-ink-900">{user.name}</h2>
            <p className="mt-1 text-sm text-ink-500">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2 border-t border-ink-100 pt-4">
          <InfoRow icon={Mail} value={user.email} />
          {user.phone && <InfoRow icon={Phone} value={user.phone} />}
          {user.city && <InfoRow icon={MapPin} value={user.city} />}
        </div>
      </aside>

      <div className="space-y-5">
        <SectionPanel title="البيانات الشخصية" subtitle="حدّث بياناتك الأساسية التي تظهر داخل المنصة.">
          <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
            <Input label="الاسم" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="البريد الإلكتروني" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="الهاتف" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Input label="المدينة" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <Textarea label="نبذة عنك" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="md:col-span-2" />
            <Button loading={loading} type="submit" className="md:col-span-2" icon={User}>حفظ التغييرات</Button>
          </form>
        </SectionPanel>

        <section className="surface p-5">
          <CardHeader title="تغيير كلمة المرور" subtitle="استخدم كلمة مرور من 6 أحرف على الأقل." />
          <form onSubmit={changePw} className="grid gap-4 md:grid-cols-3">
            <Input label="كلمة المرور الحالية" type="password" value={pw.current} onChange={(event) => setPw({ ...pw, current: event.target.value })} />
            <Input label="كلمة المرور الجديدة" type="password" value={pw.next} onChange={(event) => setPw({ ...pw, next: event.target.value })} />
            <Input label="تأكيد كلمة المرور" type="password" value={pw.confirm} onChange={(event) => setPw({ ...pw, confirm: event.target.value })} />
            <Button type="submit" icon={Lock} className="md:col-span-3">تحديث كلمة المرور</Button>
          </form>
        </section>
      </div>
    </div>
  )
}

const InfoRow = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-600">
    <Icon size={14} className="text-brand-600" />
    <span className="truncate">{value}</span>
  </div>
)
