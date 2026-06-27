import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Line, LineChart, Pie, PieChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, ArrowLeft } from 'lucide-react'
import { dashboardService } from '../../services/dashboardService.js'
import { db } from '../../db/database.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { relativeTime } from '../../utils/date.js'

const COLORS = ['#2563EB', '#14B8A6', '#22C55E', '#F59E0B', '#64748B', '#334155']

export default function AdminDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => { dashboardService.adminMetrics().then(setData) }, [])

  if (!data) return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}</div>

  return (
    <div className="space-y-5">
      <section className="surface p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-600">لوحة المالك</p>
            <h2 className="mt-1 text-2xl font-bold text-ink-900">نظرة تشغيلية على منصة المدرس الواحد</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">
              مؤشرات الطلاب والكورسات والطلبات محفوظة محليا ومهيأة لسيناريو مدرس واحد فقط.
            </p>
          </div>
          <Link to="/admin/settings" className="btn-outline">
            إعدادات المنصة
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="الطلاب" value={data.totals.students} icon="GraduationCap" tone="brand" />
        <StatCard title="الكورسات" value={data.totals.subjects} icon="Library" tone="emerald" />
        <StatCard title="الاختبارات" value={data.totals.exams} icon="FileText" tone="accent" />
        <StatCard title="الإيرادات" value={data.totals.revenue} suffix="EGP" icon="Wallet" tone="gold" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="الطلبات" value={data.totals.orders} icon="Receipt" tone="brand" />
        <StatCard title="المحاولات" value={data.totals.attempts} icon="CheckCircle2" tone="emerald" />
        <StatCard title="متوسط النتائج" value={data.avgScore} suffix="%" icon="Trophy" tone="accent" />
        <StatCard title="معدل الحضور" value={data.attendance.rate} suffix="%" icon="CalendarCheck" tone="dark" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SectionPanel title="نمو المنصة" subtitle="آخر 6 أشهر">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', boxShadow: 'none' }} />
                <Line name="طلاب جدد" type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line name="طلبات" type="monotone" dataKey="orders" stroke="#14B8A6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="توزيع الطلاب على الكورسات">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.subjectDist} dataKey="value" nameKey="name" outerRadius={92} innerRadius={48} paddingAngle={2}>
                  {data.subjectDist.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <SectionPanel title="آخر الأنشطة" action={<Activity size={18} className="text-ink-400" />}>
          <div className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200">
            {data.recentActivity.map((log) => {
              const user = db.find('users', log.userId)
              return (
                <div key={log.id} className="flex items-center gap-3 bg-white p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-700"><span className="font-bold text-ink-900">{user?.name || 'غير معروف'}</span> - {log.action}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{relativeTime(log.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionPanel>

        <SectionPanel title="روابط سريعة">
          <div className="space-y-2">
            {[
              { to: '/admin/students', title: 'إدارة الطلاب', sub: `${data.totals.students} طالب` },
              { to: '/admin/subjects', title: 'الكورسات', sub: `${data.totals.subjects} كورس` },
              { to: '/admin/exams', title: 'الاختبارات', sub: `${data.totals.exams} اختبار` },
              { to: '/admin/settings', title: 'إعدادات المنصة', sub: 'الهوية والتخزين المحلي' }
            ].map((item) => (
              <Link key={item.to} to={item.to} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition-colors hover:border-brand-200 hover:bg-brand-50">
                <div className="rounded-xl border border-brand-100 bg-brand-50 p-2.5 text-brand-600">
                  <ArrowLeft size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  )
}
