import { useEffect, useMemo, useState } from 'react'
import {
  BookOpenText,
  Edit2,
  FileText,
  Image as ImageIcon,
  Layers3,
  Plus,
  Trash2,
  Users,
  Wallet
} from 'lucide-react'

import { subjectRepo } from '../../repositories/index.js'
import { db } from '../../db/database.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

const ICONS = ['BookOpenText']

const gradeOptions = [
  { value: 'الصف الأول الثانوي', label: 'الصف الأول الثانوي' },
  { value: 'الصف الثاني الثانوي', label: 'الصف الثاني الثانوي' },
  { value: 'الصف الثالث الثانوي', label: 'الصف الثالث الثانوي' }
]

const levelOptions = [
  { value: 'مبتدئ', label: 'مبتدئ' },
  { value: 'متوسط', label: 'متوسط' },
  { value: 'متقدم', label: 'متقدم' }
]

const statusOptions = [
  { value: 'true', label: 'منشور' },
  { value: 'false', label: 'مسودة' }
]

const emptyForm = () => ({
  name: '',
  code: '',
  description: '',
  imageUrl: '',
  coverImage: '',
  thumbnailUrl: '',
  colorHex: '#0B6F7A',
  color: '#0B6F7A',
  icon: 'BookOpenText',
  price: 199,
  currency: 'EGP',
  level: 'مبتدئ',
  grade: 'الصف الأول الثانوي',
  published: true,
  active: true
})

const getCourseImage = (course) => {
  return (
    course?.imageUrl ||
    course?.coverImage ||
    course?.thumbnailUrl ||
    course?.image ||
    ''
  )
}

export default function TeacherSubjects() {
  const toast = useToast()

  const [courses, setCourses] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = async () => {
    const instructorId = singleInstructorService.getInstructorId()
    const lessons = db.all('lessons')
    const exams = db.all('exams')
    const users = db.all('users')

    const rows = (await subjectRepo.list()).map((course) => ({
      ...course,
      lessons: lessons.filter((lesson) => lesson.subjectId === course.id).length,
      quizzes: exams.filter((exam) => exam.subjectId === course.id).length,
      students: users.filter(
        (user) =>
          user.role === 'student' && user.subjectIds?.includes(course.id)
      ).length,
      instructorId: course.instructorId || instructorId
    }))

    setCourses(rows)
  }

  useEffect(() => {
    load()
  }, [])

  const stats = useMemo(() => {
    const published = courses.filter((course) => course.published).length
    const lessons = courses.reduce((sum, course) => sum + (course.lessons || 0), 0)
    const students = courses.reduce((sum, course) => sum + (course.students || 0), 0)
    const revenue = courses.reduce(
      (sum, course) => sum + Number(course.price || 0) * Number(course.students || 0),
      0
    )

    return {
      total: courses.length,
      published,
      lessons,
      students,
      revenue
    }
  }, [courses])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (course) => {
    const image = getCourseImage(course)

    setEditing(course)
    setForm({
      ...emptyForm(),
      ...course,
      imageUrl: image,
      coverImage: image,
      thumbnailUrl: image,
      colorHex: course.colorHex || course.color || '#0B6F7A',
      color: course.colorHex || course.color || '#0B6F7A'
    })

    setOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.code.trim()) {
      toast.error('أكمل اسم الكورس والرمز')
      return
    }

    const image = form.imageUrl?.trim() || ''

    const payload = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description?.trim(),
      imageUrl: image,
      coverImage: image,
      thumbnailUrl: image,
      color: form.colorHex,
      instructorId: singleInstructorService.getInstructorId(),
      price: Number(form.price || 0),
      active: form.published
    }

    if (editing) {
      await subjectRepo.update(editing.id, payload)
      toast.success('تم تحديث الكورس')
    } else {
      await subjectRepo.create(payload)
      toast.success('تم إضافة الكورس')
    }

    setOpen(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('حذف الكورس سيؤثر على الدروس والاختبارات المرتبطة به. هل أنت متأكد؟')) {
      return
    }

    await subjectRepo.remove(id)

    toast.success('تم حذف الكورس')
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
              <Layers3 size={15} />
              إدارة الكورسات
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              كورسات المدرس داخل المنصة
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              أضف الكورسات، عدّل بياناتها، وحدد الصورة والسعر والصف الدراسي وحالة النشر من مكان واحد.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd}>
            كورس جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="الكورسات"
          value={stats.total}
          icon="Library"
          tone="blue"
          description="إجمالي الكورسات المسجلة."
        />

        <StatCard
          title="المنشورة"
          value={stats.published}
          icon="BookOpenText"
          tone="green"
          description="كورسات ظاهرة للطلاب."
        />

        <StatCard
          title="الدروس"
          value={stats.lessons}
          icon="FileText"
          tone="orange"
          description="إجمالي الدروس المرتبطة."
        />

        <StatCard
          title="الطلاب"
          value={stats.students}
          icon="Users"
          tone="burgundy"
          description="عدد الاشتراكات الحالية."
        />
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpenText}
          title="لا توجد كورسات"
          description="ابدأ بإضافة أول كورس للمدرس، وحدد صورته وسعره والصف الدراسي الخاص به."
          action={
            <Button icon={Plus} onClick={openAdd}>
              إضافة كورس
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <TeacherCourseCard
              // @ts-ignore
              key={course.id}
              course={course}
              onEdit={() => openEdit(course)}
              onRemove={() => remove(course.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'تعديل كورس' : 'إضافة كورس'}
        size="lg"
      >
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input
            label="اسم الكورس"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />

          <Input
            label="الرمز"
            value={form.code}
            onChange={(event) => setForm({ ...form, code: event.target.value })}
            required
          />

          <Input
            label="رابط صورة الكورس"
            value={form.imageUrl}
            onChange={(event) =>
              setForm({
                ...form,
                imageUrl: event.target.value,
                coverImage: event.target.value,
                thumbnailUrl: event.target.value
              })
            }
            placeholder="/images/course-arabic.jpg أو رابط صورة"
            className="md:col-span-2"
          />

          <Input
            label="السعر"
            type="number"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
          />

          <Input
            label="العملة"
            value={form.currency}
            onChange={(event) =>
              setForm({ ...form, currency: event.target.value })
            }
          />

          <Select
            label="الصف"
            value={form.grade}
            onChange={(event) => setForm({ ...form, grade: event.target.value })}
            options={gradeOptions}
          />

          <Select
            label="المستوى"
            value={form.level}
            onChange={(event) => setForm({ ...form, level: event.target.value })}
            options={levelOptions}
          />

          <Select
            label="الأيقونة"
            value={form.icon}
            onChange={(event) => setForm({ ...form, icon: event.target.value })}
            options={ICONS.map((icon) => ({
              value: icon,
              label: icon
            }))}
          />

          <Select
            label="الحالة"
            value={form.published ? 'true' : 'false'}
            onChange={(event) =>
              setForm({
                ...form,
                published: event.target.value === 'true',
                active: event.target.value === 'true'
              })
            }
            options={statusOptions}
          />

          <Textarea
            label="الوصف"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="md:col-span-2"
          />

          {form.imageUrl && (
            <div className="md:col-span-2 overflow-hidden rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF] p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="mb-2 text-xs font-black text-[#6B8293] dark:text-slate-400">
                معاينة الصورة
              </p>

              <div className="h-44 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={form.imageUrl}
                  alt="معاينة صورة الكورس"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>

            <Button type="submit">
              {editing ? 'حفظ التعديلات' : 'إضافة الكورس'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function TeacherCourseCard({ course, onEdit, onRemove }) {
  const [imageError, setImageError] = useState(false)
  const image = getCourseImage(course)

  useEffect(() => {
    setImageError(false)
  }, [image])

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#0B6F7A]/25 hover:shadow-2xl hover:shadow-[#0B5F7A]/12 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none">
      <div className="relative h-48 overflow-hidden bg-[#E8F8FA] dark:bg-slate-800">
        {image && !imageError ? (
          <img
            src={image}
            alt={course.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(11,111,122,0.24),transparent_34%),linear-gradient(135deg,#E8F8FA,#F7FBFF)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_34%),linear-gradient(135deg,#111827,#0F172A)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-[#0B6F7A] shadow-lg dark:bg-slate-900/80 dark:text-cyan-300">
              <ImageIcon size={30} />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B3F]/70 via-[#0B2B3F]/10 to-transparent" />

        <div className="absolute right-4 top-4 flex items-center gap-2">
          <Badge tone={course.published ? 'success' : 'warning'}>
            {course.published ? 'منشور' : 'مسودة'}
          </Badge>
        </div>

        <div className="absolute bottom-4 right-4 left-4">
          <p className="line-clamp-1 text-xl font-black text-white">
            {course.name}
          </p>

          <p className="mt-1 line-clamp-1 text-xs font-bold text-white/80">
            {course.grade} · {course.level}
          </p>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 min-h-[44px] text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
          {course.description || 'لا يوجد وصف لهذا الكورس بعد.'}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <MiniMetric label="دروس" value={course.lessons || 0} icon={BookOpenText} />
          <MiniMetric label="اختبارات" value={course.quizzes || 0} icon={FileText} />
          <MiniMetric label="طلاب" value={course.students || 0} icon={Users} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#DCEAF3] pt-4 dark:border-slate-700">
          <div>
            <p className="text-[11px] font-black text-[#6B8293] dark:text-slate-400">
              السعر
            </p>

            <p className="mt-1 text-base font-black text-[#0B6F7A] dark:text-cyan-300">
              {course.currency || 'EGP'} {course.price || 0}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={onEdit}
            >
              تعديل
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={onRemove}
            >
              حذف
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function MiniMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF] p-3 text-center dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F8FA] text-[#0B6F7A] dark:bg-cyan-400/10 dark:text-cyan-300">
        <Icon size={16} />
      </div>

      <p className="mt-2 text-base font-black text-[#0B2B3F] dark:text-slate-50">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-bold text-[#6B8293] dark:text-slate-400">
        {label}
      </p>
    </div>
  )
}