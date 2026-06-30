import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Edit2,
  Filter,
  Megaphone,
  Plus,
  Search,
  Send,
  Trash2
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { announcementRepo } from '../../repositories/index.js'
import { notificationService } from '../../services/notificationService.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { db } from '../../db/database.js'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { relativeTime } from '../../utils/date.js'

const emptyForm = {
  title: '',
  body: '',
  subjectId: ''
}

export default function Announcements() {
  const { user } = useAuth()
  const toast = useToast()

  const [list, setList] = useState([])
  const [subjects, setSubjects] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  const load = async () => {
    const instructorId = singleInstructorService.getInstructorId()
    const allSubjects = db.all('subjects')
    const teacherSubjects = allSubjects.filter(
      (subject) => subject.instructorId === instructorId || subject.published !== false
    )

    setSubjects(teacherSubjects)

    const allAnnouncements = await announcementRepo.list(
      (announcement) => announcement.authorId === instructorId
    )

    setList(
      allAnnouncements.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )
  }

  useEffect(() => {
    load()
  }, [user.id])

  const students = useMemo(() => {
    return db.all('users').filter((item) => item.role === 'student')
  }, [])

  const audienceCount = useMemo(() => {
    const subjectIds = new Set(subjects.map((subject) => subject.id))

    return students.filter((student) =>
      student.subjectIds?.some((subjectId) => subjectIds.has(subjectId))
    ).length
  }, [students, subjects])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return list.filter((announcement) => {
      const matchesSearch =
        !query ||
        announcement.title?.toLowerCase().includes(query) ||
        announcement.body?.toLowerCase().includes(query)

      const matchesSubject =
        !subjectFilter || announcement.subjectId === subjectFilter

      return matchesSearch && matchesSubject
    })
  }, [list, search, subjectFilter])

  const stats = useMemo(() => {
    const publishedSubjects = new Set(list.map((item) => item.subjectId)).size

    return {
      total: list.length,
      subjects: publishedSubjects,
      audience: audienceCount,
      filtered: filtered.length
    }
  }, [list, filtered.length, audienceCount])

  const subjectOptions = useMemo(() => {
    return subjects.map((subject) => ({
      value: subject.id,
      label: subject.name
    }))
  }, [subjects])

  const filterOptions = useMemo(() => {
    return [{ value: '', label: 'كل الكورسات' }, ...subjectOptions]
  }, [subjectOptions])

  const openAdd = () => {
    setEditing(null)
    setForm({
      ...emptyForm,
      subjectId: subjects[0]?.id || ''
    })
    setOpen(true)
  }

  const openEdit = (announcement) => {
    setEditing(announcement)
    setForm({
      title: announcement.title || '',
      body: announcement.body || '',
      subjectId: announcement.subjectId || ''
    })
    setOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.body.trim()) {
      toast.error('أكمل العنوان والنص')
      return
    }

    if (!form.subjectId) {
      toast.error('اختر الكورس الخاص بالإعلان')
      return
    }

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      subjectId: form.subjectId
    }

    if (editing) {
      await announcementRepo.update(editing.id, payload)
      toast.success('تم تعديل الإعلان')
    } else {
      await announcementRepo.create({
        ...payload,
        authorId: singleInstructorService.getInstructorId()
      })

      const enrolledStudents = students.filter((student) =>
        student.subjectIds?.includes(form.subjectId)
      )

      await Promise.all(
        enrolledStudents.map((student) =>
          notificationService.sendToUser(student.id, {
            title: `إعلان جديد: ${payload.title}`,
            body: payload.body,
            type: 'info'
          })
        )
      )

      toast.success(`تم النشر وإرسال إشعار إلى ${enrolledStudents.length} طالب`)
    }

    setOpen(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('سيتم حذف الإعلان. هل أنت متأكد؟')) return

    await announcementRepo.remove(id)

    toast.success('تم حذف الإعلان')
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
              <Megaphone size={15} />
              إعلانات الفصل
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              إدارة إعلانات الكورسات وإشعارات الطلاب
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              انشر إعلانًا لطلاب كورس محدد، وعدّل الإعلانات السابقة، وتابع آخر ما تم إرساله من مكان واحد.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd}>
            إعلان جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="الإعلانات"
          value={stats.total}
          icon="Activity"
          tone="blue"
          description="إجمالي الإعلانات المنشورة."
        />

        <StatCard
          title="الكورسات"
          value={stats.subjects}
          icon="BookMarked"
          tone="green"
          description="كورسات لديها إعلانات."
        />

        <StatCard
          title="الطلاب المستهدفون"
          value={stats.audience}
          icon="Users"
          tone="orange"
          description="طلاب داخل كورسات المدرس."
        />

        <StatCard
          title="نتائج العرض"
          value={stats.filtered}
          icon="FileText"
          tone="burgundy"
          description="إعلانات مطابقة للبحث."
        />
      </div>

      <section className="rounded-[2rem] border border-[#DCEAF3] bg-white/85 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0B2B3F] dark:text-slate-50">
              قائمة الإعلانات
            </h3>

            <p className="mt-1 text-sm font-medium text-[#6B8293] dark:text-slate-400">
              {filtered.length} إعلان ظاهر من أصل {list.length}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_220px] lg:w-[560px]">
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B8293] dark:text-slate-400"
                size={16}
              />

              <input
                className="input w-full !py-2 !pr-9"
                placeholder="ابحث في العنوان أو النص..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="relative">
              <Filter
                className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[#6B8293] dark:text-slate-400"
                size={16}
              />

              <Select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                options={filterOptions}
                className="[&_.input]:pr-9"
              />
            </div>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="لا توجد إعلانات"
          description={
            list.length === 0
              ? 'ابدأ بإرسال أول إعلان لطلابك.'
              : 'لا توجد إعلانات مطابقة للبحث الحالي.'
          }
          action={
            list.length === 0 ? (
              <Button icon={Plus} onClick={openAdd}>
                إنشاء إعلان
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((announcement, index) => {
            const subject = db.find('subjects', announcement.subjectId)
            const targetCount = students.filter((student) =>
              student.subjectIds?.includes(announcement.subjectId)
            ).length

            return (
              <motion.article
                key={announcement.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className="group overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#0B6F7A]/25 hover:shadow-2xl hover:shadow-[#0B5F7A]/12 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none"
              >
                <div className="relative p-5">
                  <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#089CC9]/15 blur-2xl dark:bg-cyan-400/10" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#089CC9] text-white shadow-lg shadow-[#089CC9]/20">
                      <Megaphone size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="line-clamp-1 text-base font-black text-[#0B2B3F] dark:text-slate-50">
                            {announcement.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge tone="brand">
                              {subject?.name || 'كورس غير معروف'}
                            </Badge>

                            <Badge tone="info">
                              {targetCount} طالب
                            </Badge>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(announcement)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#0B6F7A] transition-colors hover:bg-[#E8F8FA] dark:text-cyan-300 dark:hover:bg-cyan-400/10"
                            aria-label="تعديل الإعلان"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(announcement.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10"
                            aria-label="حذف الإعلان"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
                        {announcement.body}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCEAF3] pt-4 dark:border-slate-700">
                        <p className="text-xs font-bold text-[#6B8293] dark:text-slate-400">
                          {relativeTime(announcement.createdAt)}
                        </p>

                        <div className="inline-flex items-center gap-2 text-xs font-black text-[#0B6F7A] dark:text-cyan-300">
                          <Bell size={14} />
                          تم الإرسال للطلاب المسجلين
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'تعديل إعلان' : 'نشر إعلان جديد'}
        size="lg"
      >
        <form onSubmit={save} className="space-y-4">
          <Input
            label="العنوان"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            required
          />

          <Select
            label="الكورس"
            value={form.subjectId}
            onChange={(event) =>
              setForm({ ...form, subjectId: event.target.value })
            }
            options={subjectOptions}
            required
          />

          <Textarea
            label="نص الإعلان"
            value={form.body}
            onChange={(event) =>
              setForm({ ...form, body: event.target.value })
            }
            placeholder="اكتب الإعلان الذي سيظهر للطلاب..."
            required
          />

          <div className="rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF] p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FA] text-[#0B6F7A] dark:bg-cyan-400/10 dark:text-cyan-300">
                <Send size={18} />
              </div>

              <div>
                <p className="text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                  سيتم إرسال إشعار للطلاب
                </p>

                <p className="mt-1 text-xs font-medium leading-6 text-[#6B8293] dark:text-slate-400">
                  عند نشر إعلان جديد، سيتم إرسال إشعار لكل طالب مشترك في الكورس المحدد.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>

            <Button type="submit" icon={editing ? Edit2 : Send}>
              {editing ? 'حفظ التعديل' : 'نشر الإعلان'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
