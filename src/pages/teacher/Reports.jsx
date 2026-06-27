import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { db } from '../../db/database.js'
import { commerceService } from '../../services/commerceService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export default function Reports() {
  const [metrics, setMetrics] = useState(null)
  const [courseRows, setCourseRows] = useState([])

  useEffect(() => {
    const subjects = db.all('subjects')
    const students = db.all('users').filter((user) => user.role === 'student')
    const attempts = db.all('attempts').filter((attempt) => attempt.status === 'submitted')
    setMetrics(commerceService.reportMetrics())
    setCourseRows(subjects.map((subject) => {
      const enrolled = students.filter((student) => student.subjectIds?.includes(subject.id))
      const revenue = db.all('orders')
        .filter((order) => order.subjectId === subject.id && order.status === 'paid')
        .reduce((sum, order) => sum + Number(order.total || 0), 0)
      const subjectAttempts = attempts.filter((attempt) => attempt.subjectId === subject.id)
      const avg = subjectAttempts.length
        ? Math.round(subjectAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / subjectAttempts.length)
        : 0
      return { name: subject.name, enrolled: enrolled.length, revenue, avg }
    }))
  }, [])

  if (!metrics) return <div className="skeleton h-64" />

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="الإيرادات" value={metrics.revenue} suffix="EGP" icon="Wallet" tone="brand" />
        <StatCard title="الطلبات" value={metrics.orders} icon="Receipt" tone="emerald" />
        <StatCard title="الشهادات" value={metrics.certificates} icon="Award" tone="gold" />
        <StatCard title="تحميلات الموارد" value={metrics.resources} icon="Download" tone="accent" />
      </div>

      <Card>
        <CardHeader title="أداء الكورسات" subtitle="الاشتراكات والإيرادات ومتوسط نتائج الاختبارات." />
        {courseRows.length === 0 ? (
          <EmptyState title="لا توجد بيانات تقارير" />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseRows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB' }} />
                <Bar dataKey="enrolled" name="الطلاب" fill="#2563EB" radius={[8, 8, 0, 0]} />
                <Bar dataKey="avg" name="متوسط الاختبارات" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  )
}
