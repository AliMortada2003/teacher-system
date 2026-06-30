import { useEffect, useMemo, useState } from 'react'
import {
  BookMarked,
  Edit2,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  UserPlus
} from 'lucide-react'

import { userRepo } from '../../repositories/index.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { ROLES } from '../../utils/constants.js'

const initialForm = {
  name: '',
  email: '',
  password: '123456',
  phone: '',
  city: '',
  grade: 'الصف العاشر',
  subjectIds: []
}

const gradeOptions = [
  { value: 'الصف العاشر', label: 'الصف العاشر' },
  { value: 'الصف الحادي عشر', label: 'الصف الحادي عشر' },
  { value: 'الصف الثاني عشر', label: 'الصف الثاني عشر' }
]

export default function StudentsManagement() {
  const toast = useToast()

  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState(initialForm)

  const load = async () => {
    const students = await userRepo.list((user) => user.role === ROLES.STUDENT)

    setRows(students)
    setSubjects(db.all('subjects'))
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return rows

    return rows.filter((student) => {
      return (
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.phone?.toLowerCase().includes(query) ||
        student.grade?.toLowerCase().includes(query)
      )
    })
  }, [rows, search])

  const stats = useMemo(() => {
    const activeStudents = rows.filter((student) => student.status !== 'blocked')
    const studentsWithSubjects = rows.filter(
      (student) => (student.subjectIds || []).length > 0
    )

    const averageSubjects = rows.length
      ? Math.round(
          rows.reduce(
            (sum, student) => sum + (student.subjectIds || []).length,
            0
          ) / rows.length
        )
      : 0

    return {
      total: rows.length,
      active: activeStudents.length,
      withSubjects: studentsWithSubjects.length,
      averageSubjects
    }
  }, [rows])

  const openAdd = () => {
    setEditing(null)
    setForm(initialForm)
    setOpen(true)
  }

  const openEdit = (student) => {
    setEditing(student)

    setForm({
      ...initialForm,
      ...student,
      password: student.password || '123456',
      subjectIds: student.subjectIds || []
    })

    setOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim()) {
      toast.error('أكمل البيانات الأساسية')
      return
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim(),
      city: form.city?.trim(),
      subjectIds: form.subjectIds || []
    }

    if (editing) {
      await userRepo.update(editing.id, payload)
      toast.success('تم تحديث بيانات الطالب')
    } else {
      await userRepo.create({
        ...payload,
        role: ROLES.STUDENT,
        status: 'active'
      })

      toast.success('تم إضافة الطالب')
    }

    setOpen(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('سيتم حذف الطالب. هل أنت متأكد؟')) return

    await userRepo.remove(id)

    toast.success('تم حذف الطالب')
    load()
  }

  const toggleSubject = (id) => {
    setForm((current) => {
      const currentSubjects = current.subjectIds || []
      const exists = currentSubjects.includes(id)

      return {
        ...current,
        subjectIds: exists
          ? currentSubjects.filter((subjectId) => subjectId !== id)
          : [...currentSubjects, id]
      }
    })
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <GraduationCap size={15} />
              إدارة الطلاب
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              الطلاب المسجلون في المنصة
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              أضف الطلاب، عدّل بياناتهم، واربط كل طالب بالكورسات المناسبة من مكان واحد.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd}>
            طالب جديد
          </Button>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي الطلاب"
          value={stats.total}
          icon="Users"
          tone="blue"
          description="عدد الطلاب المسجلين داخل النظام."
        />

        <StatCard
          title="طلاب نشطون"
          value={stats.active}
          icon="CheckCircle2"
          tone="green"
          description="طلاب متاح لهم استخدام المنصة."
        />

        <StatCard
          title="مرتبطون بكورسات"
          value={stats.withSubjects}
          icon="BookMarked"
          tone="orange"
          description="طلاب لديهم كورسات أو مواد مسجلة."
        />

        <StatCard
          title="متوسط الكورسات"
          value={stats.averageSubjects}
          icon="Library"
          tone="burgundy"
          description="متوسط عدد الكورسات لكل طالب."
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="flex flex-col gap-4 border-b border-[#DCEAF3] p-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
          <CardHeader
            title="قائمة الطلاب"
            subtitle={`${filtered.length} طالب مطابق للبحث`}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B8293] dark:text-slate-400"
                size={16}
              />

              <input
                className="input w-full !py-2 !pr-9 sm:w-72"
                placeholder="ابحث بالاسم أو البريد أو الهاتف..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <Button icon={UserPlus} onClick={openAdd}>
              إضافة طالب
            </Button>
          </div>
        </div>

        <Table
          columns={[
            {
              key: 'name',
              title: 'الاسم',
              render: (student) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FA] text-xs font-black text-[#0B6F7A] dark:bg-cyan-400/10 dark:text-cyan-300">
                    {student.name?.charAt(0) || 'ط'}
                  </div>

                  <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                    {student.name}
                  </span>
                </div>
              )
            },
            {
              key: 'email',
              title: 'البريد',
              render: (student) => student.email || '-'
            },
            {
              key: 'grade',
              title: 'الصف',
              render: (student) => student.grade || '-'
            },
            {
              key: 'subjects',
              title: 'الكورسات',
              render: (student) => (
                <Badge tone="brand">{student.subjectIds?.length || 0}</Badge>
              )
            },
            {
              key: 'phone',
              title: 'الهاتف',
              render: (student) => student.phone || '-'
            },
            {
              key: 'actions',
              title: 'الإجراءات',
              render: (student) => (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(student)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#0B6F7A] transition-colors hover:bg-[#E8F8FA] dark:text-cyan-300 dark:hover:bg-cyan-400/10"
                    aria-label="تعديل الطالب"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(student.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10"
                    aria-label="حذف الطالب"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={filtered}
          empty="لا توجد بيانات لعرضها"
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'تعديل طالب' : 'إضافة طالب'}
        size="lg"
      >
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input
            label="الاسم"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            required
          />

          <Input
            label="البريد"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
          />

          <Input
            label="كلمة المرور"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />

          <Select
            label="الصف الدراسي"
            value={form.grade}
            onChange={(event) =>
              setForm({ ...form, grade: event.target.value })
            }
            options={gradeOptions}
          />

          <Input
            label="الهاتف"
            value={form.phone}
            onChange={(event) =>
              setForm({ ...form, phone: event.target.value })
            }
          />

          <Input
            label="المدينة"
            value={form.city}
            onChange={(event) =>
              setForm({ ...form, city: event.target.value })
            }
          />

          <div className="md:col-span-2">
            <label className="label">الكورسات المسجلة</label>

            <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {subjects.map((subject) => {
                const active = (form.subjectIds || []).includes(subject.id)

                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={`rounded-2xl border px-3 py-3 text-right text-sm font-black transition-all ${
                      active
                        ? 'border-[#0B6F7A]/40 bg-[#E8F8FA] text-[#0B6F7A] shadow-sm dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-cyan-300'
                        : 'border-[#DCEAF3] bg-white text-[#41596B] hover:border-[#0B6F7A]/25 hover:bg-[#F7FBFF] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800 dark:hover:text-cyan-300'
                    }`}
                  >
                    {subject.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>

            <Button type="submit">
              {editing ? 'حفظ التعديلات' : 'إضافة الطالب'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}