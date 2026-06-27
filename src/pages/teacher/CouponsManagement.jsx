import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { uid } from '../../utils/id.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const emptyForm = () => ({
  code: '',
  title: '',
  type: 'percent',
  value: 10,
  active: true,
  usageLimit: 100,
  expiresAt: ''
})

export default function CouponsManagement() {
  const toast = useToast()
  const [coupons, setCoupons] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => setCoupons(db.all('coupons').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (coupon) => {
    setEditing(coupon)
    setForm({ ...emptyForm(), ...coupon, expiresAt: coupon.expiresAt?.slice(0, 10) || '' })
    setOpen(true)
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.code || !form.title) return toast.error('أكمل بيانات الكوبون')
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      value: Number(form.value || 0),
      usageLimit: Number(form.usageLimit || 0),
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null
    }
    if (editing) {
      db.update('coupons', editing.id, payload)
      toast.success('تم تحديث الكوبون')
    } else {
      db.insert('coupons', {
        id: uid('cpn'),
        ...payload,
        usedCount: 0,
        createdAt: new Date().toISOString()
      })
      toast.success('تم إضافة الكوبون')
    }
    setOpen(false)
    load()
  }

  const remove = (id) => {
    if (!confirm('حذف الكوبون؟')) return
    db.remove('coupons', id)
    toast.success('تم حذف الكوبون')
    load()
  }

  return (
    <Card className="!p-0">
      <div className="p-5 border-b border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        <CardHeader title="الكوبونات" subtitle="أكواد خصم محلية تستخدم في صفحة الشراء." />
        <Button icon={Plus} onClick={openAdd}>كوبون جديد</Button>
      </div>
      <Table
        columns={[
          { key: 'code', title: 'الكود', render: (row) => <span className="font-extrabold text-brand-600">{row.code}</span> },
          { key: 'title', title: 'العنوان' },
          { key: 'value', title: 'القيمة', render: (row) => row.type === 'percent' ? `${row.value}%` : `${row.value} EGP` },
          { key: 'usage', title: 'الاستخدام', render: (row) => `${row.usedCount || 0}/${row.usageLimit || '∞'}` },
          { key: 'active', title: 'الحالة', render: (row) => <Badge tone={row.active ? 'success' : 'default'}>{row.active ? 'مفعل' : 'متوقف'}</Badge> },
          { key: 'expires', title: 'الصلاحية', render: (row) => row.expiresAt ? formatDate(row.expiresAt) : 'بدون انتهاء' },
          {
            key: 'actions',
            title: 'الإجراءات',
            render: (row) => (
              <div className="flex gap-1">
                <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-brand-50 text-brand-600"><Edit2 size={16} /></button>
                <button onClick={() => remove(row.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
              </div>
            )
          }
        ]}
        data={coupons}
        empty="لا توجد كوبونات"
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل كوبون' : 'إضافة كوبون'} size="lg">
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="الكود" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <Input label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="النوع" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={[
            { value: 'percent', label: 'نسبة مئوية' },
            { value: 'fixed', label: 'قيمة ثابتة' }
          ]} />
          <Input label="القيمة" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Input label="حد الاستخدام" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          <Input label="تاريخ الانتهاء" type="date" value={form.expiresAt || ''} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <Select label="الحالة" value={form.active ? 'true' : 'false'} onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })} options={[
            { value: 'true', label: 'مفعل' },
            { value: 'false', label: 'متوقف' }
          ]} className="md:col-span-2" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'إضافة'}</Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}
