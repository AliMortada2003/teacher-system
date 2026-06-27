import { useEffect, useState } from 'react'
import { userRepo } from '../../repositories/index.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { ROLES } from '../../utils/constants.js'

export default function StudentsManagement() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '123456', phone: '', city: '', grade: '', subjectIds: [] })

  const load = async () => {
    setRows(await userRepo.list((u) => u.role === ROLES.STUDENT))
    setSubjects(db.all('subjects'))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', password: '123456', phone: '', city: '', grade: 'الصف العاشر', subjectIds: [] })
    setOpen(true)
  }
  const openEdit = (s) => {
    setEditing(s)
    setForm({ ...s, password: s.password })
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return toast.error('أكمل البيانات')
    if (editing) {
      await userRepo.update(editing.id, form)
      toast.success('تم التحديث')
    } else {
      await userRepo.create({ ...form, role: ROLES.STUDENT, status: 'active' })
      toast.success('تم إضافة الطالب')
    }
    setOpen(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('حذف الطالب؟')) return
    await userRepo.remove(id)
    toast.success('تم الحذف')
    load()
  }

  const toggleSubject = (id) => setForm((f) => ({
    ...f,
    subjectIds: f.subjectIds.includes(id) ? f.subjectIds.filter((x) => x !== id) : [...f.subjectIds, id]
  }))

  const filtered = rows.filter((r) =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100 flex items-center justify-between flex-wrap gap-3">
          <CardHeader title="الطلاب" subtitle={`${filtered.length} طالب`} />
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-400" size={16} />
              <input className="input !py-2 !pr-9 w-60" placeholder="ابحث..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button icon={Plus} onClick={openAdd}>طالب جديد</Button>
          </div>
        </div>
        <Table
          columns={[
            { key: 'name', title: 'الاسم', render: (r) => <span className="font-bold">{r.name}</span> },
            { key: 'email', title: 'البريد' },
            { key: 'grade', title: 'الصف', render: (r) => r.grade || '-' },
            { key: 'subjects', title: 'المواد', render: (r) => <Badge tone="brand">{r.subjectIds?.length || 0}</Badge> },
            { key: 'phone', title: 'الهاتف', render: (r) => r.phone || '-' },
            {
              key: 'a', title: 'الإجراءات', render: (r) => (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-brand-50 text-brand-600"><Edit2 size={16} /></button>
                  <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                </div>
              )
            }
          ]}
          data={filtered}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل طالب' : 'إضافة طالب'} size="lg">
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="البريد" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input label="الصف الدراسي" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
          <Input label="الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <div className="md:col-span-2">
            <label className="label">المواد المسجّلة</label>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {subjects.map((s) => (
                <button key={s.id} type="button" onClick={() => toggleSubject(s.id)}
                  className={`text-right px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
                    form.subjectIds.includes(s.id) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 hover:border-brand-300'
                  }`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'إضافة'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
