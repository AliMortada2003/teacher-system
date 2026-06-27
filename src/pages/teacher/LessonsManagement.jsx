import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { lessonRepo } from '../../repositories/index.js'
import { db } from '../../db/database.js'
import { uid } from '../../utils/id.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const emptyForm = () => ({
  title: '',
  summary: '',
  content: '',
  duration: 45,
  subjectId: '',
  sectionId: '',
  videoUrl: '',
  resourceTitle: '',
  order: 1
})

export default function LessonsManagement() {
  const { user } = useAuth()
  const toast = useToast()
  const [lessons, setLessons] = useState([])
  const [subjects, setSubjects] = useState([])
  const [sections, setSections] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = async () => {
    const subs = db.all('subjects')
    const secs = db.all('sections')
    setSubjects(subs)
    setSections(secs)
    const all = await lessonRepo.list((lesson) => lesson.teacherId === user.id)
    setLessons(all.sort((a, b) => (a.order || 0) - (b.order || 0)))
  }

  useEffect(() => { load() }, [user.id])

  const subjectSections = sections.filter((section) => section.subjectId === form.subjectId)

  const openAdd = () => {
    const firstSubject = subjects[0]?.id || ''
    const firstSection = sections.find((section) => section.subjectId === firstSubject)?.id || ''
    setEditing(null)
    setForm({ ...emptyForm(), subjectId: firstSubject, sectionId: firstSection, order: lessons.length + 1 })
    setOpen(true)
  }

  const openEdit = (lesson) => {
    const resource = db.all('resources').find((item) => lesson.resourceIds?.includes(item.id))
    setEditing(lesson)
    setForm({
      ...emptyForm(),
      ...lesson,
      resourceTitle: resource?.title || ''
    })
    setOpen(true)
  }

  const saveResource = (lesson, title) => {
    if (!title) return lesson.resourceIds || []
    const existing = db.all('resources').find((resource) => lesson.resourceIds?.includes(resource.id))
    if (existing) {
      db.update('resources', existing.id, { title, subjectId: lesson.subjectId })
      return lesson.resourceIds
    }
    const resource = db.insert('resources', {
      id: uid('res'),
      lessonId: lesson.id,
      subjectId: lesson.subjectId,
      title,
      type: 'pdf',
      size: '320 KB',
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(`مورد الدرس: ${title}`)}`,
      downloads: 0,
      createdAt: new Date().toISOString()
    })
    return [...(lesson.resourceIds || []), resource.id]
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.title || !form.subjectId) return toast.error('الرجاء إكمال بيانات الدرس')
    const payload = {
      title: form.title,
      summary: form.summary,
      content: form.content || form.summary,
      duration: Number(form.duration || 0),
      subjectId: form.subjectId,
      sectionId: form.sectionId || subjectSections[0]?.id || '',
      videoUrl: form.videoUrl,
      order: Number(form.order || 1)
    }
    if (editing) {
      const updated = await lessonRepo.update(editing.id, payload)
      const resourceIds = saveResource(updated, form.resourceTitle)
      await lessonRepo.update(editing.id, { resourceIds })
      toast.success('تم تعديل الدرس')
    } else {
      const created = await lessonRepo.create({ ...payload, teacherId: user.id, resourceIds: [] })
      const resourceIds = saveResource(created, form.resourceTitle)
      await lessonRepo.update(created.id, { resourceIds })
      toast.success('تم إضافة الدرس')
    }
    setOpen(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('هل أنت متأكد من حذف الدرس؟')) return
    await lessonRepo.remove(id)
    toast.success('تم الحذف')
    load()
  }

  return (
    <div className="space-y-5">
      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100 flex items-center justify-between gap-3 flex-wrap">
          <CardHeader title="إدارة الدروس" subtitle={`${lessons.length} درس`} />
          <Button icon={Plus} onClick={openAdd}>درس جديد</Button>
        </div>
        <Table
          columns={[
            { key: 'order', title: '#', render: (row) => <span className="font-bold">{row.order}</span> },
            { key: 'title', title: 'العنوان', render: (row) => <span className="font-semibold">{row.title}</span> },
            { key: 'subject', title: 'الكورس', render: (row) => db.find('subjects', row.subjectId)?.name },
            { key: 'section', title: 'القسم', render: (row) => db.find('sections', row.sectionId)?.title || '-' },
            { key: 'duration', title: 'المدة', render: (row) => `${row.duration} د` },
            { key: 'resources', title: 'الموارد', render: (row) => <Badge tone="brand">{row.resourceIds?.length || 0}</Badge> },
            { key: 'date', title: 'التاريخ', render: (row) => formatDate(row.createdAt) },
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
          data={lessons}
          empty="لم تضف أي دروس بعد"
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل الدرس' : 'إضافة درس جديد'} size="xl">
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="عنوان الدرس" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select
            label="الكورس"
            value={form.subjectId}
            onChange={(e) => {
              const nextSubject = e.target.value
              setForm({
                ...form,
                subjectId: nextSubject,
                sectionId: sections.find((section) => section.subjectId === nextSubject)?.id || ''
              })
            }}
            options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
          />
          <Select
            label="القسم"
            value={form.sectionId}
            onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
            options={subjectSections.map((section) => ({ value: section.id, label: section.title }))}
          />
          <Input label="المدة (دقائق)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Input label="الترتيب" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          <Input label="رابط الفيديو (اختياري)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          <Input label="عنوان مورد قابل للتحميل" value={form.resourceTitle} onChange={(e) => setForm({ ...form, resourceTitle: e.target.value })} className="md:col-span-2" />
          <Textarea label="ملخص الدرس" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="md:col-span-2" />
          <Textarea label="محتوى المشغل" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="md:col-span-2" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'إضافة'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
