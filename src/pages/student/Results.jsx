import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { db } from '../../db/database.js'
import { Table } from '../../components/ui/Table.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { formatDate } from '../../utils/date.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Trophy } from 'lucide-react'

export default function Results() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState({ avg: 0, best: 0, count: 0 })

  useEffect(() => {
    const attempts = db.all('attempts')
      .filter((a) => a.studentId === user.id && a.status === 'submitted')
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    const data = attempts.map((a) => ({
      ...a,
      exam: db.find('exams', a.examId),
      subject: db.find('subjects', a.subjectId)
    }))
    setRows(data)
    if (attempts.length) {
      setMetrics({
        avg: Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length),
        best: Math.max(...attempts.map((a) => a.percentage)),
        count: attempts.length
      })
    }
  }, [user.id])

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="الاختبارات المكتملة" value={metrics.count} icon="FileText" tone="brand" />
        <StatCard title="متوسط الدرجات" value={metrics.avg} suffix="%" icon="Activity" tone="accent" />
        <StatCard title="أعلى درجة" value={metrics.best} suffix="%" icon="Trophy" tone="emerald" />
      </div>

      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100">
          <h3 className="text-lg font-bold">سجل النتائج</h3>
        </div>
        {rows.length === 0 ? (
          <EmptyState icon={Trophy} title="لا توجد نتائج بعد" description="بمجرد تسليم أول اختبار ستظهر نتيجتك هنا" />
        ) : (
          <Table
            columns={[
              { key: 'title', title: 'الاختبار', render: (r) => <span className="font-bold">{r.exam?.title}</span> },
              { key: 'subject', title: 'المادة', render: (r) => r.subject?.name },
              { key: 'score', title: 'الدرجة', render: (r) => `${r.score}/${r.totalScore}` },
              {
                key: 'percentage', title: 'النسبة', render: (r) => (
                  <Badge tone={r.percentage >= 80 ? 'success' : r.percentage >= 50 ? 'warning' : 'danger'}>
                    {r.percentage}%
                  </Badge>
                )
              },
              { key: 'date', title: 'التاريخ', render: (r) => formatDate(r.submittedAt) }
            ]}
            data={rows}
          />
        )}
      </Card>
    </div>
  )
}
