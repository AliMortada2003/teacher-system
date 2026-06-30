import { useEffect, useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { Activity, Filter, Medal, TrendingDown } from 'lucide-react'

import { attendanceService } from '../../services/attendanceService.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'

const PIE_COLORS = {
  present: '#16A34A',
  late: '#EA580C',
  absent: '#DC2626'
}

const BAR_COLOR = '#0B6F7A'

const RANK_COLORS = [
  'bg-[#2563EB] text-white',
  'bg-[#0B6F7A] text-white',
  'bg-[#14B8A6] text-white',
  'bg-[#64748B] text-white',
  'bg-[#334155] text-white'
]

export default function AttendanceAnalytics() {
  const [subjectId, setSubjectId] = useState('')
  const [subjects, setSubjects] = useState([])
  const [records, setRecords] = useState([])

  useEffect(() => {
    const subjectOptions = db.all('subjects').map((subject) => ({
      value: subject.id,
      label: subject.name
    }))

    setSubjects([{ value: '', label: 'كل المواد' }, ...subjectOptions])
  }, [])

  useEffect(() => {
    const allRecords = db.all('attendance')

    setRecords(
      subjectId
        ? allRecords.filter((record) => record.subjectId === subjectId)
        : allRecords
    )
  }, [subjectId])

  const users = useMemo(() => db.all('users'), [])

  const stats = useMemo(() => attendanceService.stats(records), [records])

  const topCommitted = useMemo(
    () => attendanceService.topCommitted(records, users, 5),
    [records, users]
  )

  const topAbsent = useMemo(
    () => attendanceService.topAbsent(records, users, 5),
    [records, users]
  )

  const bySubject = useMemo(() => {
    return db.all('subjects').map((subject) => {
      const subjectRecords = db
        .all('attendance')
        .filter((record) => record.subjectId === subject.id)

      const subjectStats = attendanceService.stats(subjectRecords)

      return {
        name: subject.name,
        rate: subjectStats.rate || 0
      }
    })
  }, [])

  const pieData = [
    { name: 'حاضر', value: stats.present || 0, color: PIE_COLORS.present },
    { name: 'متأخر', value: stats.late || 0, color: PIE_COLORS.late },
    { name: 'غائب', value: stats.absent || 0, color: PIE_COLORS.absent }
  ]

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Activity size={15} />
              تحليلات الحضور
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              متابعة حضور الطلاب بشكل واضح ومنظم
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              راقب معدلات الحضور والغياب والتأخير، واعرف الطلاب الأكثر التزامًا والأكثر غيابًا حسب كل مادة.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#DCEAF3] bg-white/75 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 lg:w-[320px]">
            <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#0B6F7A] dark:text-cyan-300">
              <Filter size={15} />
              فلترة حسب المادة
            </div>

            <Select
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              options={subjects}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي الجلسات"
          value={stats.total}
          icon="CalendarCheck"
          tone="blue"
          description="عدد سجلات الحضور المسجلة داخل الفترة الحالية."
        />

        <StatCard
          title="معدل الحضور"
          value={stats.rate}
          suffix="%"
          icon="CheckCircle2"
          tone="green"
          description="النسبة العامة لحضور الطلاب من إجمالي الجلسات."
        />

        <StatCard
          title="معدل الغياب"
          value={stats.absenceRate}
          suffix="%"
          icon="XCircle"
          tone="red"
          description="النسبة العامة للغياب مقارنة بعدد السجلات."
        />

        <StatCard
          title="حالات التأخير"
          value={stats.late}
          icon="Clock"
          tone="orange"
          description="عدد مرات تسجيل الطلاب كحضور متأخر."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
          <CardHeader
            title="توزيع الحضور"
            subtitle="حاضر / متأخر / غائب"
          />

          {stats.total === 0 ? (
            <EmptyState title="لا توجد بيانات" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={58}
                    outerRadius={88}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 18,
                      borderColor: '#DCEAF3',
                      background: 'rgba(255,255,255,0.95)',
                      boxShadow: '0 18px 45px rgba(11,95,122,0.10)',
                      fontWeight: 800
                    }}
                  />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 12,
                      fontWeight: 800
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:col-span-2">
          <CardHeader
            title="معدل الحضور حسب المادة"
            subtitle="مقارنة سريعة بين المواد"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bySubject}
                margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#DCEAF3"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6B8293', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: '#6B8293', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    borderColor: '#DCEAF3',
                    background: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 18px 45px rgba(11,95,122,0.10)',
                    fontWeight: 800
                  }}
                />

                <Bar
                  dataKey="rate"
                  name="معدل الحضور"
                  fill={BAR_COLOR}
                  radius={[10, 10, 0, 0]}
                  barSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
          <CardHeader
            title="الأكثر التزامًا"
            subtitle="أفضل الطلاب حسب معدل الحضور"
          />

          {topCommitted.length === 0 ? (
            <EmptyState icon={Medal} title="لا توجد بيانات" />
          ) : (
            <div className="space-y-3">
              {topCommitted.map((item, index) => (
                <div
                  key={item.student.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#DCEAF3] bg-white/70 p-3 transition-colors hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm ${
                      RANK_COLORS[index] || RANK_COLORS[RANK_COLORS.length - 1]
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                        {item.student.name}
                      </p>

                      <span className="shrink-0 text-sm font-black text-[#16A34A] dark:text-emerald-300">
                        {item.rate}%
                      </span>
                    </div>

                    <ProgressBar
                      value={item.rate}
                      tone="emerald"
                      showLabel={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
          <CardHeader
            title="الأكثر غيابًا"
            subtitle="طلاب يحتاجون متابعة"
          />

          {topAbsent.length === 0 ? (
            <EmptyState icon={TrendingDown} title="لا توجد بيانات" />
          ) : (
            <div className="space-y-3">
              {topAbsent.map((item, index) => (
                <div
                  key={item.student.id}
                  className="flex items-center gap-3 rounded-2xl border border-red-100 bg-white/70 p-3 transition-colors hover:bg-red-50/60 dark:border-red-300/20 dark:bg-slate-800/50 dark:hover:bg-red-500/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#DC2626] text-sm font-black text-white shadow-sm">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                        {item.student.name}
                      </p>

                      <span className="shrink-0 text-sm font-black text-red-600 dark:text-red-300">
                        {item.absenceRate}%
                      </span>
                    </div>

                    <ProgressBar
                      value={item.absenceRate}
                      tone="danger"
                      showLabel={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}