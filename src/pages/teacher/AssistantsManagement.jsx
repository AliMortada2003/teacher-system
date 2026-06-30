import { useEffect, useMemo, useState } from 'react'
import { Edit2, Plus, ShieldCheck, Trash2, UserPlus, UsersRound } from 'lucide-react'
import { db } from '../../db/database.js'
import { userRepo } from '../../repositories/index.js'
import { ROLES } from '../../utils/constants.js'
import { Button } from '../../components/ui/Button.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate } from '../../utils/date.js'

const emptyForm = () => ({
  name: '',
  email: '',
  password: '123456',
  phone: '',
  city: 'القاهرة',
  status: 'active',
  bio: ''
})

const statusOptions = [
  { value: 'active', label: 'نشط' },
  { value: 'disabled', label: 'موقوف' }
]

export default function AssistantsManagement() {
  const toast = useToast()
  const [assistants, setAssistants] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => {
    setAssistants(
      db.all('users')
        .filter((user) => user.role === ROLES.ASSISTANT && !user.hidden)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  }

  useEffect(() => {
    load()
  }, [])

  const stats = useMemo(() => ({
    total: assistants.length,
    active: assistants.filter((assistant) => assistant.status !== 'disabled').length,
    disabled: assistants.filter((assistant) => assistant.status === 'disabled').length
  }), [assistants])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (assistant) => {
    setEditing(assistant)
    setForm({
      ...emptyForm(),
      ...assistant,
      password: assistant.password || '123456'
    })
    setOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()

    const email = form.email.trim().toLowerCase()
    if (!form.name.trim() || !email || !form.password.trim()) {
      toast.error('أكمل اسم المساعد والبريد وكلمة المرور')
      return
    }

    const duplicate = db.all('users').find(
      (user) => user.email?.toLowerCase() === email && user.id !== editing?.id
    )
    if (duplicate) {
      toast.error('هذا البريد مستخدم بالفعل')
      return
    }

    const payload = {
      role: ROLES.ASSISTANT,
      name: form.name.trim(),
      email,
      password: form.password.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      bio: form.bio.trim(),
      status: form.status,
      hidden: false
    }

    if (editing) {
      await userRepo.update(editing.id, payload)
      toast.success('تم تحديث بيانات المساعد')
    } else {
      await userRepo.create(payload)
      toast.success('تم إضافة المساعد بنجاح')
    }

    setOpen(false)
    load()
  }

  const remove = async (assistant) => {
    if (!confirm('سيتم إيقاف هذا المساعد وإخفاؤه من لوحة الإدارة. هل أنت متأكد؟')) return

    await userRepo.update(assistant.id, {
      hidden: true,
      status: 'disabled'
    })
    toast.success('تم إيقاف المساعد')
    load()
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <UsersRound size={15} />
              إدارة المساعدين
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              مساعدو المدرس داخل المنصة
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              المساعد يستطيع إدارة الكورسات والدروس والاختبارات والحضور والطلاب، بينما يظل إعداد المنصة وإدارة المساعدين للمدرس المالك فقط.
            </p>
          </div>

          <Button icon={UserPlus} onClick={openAdd}>
            مساعد جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="المساعدين" value={stats.total} icon="UsersRound" tone="blue" description="إجمالي الحسابات المساعدة." />
        <StatCard title="نشط" value={stats.active} icon="CheckCircle2" tone="green" description="مساعدون يمكنهم الدخول." />
        <StatCard title="موقوف" value={stats.disabled} icon="XCircle" tone="red" description="حسابات تم إيقافها." />
        <StatCard title="الصلاحيات" value={3} icon="ShieldCheck" tone="orange" description="كورسات، اختبارات، وحضور." />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader title="قائمة المساعدين" subtitle="أضف أو عدل حسابات المساعدين من هنا." />
        </div>

        {assistants.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={UsersRound}
              title="لا يوجد مساعدين"
              description="ابدأ بإضافة أول مساعد لإدارة الكورسات والدروس والحضور."
              action={<Button icon={Plus} onClick={openAdd}>إضافة مساعد</Button>}
            />
          </div>
        ) : (
          <Table
            columns={[
              { key: 'name', title: 'الاسم', render: (row) => <span className="font-black text-ink-900">{row.name}</span> },
              { key: 'email', title: 'البريد', render: (row) => row.email },
              { key: 'phone', title: 'الهاتف', render: (row) => row.phone || '-' },
              {
                key: 'status',
                title: 'الحالة',
                render: (row) => row.status === 'disabled' ? <Badge tone="danger">موقوف</Badge> : <Badge tone="success">نشط</Badge>
              },
              { key: 'date', title: 'تاريخ الإضافة', render: (row) => formatDate(row.createdAt) },
              {
                key: 'actions',
                title: 'الإجراءات',
                render: (row) => (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEdit(row)} aria-label="تعديل المساعد">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => remove(row)} aria-label="إيقاف المساعد">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              }
            ]}
            data={assistants}
          />
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل مساعد' : 'إضافة مساعد'} size="lg">
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input label="اسم المساعد" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Select label="الحالة" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={statusOptions} />
          <Textarea label="ملاحظات" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="md:col-span-2" />

          <div className="rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF] p-4 text-sm leading-7 text-[#41596B] dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 md:col-span-2">
            <ShieldCheck className="mb-2 text-[#0B6F7A] dark:text-cyan-300" size={18} />
            المساعد لديه صلاحية إدارة الكورسات والدروس والاختبارات والحضور والطلاب والطلبات، ولا يستطيع تعديل إعدادات المنصة أو إضافة مساعدين.
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ التعديلات' : 'إضافة المساعد'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
