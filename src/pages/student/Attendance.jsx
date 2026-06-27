import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'
import { db } from '../../db/database.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { ATTENDANCE_STATUS, ATTENDANCE_LABEL } from '../../utils/constants.js'
import { formatDate, dayName } from '../../utils/date.js'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function StudentAttendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [stats, setStats] = useState({ total: 0, present: 0, late: 0, absent: 0, rate: 0, absenceRate: 0 })

  useEffect(() => {
    attendanceService.listForStudent(user.id).then((list) => {
      const enriched = list
        .map((r) => ({ ...r, subject: db.find('subjects', r.subjectId) }))
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
      setRecords(enriched)
      setStats(attendanceService.stats(list))
    })
  }, [user.id])

  const tone = (s) => s === ATTENDANCE_STATUS.PRESENT ? 'success' : s === ATTENDANCE_STATUS.LATE ? 'warning' : 'danger'

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الجلسات" value={stats.total} icon="Calendar" tone="brand" />
        <StatCard title="معدل الحضور" value={stats.rate} suffix="%" icon="CheckCircle2" tone="emerald" />
        <StatCard title="معدل الغياب" value={stats.absenceRate} suffix="%" icon="XCircle" tone="accent" />
        <StatCard title="مرات التأخير" value={stats.late} icon="Clock" tone="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card>
          <CardHeader title="توزيع الحضور" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'حاضر', value: stats.present },
                    { name: 'متأخر', value: stats.late },
                    { name: 'غائب', value: stats.absent }
                  ]}
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={4}
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
        </Card>
        <Card className="lg:col-span-2 !p-0">
          <div className="p-5 border-b border-ink-100">
            <h3 className="text-lg font-bold">سجل الحضور</h3>
          </div>
          <Table
            columns={[
              { key: 'date', title: 'التاريخ', render: (r) => `${dayName(r.sessionDate)} · ${formatDate(r.sessionDate)}` },
              { key: 'subject', title: 'المادة', render: (r) => r.subject?.name },
              { key: 'status', title: 'الحالة', render: (r) => <Badge tone={tone(r.status)}>{ATTENDANCE_LABEL[r.status]}</Badge> }
            ]}
            data={records}
          />
        </Card>
      </div>
    </div>
  )
}
