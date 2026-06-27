import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { uid } from '../../utils/id.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Edit2, Plus, Trash2 } from 'lucide-react'

const emptyForm = () => ({ subjectId: '', title: '', description: '', order: 1 })

export default function SectionsManagement() {
  const toast = useToast()
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => {
    const courses = db.all('subjects')
    setSubjects(courses)
    setSections(db.all('sections').sort((a, b) => (a.order || 0) - (b.order || 0)))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm(), subjectId: subjects[0]?.id || '' })
    setOpen(true)
  }

  const openEdit = (section) => {
    setEditing(section)
    setForm({ ...section })
    setOpen(true)
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.subjectId || !form.title) return toast.error('أكمل بيانات القسم')
    if (editing) {
      db.update('sections', editing.id, { ...form, order: Number(form.order || 1) })
      toast.success('تم تحديث القسم')
    } else {
      db.insert('sections', {
        id: uid('sec'),
        ...form,
        order: Number(form.order || 1),
        createdAt: new Date().toISOString()
      })
      toast.success('تم إضافة القسم')
    }
    setOpen(false)
    load()
  }

  const remove = (id) => {
    if (!confirm('حذف القسم؟ ستبقى الدروس محفوظة ويمكن إعادة ربطها بقسم آخر.')) return
    db.remove('sections', id)
    toast.success('تم حذف القسم')
    load()
  }

  return (
    <Card className="!p-0">
      <div className="p-5 border-b border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        <CardHeader title="أقسام الكورسات" subtitle="قسّم كل كورس إلى وحدات واضحة." />
        <Button icon={Plus} onClick={openAdd}>قسم جديد</Button>
      </div>
      <Table
        columns={[
          { key: 'order', title: '#', render: (row) => <span className="font-bold">{row.order}</span> },
          { key: 'title', title: 'القسم', render: (row) => <span className="font-bold">{row.title}</span> },
          { key: 'course', title: 'الكورس', render: (row) => db.find('subjects', row.subjectId)?.name || '-' },
          { key: 'lessons', title: 'الدروس', render: (row) => db.all('lessons').filter((lesson) => lesson.sectionId === row.id).length },
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
        data={sections}
        empty="لا توجد أقسام بعد"
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل قسم' : 'إضافة قسم'} size="lg">
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="اسم القسم" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="الكورس" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))} />
          <Input label="الترتيب" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          <Textarea label="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'إضافة'}</Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}
