import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { uid } from '../../utils/id.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const emptyForm = () => ({
  subjectId: '',
  title: '',
  instructions: '',
  points: 20,
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  published: true
})

export default function AssignmentsManagement() {
  const toast = useToast()
  const [assignments, setAssignments] = useState([])
  const [subjects, setSubjects] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => {
    setSubjects(db.all('subjects'))
    setAssignments(db.all('assignments').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm(), subjectId: subjects[0]?.id || '' })
    setOpen(true)
  }

  const openEdit = (assignment) => {
    setEditing(assignment)
    setForm({ ...assignment, dueDate: assignment.dueDate?.slice(0, 10) || '' })
    setOpen(true)
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.subjectId || !form.title) return toast.error('أكمل بيانات الواجب')
    const payload = {
      ...form,
      points: Number(form.points || 0),
      dueDate: new Date(form.dueDate).toISOString()
    }
    if (editing) {
      db.update('assignments', editing.id, payload)
      toast.success('تم تحديث الواجب')
    } else {
      db.insert('assignments', {
        id: uid('asg'),
        ...payload,
        createdAt: new Date().toISOString()
      })
      toast.success('تم إضافة الواجب')
    }
    setOpen(false)
    load()
  }

  const remove = (id) => {
    if (!confirm('حذف الواجب؟')) return
    db.remove('assignments', id)
    toast.success('تم حذف الواجب')
    load()
  }

  return (
    <Card className="!p-0">
      <div className="p-5 border-b border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        <CardHeader title="الواجبات" subtitle="أنشئ مهام تطبيقية مرتبطة بالكورسات." />
        <Button icon={Plus} onClick={openAdd}>واجب جديد</Button>
      </div>
      <Table
        columns={[
          { key: 'title', title: 'الواجب', render: (row) => <span className="font-bold">{row.title}</span> },
          { key: 'course', title: 'الكورس', render: (row) => db.find('subjects', row.subjectId)?.name || '-' },
          { key: 'points', title: 'الدرجة' },
          { key: 'submissions', title: 'التسليمات', render: (row) => db.all('assignmentSubmissions').filter((item) => item.assignmentId === row.id).length },
          { key: 'status', title: 'الحالة', render: (row) => <Badge tone={row.published ? 'success' : 'warning'}>{row.published ? 'منشور' : 'مسودة'}</Badge> },
          { key: 'due', title: 'الموعد', render: (row) => formatDate(row.dueDate) },
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
        data={assignments}
        empty="لا توجد واجبات بعد"
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل واجب' : 'إضافة واجب'} size="lg">
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="عنوان الواجب" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="الكورس" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))} />
          <Input label="الدرجة" type="number" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
          <Input label="الموعد النهائي" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <Select label="الحالة" value={form.published ? 'true' : 'false'} onChange={(e) => setForm({ ...form, published: e.target.value === 'true' })} options={[
            { value: 'true', label: 'منشور' },
            { value: 'false', label: 'مسودة' }
          ]} />
          <Textarea label="تعليمات الواجب" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="md:col-span-2" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'إضافة'}</Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}
