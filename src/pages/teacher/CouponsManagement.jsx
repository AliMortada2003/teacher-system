import { useEffect, useMemo, useState } from 'react'
import { db } from '../../db/database.js'
import { uid } from '../../utils/id.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Edit2, Plus, TicketPercent, Trash2 } from 'lucide-react'
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

const typeOptions = [
  { value: 'percent', label: 'نسبة مئوية' },
  { value: 'fixed', label: 'قيمة ثابتة' }
]

const statusOptions = [
  { value: 'true', label: 'مفعل' },
  { value: 'false', label: 'متوقف' }
]

const isExpired = (coupon) => {
  if (!coupon.expiresAt) return false
  return new Date(coupon.expiresAt).getTime() < Date.now()
}

export default function CouponsManagement() {
  const toast = useToast()
  const [coupons, setCoupons] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => {
    setCoupons(
      db
        .all('coupons')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  }

  useEffect(() => {
    load()
  }, [])

  const stats = useMemo(() => {
    const active = coupons.filter((coupon) => coupon.active && !isExpired(coupon)).length
    const expired = coupons.filter(isExpired).length
    const used = coupons.reduce((sum, coupon) => sum + Number(coupon.usedCount || 0), 0)

    return {
      total: coupons.length,
      active,
      expired,
      used
    }
  }, [coupons])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (coupon) => {
    setEditing(coupon)
    setForm({
      ...emptyForm(),
      ...coupon,
      expiresAt: coupon.expiresAt?.slice(0, 10) || ''
    })
    setOpen(true)
  }

  const save = (event) => {
    event.preventDefault()

    if (!form.code.trim() || !form.title.trim()) {
      toast.error('أكمل بيانات الكوبون')
      return
    }

    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
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
    if (!confirm('سيتم حذف الكوبون. هل أنت متأكد؟')) return

    db.remove('coupons', id)
    toast.success('تم حذف الكوبون')
    load()
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <TicketPercent size={15} />
              إدارة الكوبونات
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              أكواد الخصم والعروض
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              أنشئ كوبونات خصم للطلاب، وحدد نوع الخصم وحد الاستخدام وتاريخ انتهاء الصلاحية.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd}>
            كوبون جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="الكوبونات"
          value={stats.total}
          icon="Receipt"
          tone="blue"
          description="إجمالي أكواد الخصم."
        />

        <StatCard
          title="المفعلة"
          value={stats.active}
          icon="CheckCircle2"
          tone="green"
          description="كوبونات صالحة للاستخدام."
        />

        <StatCard
          title="الاستخدامات"
          value={stats.used}
          icon="Activity"
          tone="orange"
          description="عدد مرات استخدام الكوبونات."
        />

        <StatCard
          title="منتهية"
          value={stats.expired}
          icon="Clock"
          tone="burgundy"
          description="كوبونات انتهت صلاحيتها."
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader
            title="قائمة الكوبونات"
            subtitle={`${coupons.length} كوبون داخل المنصة`}
          />
        </div>

        <Table
          columns={[
            {
              key: 'code',
              title: 'الكود',
              render: (row) => (
                <span className="rounded-xl bg-[#E8F8FA] px-3 py-1.5 text-xs font-black tracking-wide text-[#0B6F7A] dark:bg-cyan-400/10 dark:text-cyan-300">
                  {row.code}
                </span>
              )
            },
            { key: 'title', title: 'العنوان' },
            {
              key: 'value',
              title: 'القيمة',
              render: (row) =>
                row.type === 'percent' ? `${row.value}%` : `${row.value} EGP`
            },
            {
              key: 'usage',
              title: 'الاستخدام',
              render: (row) => `${row.usedCount || 0}/${row.usageLimit || '∞'}`
            },
            {
              key: 'active',
              title: 'الحالة',
              render: (row) =>
                isExpired(row) ? (
                  <Badge tone="danger">منتهي</Badge>
                ) : (
                  <Badge tone={row.active ? 'success' : 'default'}>
                    {row.active ? 'مفعل' : 'متوقف'}
                  </Badge>
                )
            },
            {
              key: 'expires',
              title: 'الصلاحية',
              render: (row) => row.expiresAt ? formatDate(row.expiresAt) : 'بدون انتهاء'
            },
            {
              key: 'actions',
              title: 'الإجراءات',
              render: (row) => (
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(row)} aria-label="تعديل الكوبون">
                    <Edit2 size={16} />
                  </button>

                  <button type="button" onClick={() => remove(row.id)} aria-label="حذف الكوبون">
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={coupons}
          empty="لا توجد كوبونات"
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'تعديل كوبون' : 'إضافة كوبون'}
        size="lg"
      >
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input
            label="الكود"
            value={form.code}
            onChange={(event) => setForm({ ...form, code: event.target.value })}
            placeholder="SUMMER20"
            required
          />

          <Input
            label="العنوان"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="خصم بداية الترم"
            required
          />

          <Select
            label="النوع"
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            options={typeOptions}
          />

          <Input
            label="القيمة"
            type="number"
            value={form.value}
            onChange={(event) => setForm({ ...form, value: event.target.value })}
          />

          <Input
            label="حد الاستخدام"
            type="number"
            value={form.usageLimit}
            onChange={(event) => setForm({ ...form, usageLimit: event.target.value })}
          />

          <Input
            label="تاريخ الانتهاء"
            type="date"
            value={form.expiresAt || ''}
            onChange={(event) => setForm({ ...form, expiresAt: event.target.value })}
          />

          <Select
            label="الحالة"
            value={form.active ? 'true' : 'false'}
            onChange={(event) =>
              setForm({ ...form, active: event.target.value === 'true' })
            }
            options={statusOptions}
            className="md:col-span-2"
          />

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>

            <Button type="submit">
              {editing ? 'حفظ التعديلات' : 'إضافة الكوبون'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}