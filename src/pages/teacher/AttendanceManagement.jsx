import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { ATTENDANCE_STATUS } from '../../utils/constants.js'
import { CheckCircle2, Clock, Filter, Save, Users, XCircle } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export default function TeacherAttendance() {
  const { user } = useAuth()
  const toast = useToast()

  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const allSubjects = db.all('subjects')
    const teacherSubjects = user.subjectIds?.length
      ? allSubjects.filter((subject) => user.subjectIds.includes(subject.id))
      : allSubjects

    setSubjects(teacherSubjects)

    if (teacherSubjects[0]) {
      setSubjectId(teacherSubjects[0].id)
    }
  }, [user.subjectIds])

  useEffect(() => {
    if (!subjectId) return

    const subjectStudents = db.all('users').filter(
      (item) => item.role === 'student' && item.subjectIds?.includes(subjectId)
    )

    const initialMarks = {}

    subjectStudents.forEach((student) => {
      initialMarks[student.id] = ATTENDANCE_STATUS.PRESENT
    })

    setStudents(subjectStudents)
    setMarks(initialMarks)

    attendanceService.listForSubject(subjectId).then(setRecords)
  }, [subjectId])

  const stats = useMemo(() => attendanceService.stats(records), [records])

  const selectedSubject = useMemo(() => {
    return subjects.find((subject) => subject.id === subjectId)
  }, [subjects, subjectId])

  const sessionSummary = useMemo(() => {
    const values = Object.values(marks)

    return {
      present: values.filter((status) => status === ATTENDANCE_STATUS.PRESENT).length,
      late: values.filter((status) => status === ATTENDANCE_STATUS.LATE).length,
      absent: values.filter((status) => status === ATTENDANCE_STATUS.ABSENT).length
    }
  }, [marks])

  const setStatus = (studentId, status) => {
    setMarks((current) => ({
      ...current,
      [studentId]: status
    }))
  }

  const submit = async () => {
    if (!subjectId) {
      toast.error('اختر المادة أولاً')
      return
    }

    setLoading(true)

    try {
      const payload = Object.entries(marks).map(([studentId, status]) => ({
        studentId,
        status
      }))

      await attendanceService.bulkMark(payload, user.id, subjectId)

      toast.success(`تم تسجيل الحضور (${payload.length} طالب)`)

      const updatedRecords = await attendanceService.listForSubject(subjectId)
      setRecords(updatedRecords)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Users size={15} />
              إدارة الحضور
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              تسجيل حضور الطلاب
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              اختر الكورس، حدد حالة كل طالب، ثم احفظ جلسة الحضور في خطوة واحدة.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#DCEAF3] bg-white/75 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 lg:w-[320px]">
            <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#0B6F7A] dark:text-cyan-300">
              <Filter size={15} />
              اختيار الكورس
            </div>

            <Select
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              options={subjects.map((subject) => ({
                value: subject.id,
                label: subject.name
              }))}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="إجمالي السجلات"
          value={stats.total}
          icon="CalendarCheck"
          tone="blue"
          description="كل سجلات الحضور السابقة."
        />

        <StatCard
          title="معدل الحضور"
          value={stats.rate}
          suffix="%"
          icon="CheckCircle2"
          tone="green"
          description="نسبة الحضور في هذا الكورس."
        />

        <StatCard
          title="نسبة الغياب"
          value={stats.absenceRate}
          suffix="%"
          icon="XCircle"
          tone="red"
          description="نسبة الغياب المسجلة."
        />

        <StatCard
          title="حالات التأخير"
          value={stats.late}
          icon="Clock"
          tone="orange"
          description="عدد حالات التأخير."
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="flex flex-col gap-4 border-b border-[#DCEAF3] p-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
          <CardHeader
            title="تسجيل حضور جلسة جديدة"
            subtitle={selectedSubject ? `${selectedSubject.name} · ${students.length} طالب` : 'اختر الكورس أولاً'}
          />

          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[300px]">
            <SessionCounter label="حاضر" value={sessionSummary.present} tone="green" />
            <SessionCounter label="متأخر" value={sessionSummary.late} tone="orange" />
            <SessionCounter label="غائب" value={sessionSummary.absent} tone="red" />
          </div>
        </div>

        <div className="p-5">
          {students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="لا يوجد طلاب في هذه المادة"
              description="لا يوجد طلاب مشتركين في الكورس المحدد حتى الآن."
            />
          ) : (
            <>
              <div className="space-y-3">
                {students.map((student) => {
                  const current = marks[student.id] || ATTENDANCE_STATUS.PRESENT

                  return (
                    <div
                      key={student.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[#DCEAF3] bg-white/70 p-3 transition-colors hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 lg:flex-row lg:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B6F7A] text-sm font-black text-white shadow-sm">
                          {student.name?.charAt(0) || 'ط'}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                            {student.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs font-bold text-[#6B8293] dark:text-slate-400">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#F1F7FA] p-1.5 dark:bg-slate-900">
                        <StatusButton
                          active={current === ATTENDANCE_STATUS.PRESENT}
                          icon={CheckCircle2}
                          label="حاضر"
                          color="green"
                          onClick={() => setStatus(student.id, ATTENDANCE_STATUS.PRESENT)}
                        />

                        <StatusButton
                          active={current === ATTENDANCE_STATUS.LATE}
                          icon={Clock}
                          label="متأخر"
                          color="orange"
                          onClick={() => setStatus(student.id, ATTENDANCE_STATUS.LATE)}
                        />

                        <StatusButton
                          active={current === ATTENDANCE_STATUS.ABSENT}
                          icon={XCircle}
                          label="غائب"
                          color="red"
                          onClick={() => setStatus(student.id, ATTENDANCE_STATUS.ABSENT)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  loading={loading}
                  onClick={submit}
                  icon={Save}
                  disabled={students.length === 0}
                >
                  حفظ الجلسة
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

function StatusButton({ active, icon: Icon, label, color, onClick }) {
  const colors = {
    green: active
      ? 'bg-[#16A34A] text-white shadow-sm'
      : 'text-[#16A34A] hover:bg-emerald-50 dark:hover:bg-emerald-400/10',
    orange: active
      ? 'bg-[#EA580C] text-white shadow-sm'
      : 'text-[#EA580C] hover:bg-orange-50 dark:hover:bg-orange-400/10',
    red: active
      ? 'bg-[#DC2626] text-white shadow-sm'
      : 'text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-500/10'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-black transition-all ${colors[color]}`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

function SessionCounter({ label, value, tone }) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
  }

  return (
    <div className={`rounded-2xl px-3 py-2 ${colors[tone]}`}>
      <p className="text-lg font-black leading-none">{value}</p>
      <p className="mt-1 text-[11px] font-bold">{label}</p>
    </div>
  )
}