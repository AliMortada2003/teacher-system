import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { ATTENDANCE_STATUS, ATTENDANCE_LABEL } from '../../utils/constants.js'
import { CheckCircle2, Clock, XCircle, Save, Users } from 'lucide-react'
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
    const subs = db.all('subjects').filter((s) => user.subjectIds?.includes(s.id))
    setSubjects(subs)
    if (subs[0]) setSubjectId(subs[0].id)
  }, [user.subjectIds])

  useEffect(() => {
    if (!subjectId) return
    const sts = db.all('users').filter(
      (u) => u.role === 'student' && u.subjectIds?.includes(subjectId)
    )
    setStudents(sts)
    const init = {}
    sts.forEach((s) => { init[s.id] = ATTENDANCE_STATUS.PRESENT })
    setMarks(init)
    attendanceService.listForSubject(subjectId).then(setRecords)
  }, [subjectId])

  const setStatus = (sid, status) => setMarks((m) => ({ ...m, [sid]: status }))

  const submit = async () => {
    setLoading(true)
    try {
      const records = Object.entries(marks).map(([studentId, status]) => ({ studentId, status }))
      await attendanceService.bulkMark(records, user.id, subjectId)
      toast.success(`تم تسجيل الحضور (${records.length} طالب)`)
      attendanceService.listForSubject(subjectId).then(setRecords)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => attendanceService.stats(records), [records])

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="إجمالي السجلات" value={stats.total} icon="CalendarCheck" tone="brand" />
        <StatCard title="معدل الحضور" value={stats.rate} suffix="%" icon="CheckCircle2" tone="emerald" />
        <StatCard title="نسبة الغياب" value={stats.absenceRate} suffix="%" icon="XCircle" tone="accent" />
        <StatCard title="حالات التأخير" value={stats.late} icon="Clock" tone="violet" />
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <CardHeader title="تسجيل حضور جلسة جديدة" subtitle="اختر المادة ثم حدد حالة كل طالب" />
          <Select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          />
        </div>

        {students.length === 0 ? (
          <EmptyState icon={Users} title="لا يوجد طلاب في هذه المادة" />
        ) : (
          <>
            <div className="space-y-2">
              {students.map((s) => {
                const current = marks[s.id] || ATTENDANCE_STATUS.PRESENT
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{s.name}</p>
                      <p className="text-xs text-ink-500 truncate">{s.email}</p>
                    </div>
                    <div className="flex gap-1 bg-ink-100 rounded-xl p-1">
                      <button
                        onClick={() => setStatus(s.id, ATTENDANCE_STATUS.PRESENT)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          current === ATTENDANCE_STATUS.PRESENT ? 'bg-emerald-500 text-white shadow-soft' : 'text-ink-500 hover:text-ink-800'
                        }`}
                      >
                        <CheckCircle2 size={14} /> حاضر
                      </button>
                      <button
                        onClick={() => setStatus(s.id, ATTENDANCE_STATUS.LATE)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          current === ATTENDANCE_STATUS.LATE ? 'bg-accent-500 text-white shadow-soft' : 'text-ink-500 hover:text-ink-800'
                        }`}
                      >
                        <Clock size={14} /> متأخر
                      </button>
                      <button
                        onClick={() => setStatus(s.id, ATTENDANCE_STATUS.ABSENT)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          current === ATTENDANCE_STATUS.ABSENT ? 'bg-red-500 text-white shadow-soft' : 'text-ink-500 hover:text-ink-800'
                        }`}
                      >
                        <XCircle size={14} /> غائب
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <Button loading={loading} onClick={submit} icon={Save}>حفظ الجلسة</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
