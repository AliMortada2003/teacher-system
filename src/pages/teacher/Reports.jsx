import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { BarChart3 } from 'lucide-react'

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
    const orders = db.all('orders')

    setMetrics(commerceService.reportMetrics())

    setCourseRows(
      subjects.map((subject) => {
        const enrolled = students.filter((student) => student.subjectIds?.includes(subject.id))

        const revenue = orders
          .filter((order) => order.subjectId === subject.id && order.status === 'paid')
          .reduce((sum, order) => sum + Number(order.total || 0), 0)

        const subjectAttempts = attempts.filter((attempt) => attempt.subjectId === subject.id)

        const avg = subjectAttempts.length
          ? Math.round(subjectAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / subjectAttempts.length)
          : 0

        return {
          name: subject.name,
          enrolled: enrolled.length,
          revenue,
          avg
        }
      })
    )
  }, [])

  if (!metrics) {
    return <div className="skeleton h-64" />
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
            <BarChart3 size={15} />
            التقارير
          </div>

          <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
            تقارير الأداء والمبيعات
          </h2>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
            تابع الإيرادات والطلبات والشهادات وتحميلات الموارد، مع مقارنة أداء الكورسات من حيث الاشتراكات ومتوسط النتائج.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="الإيرادات" value={metrics.revenue} suffix="EGP" icon="Wallet" tone="blue" description="إجمالي الإيرادات المحلية." />
        <StatCard title="الطلبات" value={metrics.orders} icon="Receipt" tone="green" description="عدد طلبات الشراء." />
        <StatCard title="الشهادات" value={metrics.certificates} icon="Award" tone="orange" description="الشهادات الصادرة للطلاب." />
        <StatCard title="تحميلات الموارد" value={metrics.resources} icon="Download" tone="burgundy" description="عدد تحميلات ملفات الموارد." />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <CardHeader
          title="أداء الكورسات"
          subtitle="الاشتراكات والإيرادات ومتوسط نتائج الاختبارات."
        />

        {courseRows.length === 0 ? (
          <EmptyState title="لا توجد بيانات تقارير" />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courseRows}
                margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#DCEAF3"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6B8293', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: '#6B8293', fontWeight: 700 }}
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
                  dataKey="enrolled"
                  name="الطلاب"
                  fill="#0B6F7A"
                  radius={[10, 10, 0, 0]}
                  barSize={34}
                />

                <Bar
                  dataKey="avg"
                  name="متوسط الاختبارات"
                  fill="#14B8A6"
                  radius={[10, 10, 0, 0]}
                  barSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  )
}