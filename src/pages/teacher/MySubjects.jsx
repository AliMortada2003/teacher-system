import { useEffect, useState } from 'react'
import { subjectRepo } from '../../repositories/index.js'
import { db } from '../../db/database.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { CourseCard } from '../../components/ui/CourseCard.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Edit2, Plus, Trash2 } from 'lucide-react'

const COLORS = [
  { value: '#2563EB', label: 'أزرق' },
  { value: '#F97316', label: 'أورانج' },
  { value: '#334155', label: 'سليت' }
]

const ICONS = ['BookOpenText']

const emptyForm = () => ({
  name: '',
  code: '',
  description: '',
  colorHex: '#2563EB',
  color: '#2563EB',
  icon: 'BookOpenText',
  price: 199,
  currency: 'EGP',
  level: 'مبتدئ',
  grade: 'الصف الأول الثانوي',
  published: true,
  active: true
})

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
      students: users.filter((user) => user.role === 'student' && user.subjectIds?.includes(course.id)).length,
      instructorId: course.instructorId || instructorId
    }))
    setCourses(rows)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (course) => {
    setEditing(course)
    setForm({
      ...emptyForm(),
      ...course,
      colorHex: course.colorHex || course.color || '#2563EB',
      color: course.colorHex || course.color || '#2563EB'
    })
    setOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()
    if (!form.name || !form.code) return toast.error('أكمل اسم الكورس والرمز')
    const payload = {
      ...form,
      color: form.colorHex,
      instructorId: singleInstructorService.getInstructorId(),
      price: Number(form.price || 0)
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
    if (!confirm('حذف الكورس سيؤثر على الدروس والاختبارات المرتبطة به. هل أنت متأكد؟')) return
    await subjectRepo.remove(id)
    toast.success('تم حذف الكورس')
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CardHeader title="إدارة الكورسات" subtitle={`${courses.length} كورس`} />
        <Button icon={Plus} onClick={openAdd}>كورس جديد</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-soft">
            <CourseCard
              course={course}
              lessonsCount={course.lessons}
              studentsCount={course.students}
              rating={course.quizzes ? 4.9 : 4.7}
              action={<span className="text-sm font-extrabold text-ink-500">{course.published ? 'منشور' : 'مسودة'}</span>}
            />
            <div className="grid grid-cols-2 gap-2 border-t border-ink-100 p-4">
              <Button variant="outline" size="sm" icon={Edit2} onClick={() => openEdit(course)}>تعديل</Button>
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => remove(course.id)}>حذف</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل كورس' : 'إضافة كورس'} size="lg">
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input label="اسم الكورس" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="الرمز" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <Input label="السعر" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="العملة" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          <Select label="الصف" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} options={[
            { value: 'الصف الأول الثانوي', label: 'الصف الأول الثانوي' },
            { value: 'الصف الثاني الثانوي', label: 'الصف الثاني الثانوي' },
            { value: 'الصف الثالث الثانوي', label: 'الصف الثالث الثانوي' }
          ]} />
          <Select label="المستوى" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} options={[
            { value: 'مبتدئ', label: 'مبتدئ' },
            { value: 'متوسط', label: 'متوسط' },
            { value: 'متقدم', label: 'متقدم' }
          ]} />
          <Select label="اللون" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value, color: e.target.value })} options={COLORS} />
          <Select label="الأيقونة" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} options={ICONS.map((icon) => ({ value: icon, label: icon }))} />
          <Select label="الحالة" value={form.published ? 'true' : 'false'} onChange={(e) => setForm({ ...form, published: e.target.value === 'true', active: e.target.value === 'true' })} options={[
            { value: 'true', label: 'منشور' },
            { value: 'false', label: 'مسودة' }
          ]} />
          <Textarea label="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'إضافة'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
