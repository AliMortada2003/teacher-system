import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CalendarDays } from 'lucide-react'

import { useAuth } from '../../context/AuthContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'
import { db } from '../../db/database.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ATTENDANCE_STATUS, ATTENDANCE_LABEL } from '../../utils/constants.js'
import { formatDate, dayName } from '../../utils/date.js'

const PIE_DATA_COLORS = ['#16A34A', '#EA580C', '#DC2626']

const tone = (status) => {
  if (status === ATTENDANCE_STATUS.PRESENT) return 'success'
  if (status === ATTENDANCE_STATUS.LATE) return 'warning'
  return 'danger'
}

export default function StudentAttendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    rate: 0,
    absenceRate: 0
  })

  useEffect(() => {
    attendanceService.listForStudent(user.id).then((list) => {
      const enriched = list
        .map((record) => ({
          ...record,
          subject: db.find('subjects', record.subjectId)
        }))
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())

      setRecords(enriched)
      setStats(attendanceService.stats(list))
    })
  }, [user.id])

  const chartData = [
    { name: 'حاضر', value: stats.present },
    { name: 'متأخر', value: stats.late },
    { name: 'غائب', value: stats.absent }
  ]

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
            <CalendarDays size={15} />
            سجل الحضور
          </div>

          <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
            متابعة حضورك في الكورسات
          </h2>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
            راجع إجمالي الجلسات، معدل الحضور والغياب، وسجل كل جلسة حسب الكورس والتاريخ.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="إجمالي الجلسات" value={stats.total} icon="Calendar" tone="blue" description="عدد جلسات الحضور المسجلة." />
        <StatCard title="معدل الحضور" value={stats.rate} suffix="%" icon="CheckCircle2" tone="green" description="نسبة حضورك من إجمالي الجلسات." />
        <StatCard title="معدل الغياب" value={stats.absenceRate} suffix="%" icon="XCircle" tone="red" description="نسبة الغياب المسجلة عليك." />
        <StatCard title="مرات التأخير" value={stats.late} icon="Clock" tone="orange" description="عدد مرات تسجيلك كمتأخر." />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
          <CardHeader title="توزيع الحضور" subtitle="حاضر / متأخر / غائب" />

          {stats.total === 0 ? (
            <EmptyState title="لا توجد بيانات حضور" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={56} outerRadius={84} dataKey="value" paddingAngle={4}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_DATA_COLORS[index]} />
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

                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 800 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:col-span-2">
          <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
            <CardHeader title="سجل الحضور" subtitle={`${records.length} سجل حضور`} />
          </div>

          {records.length === 0 ? (
            <div className="p-5">
              <EmptyState title="لا توجد سجلات حضور" description="ستظهر هنا سجلات حضورك بعد تسجيل الجلسات." />
            </div>
          ) : (
            <Table
              columns={[
                {
                  key: 'date',
                  title: 'التاريخ',
                  render: (row) => (
                    <span className="font-bold text-[#41596B] dark:text-slate-300">
                      {dayName(row.sessionDate)} · {formatDate(row.sessionDate)}
                    </span>
                  )
                },
                {
                  key: 'subject',
                  title: 'الكورس',
                  render: (row) => (
                    <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                      {row.subject?.name || '-'}
                    </span>
                  )
                },
                {
                  key: 'status',
                  title: 'الحالة',
                  render: (row) => (
                    <Badge tone={tone(row.status)}>
                      {ATTENDANCE_LABEL[row.status]}
                    </Badge>
                  )
                }
              ]}
              data={records}
              empty="لا توجد سجلات حضور"
            />
          )}
        </Card>
      </div>
    </div>
  )
}