import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  FileText,
  Megaphone,
  Plus,
  Receipt,
  Settings,
  UsersRound
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext.jsx'
import { dashboardService } from '../../services/dashboardService.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { CourseCard } from '../../components/ui/CourseCard.jsx'
import { db } from '../../db/database.js'
import { formatDate, relativeTime } from '../../utils/date.js'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ROLES } from '../../utils/constants.js'

const getQuickActions = (role) => {
  if (role === ROLES.TEACHER) {
    return [
      { label: 'إدارة المساعدين', to: '/teacher/assistants', icon: UsersRound },
      { label: 'إعدادات المنصة', to: '/teacher/settings', icon: Settings },
      { label: 'تقارير الأداء', to: '/teacher/reports', icon: FileText },
      { label: 'طلبات الطلاب', to: '/teacher/orders', icon: Receipt }
    ]
  }

  return [
    { label: 'إضافة كورس', to: '/assistant/courses', icon: Plus },
    { label: 'إدارة الدروس', to: '/assistant/lessons', icon: BookOpen },
    { label: 'اختبار جديد', to: '/assistant/quizzes', icon: FileText },
    { label: 'إعلان للطلاب', to: '/assistant/announcements', icon: Megaphone },
    { label: 'تسجيل حضور', to: '/assistant/attendance', icon: UsersRound }
  ]
}

const quickActionColors = [
  'bg-[#2563EB]',
  'bg-[#0B6F7A]',
  'bg-[#16A34A]',
  'bg-[#EA580C]',
  'bg-[#334155]'
]

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const isOwner = user.role === ROLES.TEACHER
  const basePath = isOwner ? '/teacher' : '/assistant'
  const quickActions = useMemo(() => getQuickActions(user.role), [user.role])

  useEffect(() => {
    dashboardService.teacherMetrics(user.id).then(setData)
  }, [user.id])

  const derived = useMemo(() => {
    if (!data) return null

    const orders = db
      .all('orders')
      .filter((order) => order.status === 'paid')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    const students = db.all('users').filter((item) => item.role === 'student' && !item.hidden)
    const lessons = db.all('lessons')
    const exams = db.all('exams')

    const courseRows = data.subjects.map((subject) => ({
      ...subject,
      lessonsCount: lessons.filter((lesson) => lesson.subjectId === subject.id).length,
      quizzesCount: exams.filter((exam) => exam.subjectId === subject.id).length,
      studentsCount: students.filter((student) => student.subjectIds?.includes(subject.id)).length
    }))

    return { orders, courseRows }
  }, [data])

  if (!data || !derived) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <BookOpen size={15} />
              {isOwner ? 'لوحة المالك' : 'لوحة المساعد'}
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              مرحباً بك، {user.name}
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              {isOwner
                ? 'تابع أداء المنصة والطلبات والتقارير، وتحكم في إعدادات المنصة وحسابات المساعدين.'
                : 'إدارة شاملة للكورسات والدروس والاختبارات والحضور والطلاب من مكان واحد.'}
            </p>
          </div>

          <Link
            to={isOwner ? '/teacher/assistants' : '/assistant/courses'}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-5 py-3 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition-all hover:-translate-y-0.5 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
          >
            {isOwner ? 'إدارة المساعدين' : 'إدارة الكورسات'}
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="الكورسات"
          value={data.subjects.length}
          icon="BookMarked"
          tone="blue"
          description="إجمالي كورساتك داخل المنصة."
        />

        <StatCard
          title="الطلاب"
          value={data.totalStudents}
          icon="Users"
          tone="green"
          description="عدد الطلاب المشتركين."
        />

        <StatCard
          title="الطلبات"
          value={data.orders}
          icon="Receipt"
          tone="orange"
          description="طلبات الشراء والتسجيل."
        />

        <StatCard
          title="الإيرادات"
          value={data.revenue}
          suffix="EGP"
          icon="Wallet"
          tone="burgundy"
          description="إجمالي الإيرادات الحالية."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
        <SectionPanel title="متوسط النتائج حسب الكورس" subtitle="قراءة سريعة لأداء الطلاب">
          {data.scoreBySubject.length === 0 ? (
            <EmptyState title="لا توجد بيانات" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.scoreBySubject}
                  margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#DCEAF3"
                    vertical={false}
                    strokeDasharray="4 4"
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
                    dataKey="avg"
                    name="متوسط النتيجة"
                    fill="#0B6F7A"
                    radius={[10, 10, 0, 0]}
                    barSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="إجراءات سريعة">
          <div className="grid gap-2">
            {quickActions.map((action, index) => (
              <Link
                key={action.label}
                to={action.to}
                className="group flex items-center justify-between rounded-2xl border border-[#DCEAF3] bg-white/75 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B6F7A]/25 hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800/80"
              >
                <span className="flex items-center gap-3 text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm ${
                      quickActionColors[index] || 'bg-[#334155]'
                    }`}
                  >
                    <action.icon size={17} />
                  </span>

                  {action.label}
                </span>

                <ArrowLeft
                  size={15}
                  className="text-[#6B8293] transition-transform group-hover:-translate-x-1 group-hover:text-[#0B6F7A] dark:text-slate-400 dark:group-hover:text-cyan-300"
                />
              </Link>
            ))}
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionPanel
          title="آخر التسجيلات"
          action={
            <Link
              to={`${basePath}/orders`}
              className="text-sm font-black text-[#0B6F7A] hover:underline dark:text-cyan-300"
            >
              كل الطلبات
            </Link>
          }
        >
          {derived.orders.length === 0 ? (
            <EmptyState icon={Receipt} title="لا توجد طلبات مدفوعة بعد" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#DCEAF3] dark:border-slate-700">
              <div className="grid grid-cols-[1fr_120px_110px] border-b border-[#DCEAF3] bg-[#F7FBFF] px-4 py-3 text-xs font-black text-[#6B8293] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                <span>الكورس</span>
                <span>القيمة</span>
                <span>التاريخ</span>
              </div>

              {derived.orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_120px_110px] items-center border-t border-[#EAF2F6] bg-white/70 px-4 py-3 text-sm transition-colors hover:bg-[#F7FBFF] dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-[#0B2B3F] dark:text-slate-50">
                      {order.courseTitle}
                    </p>

                    <p className="truncate text-xs font-bold text-[#6B8293] dark:text-slate-400">
                      {db.find('users', order.studentId)?.name || 'طالب'}
                    </p>
                  </div>

                  <p className="font-black text-[#0B6F7A] dark:text-cyan-300">
                    {order.total} {order.currency}
                  </p>

                  <p className="text-xs font-bold text-[#6B8293] dark:text-slate-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionPanel>

        <SectionPanel
          title="آخر محاولات الاختبارات"
          action={
            <Link
              to={isOwner ? '/teacher/reports' : '/assistant/quizzes'}
              className="text-sm font-black text-[#0B6F7A] hover:underline dark:text-cyan-300"
            >
              {isOwner ? 'التقارير' : 'إدارة الاختبارات'}
            </Link>
          }
        >
          {data.recentAttempts.length === 0 ? (
            <EmptyState icon={ClipboardList} title="لا توجد محاولات" />
          ) : (
            <div className="space-y-2">
              {data.recentAttempts.map((attempt) => {
                const student = db.find('users', attempt.studentId)
                const exam = db.find('exams', attempt.examId)

                return (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#DCEAF3] bg-white/75 p-3 shadow-sm transition-colors hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800/70"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B6F7A] text-sm font-black text-white shadow-sm">
                        {student?.name?.charAt(0) || 'ط'}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                          {student?.name || 'طالب'}
                        </p>

                        <p className="truncate text-xs font-bold text-[#6B8293] dark:text-slate-400">
                          {exam?.title || 'اختبار'}
                        </p>
                      </div>
                    </div>

                    <div className="text-left">
                      <p className="font-black text-[#0B6F7A] dark:text-cyan-300">
                        {attempt.percentage}%
                      </p>

                      <p className="text-[11px] font-bold text-[#6B8293] dark:text-slate-400">
                        {relativeTime(attempt.submittedAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionPanel>
      </div>
    </div>
  )
}
