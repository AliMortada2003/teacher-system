import { useEffect, useMemo, useState } from 'react'
import { attendanceService } from '../../services/attendanceService.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Medal, TrendingDown } from 'lucide-react'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'

export default function AttendanceAnalytics() {
  const [subjectId, setSubjectId] = useState('')
  const [subjects, setSubjects] = useState([])
  const [records, setRecords] = useState([])

  useEffect(() => {
    setSubjects([{ value: '', label: 'كل المواد' }, ...db.all('subjects').map((s) => ({ value: s.id, label: s.name }))])
  }, [])

  useEffect(() => {
    const all = db.all('attendance')
    setRecords(subjectId ? all.filter((r) => r.subjectId === subjectId) : all)
  }, [subjectId])

  const users = db.all('users')
  const stats = useMemo(() => attendanceService.stats(records), [records])
  const topCommitted = useMemo(() => attendanceService.topCommitted(records, users, 5), [records])
  const topAbsent = useMemo(() => attendanceService.topAbsent(records, users, 5), [records])

  const bySubject = db.all('subjects').map((s) => {
    const rs = db.all('attendance').filter((r) => r.subjectId === s.id)
    const st = attendanceService.stats(rs)
    return { name: s.name, rate: st.rate }
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">تحليلات الحضور</h2>
        <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} options={subjects} />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الجلسات" value={stats.total} icon="CalendarCheck" tone="brand" />
        <StatCard title="معدل الحضور" value={stats.rate} suffix="%" icon="CheckCircle2" tone="emerald" />
        <StatCard title="معدل الغياب" value={stats.absenceRate} suffix="%" icon="XCircle" tone="accent" />
        <StatCard title="حالات التأخير" value={stats.late} icon="Clock" tone="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card>
          <CardHeader title="التوزيع" />
          {stats.total === 0 ? (
            <EmptyState title="لا توجد بيانات" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'حاضر', value: stats.present },
                      { name: 'متأخر', value: stats.late },
                      { name: 'غائب', value: stats.absent }
                    ]}
                    innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f97316" />
                    <Cell fill="#f43f5e" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="معدل الحضور حسب المادة" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySubject}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="rate" fill="#2f6fff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="الأكثر التزاماً" />
          {topCommitted.length === 0 ? <EmptyState icon={Medal} title="لا توجد بيانات" /> : (
            <div className="space-y-3">
              {topCommitted.map((t, i) => (
                <div key={t.student.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${i === 0 ? 'bg-amber-500 text-white' : 'bg-ink-100 text-ink-600'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{t.student.name}</p>
                    <ProgressBar value={t.rate} tone="emerald" showLabel={false} />
                  </div>
                  <span className="font-extrabold text-emerald-600">{t.rate}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader title="الأكثر غياباً" />
          {topAbsent.length === 0 ? <EmptyState icon={TrendingDown} title="لا توجد بيانات" /> : (
            <div className="space-y-3">
              {topAbsent.map((t, i) => (
                <div key={t.student.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">{i + 1}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{t.student.name}</p>
                    <ProgressBar value={t.absenceRate} tone="danger" showLabel={false} />
                  </div>
                  <span className="font-extrabold text-red-500">{t.absenceRate}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
