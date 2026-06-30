import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Activity, ArrowLeft, CheckCheck, Settings } from 'lucide-react'

import { dashboardService } from '../../services/dashboardService.js'
import { db } from '../../db/database.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { relativeTime } from '../../utils/date.js'

const COLORS = ['#0B6F7A', '#089CC9', '#14B8A6', '#075B78', '#64748B', '#0B2B3F']

const QUICK_LINKS = [
  {
    to: '/admin/students',
    title: 'إدارة الطلاب',
    getSub: (data) => `${data.totals.students} طالب`
  },
  {
    to: '/admin/subjects',
    title: 'الكورسات',
    getSub: (data) => `${data.totals.subjects} كورس`
  },
  {
    to: '/admin/exams',
    title: 'الاختبارات',
    getSub: (data) => `${data.totals.exams} اختبار`
  },
  {
    to: '/admin/settings',
    title: 'إعدادات المنصة',
    getSub: () => 'الهوية والتخزين المحلي'
  }
]

export default function AdminDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    dashboardService.adminMetrics().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <CheckCheck size={15} />
              لوحة المالك
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              نظرة تشغيلية على منصة المدرس الواحد
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              مؤشرات الطلاب والكورسات والطلبات محفوظة محليًا ومهيأة لسيناريو مدرس واحد فقط.
            </p>
          </div>

          <Link
            to="/admin/settings"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DCEAF3] bg-white/80 px-5 py-3 text-sm font-black text-[#0B2B3F] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B6F7A]/30 hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
          >
            إعدادات المنصة
            <Settings size={16} />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="الطلاب"
          value={data.totals.students}
          icon="GraduationCap"
          tone="blue"
          description="إجمالي الطلاب المسجلين داخل المنصة."
        />

        <StatCard
          title="الكورسات"
          value={data.totals.subjects}
          icon="Library"
          tone="green"
          description="عدد الكورسات والمواد المتاحة للطلاب."
        />

        <StatCard
          title="الاختبارات"
          value={data.totals.exams}
          icon="FileText"
          tone="orange"
          description="اختبارات مضافة لقياس مستوى الطلاب."
        />

        <StatCard
          title="الإيرادات"
          value={data.totals.revenue}
          suffix="EGP"
          icon="Wallet"
          tone="burgundy"
          description="إجمالي المدفوعات والطلبات المقبولة."
        />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="الطلبات"
          value={data.totals.orders}
          icon="Receipt"
          tone="cyan"
          description="طلبات الاشتراك والمتابعة داخل المنصة."
        />

        <StatCard
          title="المحاولات"
          value={data.totals.attempts}
          icon="CheckCircle2"
          tone="emerald"
          description="إجمالي محاولات الطلاب في الاختبارات."
        />

        <StatCard
          title="متوسط النتائج"
          value={data.avgScore}
          suffix="%"
          icon="Trophy"
          tone="yellow"
          description="متوسط أداء الطلاب في الاختبارات."
        />

        <StatCard
          title="معدل الحضور"
          value={data.attendance.rate}
          suffix="%"
          icon="CalendarCheck"
          tone="red"
          description="نسبة حضور الطلاب للمحاضرات والدروس."
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SectionPanel title="نمو المنصة" subtitle="آخر 6 أشهر">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.trend}
                margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#DCEAF3"
                  vertical={false}
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="month"
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
                    background: 'rgba(255,255,255,0.94)',
                    boxShadow: '0 18px 45px rgba(11,95,122,0.10)',
                    fontWeight: 800
                  }}
                  labelStyle={{
                    color: '#0B2B3F',
                    fontWeight: 900
                  }}
                />

                <Line
                  name="طلاب جدد"
                  type="monotone"
                  dataKey="students"
                  stroke="#0B6F7A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0B6F7A', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  name="طلبات"
                  type="monotone"
                  dataKey="orders"
                  stroke="#089CC9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#089CC9', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel
          title="توزيع الطلاب على الكورسات"
          subtitle="حسب الاشتراكات الحالية"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.subjectDist}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={94}
                  innerRadius={52}
                  paddingAngle={3}
                >
                  {data.subjectDist.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    borderColor: '#DCEAF3',
                    background: 'rgba(255,255,255,0.94)',
                    boxShadow: '0 18px 45px rgba(11,95,122,0.10)',
                    fontWeight: 800
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <SectionPanel
          title="آخر الأنشطة"
          subtitle="أحدث العمليات داخل المنصة"
          action={
            <Activity
              size={18}
              className="text-[#0B6F7A] dark:text-cyan-300"
            />
          }
        >
          <div className="overflow-hidden rounded-2xl border border-[#DCEAF3] bg-white/70 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="divide-y divide-[#DCEAF3] dark:divide-slate-700">
              {data.recentActivity.map((log) => {
                const user = db.find('users', log.userId)

                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 bg-white/65 p-4 transition-colors hover:bg-[#F7FBFF] dark:bg-slate-900/40 dark:hover:bg-slate-800/70"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#075B78] text-sm font-black text-white shadow-lg shadow-[#075B78]/15 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none">
                      {user?.name?.charAt(0) || '?'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#41596B] dark:text-slate-300">
                        <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                          {user?.name || 'غير معروف'}
                        </span>{' '}
                        - {log.action}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#6B8293] dark:text-slate-400">
                        {relativeTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="روابط سريعة" subtitle="اختصارات مهمة للإدارة">
          <div className="space-y-2">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-3 rounded-2xl border border-[#DCEAF3] bg-white/75 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B6F7A]/25 hover:bg-[#E8F8FA] dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#0B6F7A]/10 bg-[#E8F8FA] text-[#0B6F7A] transition-colors group-hover:bg-white dark:border-cyan-300/10 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-hover:bg-slate-900">
                  <ArrowLeft size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-[#6B8293] dark:text-slate-400">
                    {item.getSub(data)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  )
}