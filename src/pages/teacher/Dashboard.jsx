import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ClipboardList, FileText, Megaphone, Plus, Receipt, Settings, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { dashboardService } from '../../services/dashboardService.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { CourseCard } from '../../components/ui/CourseCard.jsx'
import { db } from '../../db/database.js'
import { formatDate, relativeTime } from '../../utils/date.js'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

const quickActions = [
  { label: 'إضافة كورس', to: '/teacher/courses', icon: Plus },
  { label: 'إدارة الدروس', to: '/teacher/lessons', icon: BookOpen },
  { label: 'اختبار جديد', to: '/teacher/quizzes', icon: FileText },
  { label: 'إعلان للطلاب', to: '/teacher/announcements', icon: Megaphone },
  { label: 'إعدادات المدرس', to: '/teacher/settings', icon: Settings }
]

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    dashboardService.teacherMetrics(user.id).then(setData)
  }, [user.id])

  const derived = useMemo(() => {
    if (!data) return null
    const orders = db.all('orders')
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
    return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}</div>
  }

  return (
    <div className="space-y-6">
      <section className="px-2 py-2 text-center">
        <h2 className="text-2xl font-extrabold text-ink-900">مرحباً بك، {user.name}</h2>
        <p className="mt-2 text-sm font-medium text-ink-500">إدارة شاملة لتجربة التعلم من مكان واحد</p>
        <div className="mt-4 flex justify-center">
          <Link to="/teacher/courses" className="btn-primary">
            إدارة الكورسات
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="الكورسات" value={data.subjects.length} icon="BookMarked" tone="brand" />
        <StatCard title="الطلاب" value={data.totalStudents} icon="Users" tone="emerald" />
        <StatCard title="الطلبات" value={data.orders} icon="Receipt" tone="gold" />
        <StatCard title="الإيرادات" value={data.revenue} suffix="EGP" icon="Wallet" tone="accent" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
        <SectionPanel title="متوسط النتائج حسب الكورس" subtitle="قراءة سريعة لأداء الطلاب">
          {data.scoreBySubject.length === 0 ? (
            <EmptyState title="لا توجد بيانات" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.scoreBySubject}>
                  <CartesianGrid stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', boxShadow: 'none' }} />
                  <Bar dataKey="avg" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="إجراءات سريعة">
          <div className="grid gap-2">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to} className="flex items-center justify-between rounded-xl border border-ink-200 bg-white p-3 transition-colors hover:border-brand-200 hover:bg-brand-50">
                <span className="flex items-center gap-3 text-sm font-extrabold text-ink-800">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600">
                    <action.icon size={17} />
                  </span>
                  {action.label}
                </span>
                <ArrowLeft size={15} className="text-ink-400" />
              </Link>
            ))}
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionPanel title="آخر التسجيلات" action={<Link to="/teacher/orders" className="text-sm font-extrabold text-brand-600">كل الطلبات</Link>}>
          {derived.orders.length === 0 ? (
            <EmptyState icon={Receipt} title="لا توجد طلبات مدفوعة بعد" />
          ) : (
            <div className="overflow-hidden rounded-xl border border-ink-200">
              <div className="grid grid-cols-[1fr_120px_110px] border-b border-ink-200 bg-ink-50 px-4 py-3 text-xs font-extrabold text-ink-500">
                <span>الكورس</span>
                <span>القيمة</span>
                <span>التاريخ</span>
              </div>
              {derived.orders.map((order) => (
                <div key={order.id} className="grid grid-cols-[1fr_120px_110px] items-center border-t border-ink-100 bg-white px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-extrabold text-ink-900">{order.courseTitle}</p>
                    <p className="truncate text-xs text-ink-500">{db.find('users', order.studentId)?.name || 'طالب'}</p>
                  </div>
                  <p className="font-extrabold text-ink-900">{order.total} {order.currency}</p>
                  <p className="text-xs text-ink-500">{formatDate(order.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="آخر محاولات الاختبارات" action={<Link to="/teacher/quizzes" className="text-sm font-extrabold text-brand-600">إدارة الاختبارات</Link>}>
          {data.recentAttempts.length === 0 ? (
            <EmptyState icon={ClipboardList} title="لا توجد محاولات" />
          ) : (
            <div className="space-y-2">
              {data.recentAttempts.map((attempt) => {
                const student = db.find('users', attempt.studentId)
                const exam = db.find('exams', attempt.examId)
                return (
                  <div key={attempt.id} className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                        {student?.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-ink-900">{student?.name}</p>
                        <p className="truncate text-xs text-ink-500">{exam?.title}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-brand-600">{attempt.percentage}%</p>
                      <p className="text-[11px] text-ink-400">{relativeTime(attempt.submittedAt)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionPanel>
      </div>

      <SectionPanel title="الكورسات" action={<Link to="/teacher/courses" className="text-sm font-extrabold text-brand-600">تحرير الكورسات</Link>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {derived.courseRows.map((subject) => (
            <CourseCard
              key={subject.id}
              course={subject}
              compact
              lessonsCount={subject.lessonsCount}
              quizzesCount={subject.quizzesCount}
              studentsCount={subject.studentsCount}
              action={<Link to="/teacher/courses" className="text-sm font-extrabold text-brand-600">تحرير</Link>}
            />
          ))}
        </div>
      </SectionPanel>
    </div>
  )
}
