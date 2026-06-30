import { useEffect, useMemo, useState } from 'react'
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
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { BookOpenText, Edit2, FileText, Plus, Trash2 } from 'lucide-react'
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
    const all = await lessonRepo.list((lesson) => lesson.teacherId === user.id)

    setSubjects(subs)
    setSections(secs)
    setLessons(all.sort((a, b) => (a.order || 0) - (b.order || 0)))
  }

  useEffect(() => {
    load()
  }, [user.id])

  const subjectSections = sections.filter((section) => section.subjectId === form.subjectId)

  const stats = useMemo(() => {
    const withVideo = lessons.filter((lesson) => lesson.videoUrl).length
    const resources = lessons.reduce((sum, lesson) => sum + (lesson.resourceIds?.length || 0), 0)
    const totalDuration = lessons.reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0)

    return {
      total: lessons.length,
      withVideo,
      resources,
      totalDuration
    }
  }, [lessons])

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
    setForm({ ...emptyForm(), ...lesson, resourceTitle: resource?.title || '' })
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

  const save = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.subjectId) {
      toast.error('الرجاء إكمال بيانات الدرس')
      return
    }

    const payload = {
      title: form.title.trim(),
      summary: form.summary?.trim(),
      content: form.content?.trim() || form.summary?.trim(),
      duration: Number(form.duration || 0),
      subjectId: form.subjectId,
      sectionId: form.sectionId || subjectSections[0]?.id || '',
      videoUrl: form.videoUrl?.trim(),
      order: Number(form.order || 1)
    }

    if (editing) {
      const updated = await lessonRepo.update(editing.id, payload)
      const resourceIds = saveResource(updated, form.resourceTitle?.trim())
      await lessonRepo.update(editing.id, { resourceIds })
      toast.success('تم تعديل الدرس')
    } else {
      const created = await lessonRepo.create({ ...payload, teacherId: user.id, resourceIds: [] })
      const resourceIds = saveResource(created, form.resourceTitle?.trim())
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
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <BookOpenText size={15} />
              إدارة الدروس
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              دروس الكورسات وأقسامها
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              أضف الدروس، اربطها بالكورس والقسم، وحدد الفيديو والمورد المساعد وترتيب الظهور.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd}>
            درس جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="الدروس" value={stats.total} icon="BookMarked" tone="blue" description="إجمالي الدروس." />
        <StatCard title="بها فيديو" value={stats.withVideo} icon="FileText" tone="green" description="دروس مرتبطة بفيديو." />
        <StatCard title="الموارد" value={stats.resources} icon="Download" tone="orange" description="موارد مساعدة للطلاب." />
        <StatCard title="إجمالي الدقائق" value={stats.totalDuration} icon="Clock" tone="burgundy" description="مدة كل الدروس." />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader title="قائمة الدروس" subtitle={`${lessons.length} درس داخل المنصة`} />
        </div>

        {lessons.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={BookOpenText} title="لم تضف أي دروس بعد" description="ابدأ بإضافة أول درس وربطه بالكورس والقسم المناسب." action={<Button icon={Plus} onClick={openAdd}>إضافة درس</Button>} />
          </div>
        ) : (
          <Table
            columns={[
              { key: 'order', title: '#', render: (row) => <span className="font-black text-[#0B6F7A] dark:text-cyan-300">{row.order}</span> },
              { key: 'title', title: 'العنوان', render: (row) => <span className="font-black text-[#0B2B3F] dark:text-slate-50">{row.title}</span> },
              { key: 'subject', title: 'الكورس', render: (row) => db.find('subjects', row.subjectId)?.name || '-' },
              { key: 'section', title: 'القسم', render: (row) => db.find('sections', row.sectionId)?.title || '-' },
              { key: 'duration', title: 'المدة', render: (row) => `${row.duration} د` },
              { key: 'resources', title: 'الموارد', render: (row) => <Badge tone="brand">{row.resourceIds?.length || 0}</Badge> },
              { key: 'date', title: 'التاريخ', render: (row) => formatDate(row.createdAt) },
              {
                key: 'actions',
                title: 'الإجراءات',
                render: (row) => (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEdit(row)} aria-label="تعديل الدرس"><Edit2 size={16} /></button>
                    <button type="button" onClick={() => remove(row.id)} aria-label="حذف الدرس"><Trash2 size={16} /></button>
                  </div>
                )
              }
            ]}
            data={lessons}
            empty="لم تضف أي دروس بعد"
          />
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل الدرس' : 'إضافة درس جديد'} size="xl">
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input label="عنوان الدرس" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="الكورس" value={form.subjectId} onChange={(e) => { const nextSubject = e.target.value; setForm({ ...form, subjectId: nextSubject, sectionId: sections.find((section) => section.subjectId === nextSubject)?.id || '' }) }} options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))} />
          <Select label="القسم" value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} options={subjectSections.map((section) => ({ value: section.id, label: section.title }))} />
          <Input label="المدة (دقائق)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Input label="الترتيب" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          <Input label="رابط الفيديو (اختياري)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          <Input label="عنوان مورد الدرس" value={form.resourceTitle} onChange={(e) => setForm({ ...form, resourceTitle: e.target.value })} className="md:col-span-2" />
          <Textarea label="ملخص الدرس" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="md:col-span-2" />
          <Textarea label="محتوى المشغل" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="md:col-span-2" />

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ التعديلات' : 'إضافة الدرس'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}