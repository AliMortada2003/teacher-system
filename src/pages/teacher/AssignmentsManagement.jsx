import { useEffect, useMemo, useState } from 'react'
import { db } from '../../db/database.js'
import { uid } from '../../utils/id.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Edit2, FileText, Plus, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const emptyForm = () => ({
  subjectId: '',
  title: '',
  instructions: '',
  points: 20,
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  published: true
})

const statusOptions = [
  { value: 'true', label: 'منشور' },
  { value: 'false', label: 'مسودة' }
]

export default function AssignmentsManagement() {
  const toast = useToast()
  const [assignments, setAssignments] = useState([])
  const [subjects, setSubjects] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => {
    setSubjects(db.all('subjects'))
    setAssignments(
      db
        .all('assignments')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  }

  useEffect(() => {
    load()
  }, [])

  const submissions = useMemo(() => db.all('assignmentSubmissions'), [assignments])

  const stats = useMemo(() => {
    const published = assignments.filter((item) => item.published).length
    const totalSubmissions = submissions.length
    const totalPoints = assignments.reduce((sum, item) => sum + Number(item.points || 0), 0)

    return {
      total: assignments.length,
      published,
      submissions: totalSubmissions,
      points: totalPoints
    }
  }, [assignments, submissions])

  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name
  }))

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm(), subjectId: subjects[0]?.id || '' })
    setOpen(true)
  }

  const openEdit = (assignment) => {
    setEditing(assignment)
    setForm({
      ...assignment,
      dueDate: assignment.dueDate?.slice(0, 10) || ''
    })
    setOpen(true)
  }

  const save = (event) => {
    event.preventDefault()

    if (!form.subjectId || !form.title.trim()) {
      toast.error('أكمل بيانات الواجب')
      return
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      instructions: form.instructions?.trim(),
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
    if (!confirm('سيتم حذف الواجب. هل أنت متأكد؟')) return

    db.remove('assignments', id)
    toast.success('تم حذف الواجب')
    load()
  }

  const submissionsCount = (assignmentId) => {
    return submissions.filter((item) => item.assignmentId === assignmentId).length
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <FileText size={15} />
              إدارة الواجبات
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              واجبات الكورسات والتسليمات
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              أنشئ واجبات تطبيقية، حدد موعد التسليم، وتابع عدد التسليمات لكل واجب.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd}>
            واجب جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="الواجبات"
          value={stats.total}
          icon="FileText"
          tone="blue"
          description="إجمالي الواجبات."
        />

        <StatCard
          title="المنشورة"
          value={stats.published}
          icon="CheckCircle2"
          tone="green"
          description="واجبات متاحة للطلاب."
        />

        <StatCard
          title="التسليمات"
          value={stats.submissions}
          icon="Download"
          tone="orange"
          description="إجمالي تسليمات الطلاب."
        />

        <StatCard
          title="إجمالي الدرجات"
          value={stats.points}
          icon="Award"
          tone="burgundy"
          description="مجموع درجات الواجبات."
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader
            title="قائمة الواجبات"
            subtitle={`${assignments.length} واجب داخل المنصة`}
          />
        </div>

        <Table
          columns={[
            {
              key: 'title',
              title: 'الواجب',
              render: (row) => (
                <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                  {row.title}
                </span>
              )
            },
            {
              key: 'course',
              title: 'الكورس',
              render: (row) => db.find('subjects', row.subjectId)?.name || '-'
            },
            { key: 'points', title: 'الدرجة' },
            {
              key: 'submissions',
              title: 'التسليمات',
              render: (row) => (
                <Badge tone="brand">{submissionsCount(row.id)}</Badge>
              )
            },
            {
              key: 'status',
              title: 'الحالة',
              render: (row) => (
                <Badge tone={row.published ? 'success' : 'warning'}>
                  {row.published ? 'منشور' : 'مسودة'}
                </Badge>
              )
            },
            {
              key: 'due',
              title: 'الموعد',
              render: (row) => formatDate(row.dueDate)
            },
            {
              key: 'actions',
              title: 'الإجراءات',
              render: (row) => (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#0B6F7A] transition-colors hover:bg-[#E8F8FA] dark:text-cyan-300 dark:hover:bg-cyan-400/10"
                    aria-label="تعديل الواجب"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10"
                    aria-label="حذف الواجب"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={assignments}
          empty="لا توجد واجبات بعد"
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'تعديل واجب' : 'إضافة واجب'}
        size="lg"
      >
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input
            label="عنوان الواجب"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />

          <Select
            label="الكورس"
            value={form.subjectId}
            onChange={(event) => setForm({ ...form, subjectId: event.target.value })}
            options={subjectOptions}
            required
          />

          <Input
            label="الدرجة"
            type="number"
            value={form.points}
            onChange={(event) => setForm({ ...form, points: event.target.value })}
          />

          <Input
            label="الموعد النهائي"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
          />

          <Select
            label="الحالة"
            value={form.published ? 'true' : 'false'}
            onChange={(event) =>
              setForm({ ...form, published: event.target.value === 'true' })
            }
            options={statusOptions}
          />

          <Textarea
            label="تعليمات الواجب"
            value={form.instructions}
            onChange={(event) =>
              setForm({ ...form, instructions: event.target.value })
            }
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
              {editing ? 'حفظ التعديلات' : 'إضافة الواجب'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}