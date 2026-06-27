import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowLeft, Award, Bell, BookOpenText, Calendar, FileText, Megaphone, PlayCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { dashboardService } from '../../services/dashboardService.js'
import { commerceService } from '../../services/commerceService.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { CourseCard } from '../../components/ui/CourseCard.jsx'
import { db } from '../../db/database.js'
import { formatDate, relativeTime } from '../../utils/date.js'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    dashboardService.studentMetrics(user.id).then(setData)
  }, [user.id])

  const derived = useMemo(() => {
    if (!data) return null
    const notifications = db.all('notifications')
      .filter((notification) => notification.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
    const announcements = db.all('announcements')
      .filter((announcement) => user.subjectIds?.includes(announcement.subjectId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
    const certificates = db.all('certificates')
      .filter((certificate) => certificate.studentId === user.id)
      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
      .slice(0, 2)
    const progressItems = data.subjects.map((subject) => ({
      subject,
      progress: commerceService.progressForCourse(user.id, subject.id)
    }))
    const continueItem = progressItems.find((item) => item.progress.percentage < 100) || progressItems[0]
    const nextLesson = continueItem?.progress.lessons.find(
      (lesson) => !continueItem.progress.completed.some((item) => item.lessonId === lesson.id && item.completed)
    ) || continueItem?.progress.lessons[0]

    return { notifications, announcements, certificates, progressItems, continueItem, nextLesson }
  }, [data, user.id, user.subjectIds])

  if (!data || !derived) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="px-2 py-2 text-center">
        <h2 className="text-2xl font-extrabold text-ink-900">مرحباً بك، {user.name} 👋</h2>
        <p className="mt-2 text-sm font-medium text-ink-500">هنا نظرة عامة على تقدمك في التعلم</p>
        <div className="mt-4 flex justify-center">
          <Link to="/student/courses" className="btn-primary">
            استكشاف كورس جديد
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="كورساتي" value={data.subjects.length} icon="BookMarked" tone="brand" />
        <StatCard title="متوسط الدرجات" value={data.avgScore} suffix="%" icon="Trophy" tone="accent" />
        <StatCard title="اختبارات مكتملة" value={data.totalExams} icon="CheckCircle2" tone="emerald" />
        <StatCard title="شهاداتي" value={data.certificates} icon="Award" tone="gold" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
        <SectionPanel
          title="متابعة التعلم"
          subtitle="آخر كورس يحتاج إلى خطوة تالية"
          action={derived.nextLesson && <Link to={`/student/lessons/${derived.nextLesson.id}`} className="btn-primary">استكمال الدرس</Link>}
        >
          {!derived.continueItem ? (
            <EmptyState icon={BookOpenText} title="لا توجد كورسات بعد" action={<Link to="/student/courses" className="btn-primary">استكشاف الكورسات</Link>} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <CourseCard
                course={derived.continueItem.subject}
                to={`/student/subjects/${derived.continueItem.subject.id}`}
                compact
                action={<Link to={`/student/subjects/${derived.continueItem.subject.id}`} className="text-sm font-extrabold text-brand-600">فتح الكورس</Link>}
              />
              <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
                <p className="text-sm font-extrabold text-ink-900">{derived.nextLesson?.title || 'كل الدروس مكتملة'}</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">{derived.nextLesson?.summary || 'يمكنك مراجعة الكورس أو طلب الشهادة عند الاستحقاق.'}</p>
                <ProgressBar value={derived.continueItem.progress.percentage} className="mt-5" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniBox label="الدروس المكتملة" value={`${derived.continueItem.progress.completedCount}/${derived.continueItem.progress.totalLessons}`} />
                  <MiniBox label="التقدم" value={`${derived.continueItem.progress.percentage}%`} />
                </div>
              </div>
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="الإشعارات الأخيرة" action={<Link to="/student/notifications" className="text-sm font-extrabold text-brand-600">عرض الكل</Link>}>
          {derived.notifications.length === 0 ? (
            <EmptyState icon={Bell} title="لا توجد إشعارات" />
          ) : (
            <div className="space-y-2">
              {derived.notifications.map((notification) => (
                <ListRow key={notification.id} icon={Bell} title={notification.title} subtitle={notification.body} meta={relativeTime(notification.createdAt)} />
              ))}
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionPanel title="تقدم الكورسات">
          {derived.progressItems.length === 0 ? (
            <EmptyState title="لا توجد بيانات تقدم" />
          ) : (
            <div className="space-y-3">
              {derived.progressItems.map(({ subject, progress }) => (
                <div key={subject.id} className="rounded-xl border border-ink-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-ink-900">{subject.name}</p>
                      <p className="text-xs text-ink-500">{progress.completedCount}/{progress.totalLessons} درس مكتمل</p>
                    </div>
                    <span className="text-sm font-extrabold text-brand-600">{progress.percentage}%</span>
                  </div>
                  <ProgressBar value={progress.percentage} showLabel={false} />
                </div>
              ))}
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="تطور الدرجات" subtitle="آخر الاختبارات المسلمة">
          {data.scoreTrend.length === 0 ? (
            <EmptyState title="لا توجد درجات بعد" description="ابدأ أول اختبار لك لرؤية البيانات." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.scoreTrend}>
                  <CartesianGrid stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', boxShadow: 'none' }} />
                  <Area type="monotone" dataKey="score" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SectionPanel title="اختبارات قادمة" action={<Link to="/student/exams" className="text-sm font-extrabold text-brand-600">عرض الكل</Link>}>
          {data.upcomingExams.length === 0 ? (
            <EmptyState icon={FileText} title="لا توجد اختبارات قادمة" />
          ) : (
            <div className="space-y-2">
              {data.upcomingExams.slice(0, 4).map((exam) => (
                <ListRow
                  key={exam.id}
                  icon={FileText}
                  title={exam.title}
                  subtitle={`متاح حتى ${formatDate(exam.availableTo)}`}
                  action={<Link to={`/student/exams/${exam.id}`} className="btn-outline !min-h-8 !rounded-lg !px-3 !py-1.5 !text-xs">ابدأ</Link>}
                />
              ))}
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="الإعلانات">
          {derived.announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="لا توجد إعلانات" />
          ) : (
            <div className="space-y-2">
              {derived.announcements.map((announcement) => (
                <ListRow key={announcement.id} icon={Megaphone} title={announcement.title} subtitle={announcement.body} meta={relativeTime(announcement.createdAt)} />
              ))}
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="الشهادات" action={<Link to="/student/certificates" className="text-sm font-extrabold text-brand-600">إدارة الشهادات</Link>}>
          {derived.certificates.length === 0 ? (
            <EmptyState icon={Award} title="لا توجد شهادات صادرة بعد" />
          ) : (
            <div className="space-y-2">
              {derived.certificates.map((certificate) => (
                <ListRow key={certificate.id} icon={Award} title={certificate.courseTitle} subtitle={certificate.code} meta={formatDate(certificate.issuedAt)} />
              ))}
            </div>
          )}
        </SectionPanel>
      </div>
    </div>
  )
}

const MiniBox = ({ label, value }) => (
  <div className="rounded-xl border border-ink-200 bg-white p-3">
    <p className="text-xs font-bold text-ink-500">{label}</p>
    <p className="mt-1 text-lg font-extrabold text-ink-900">{value}</p>
  </div>
)

/** @param {any} props */
const ListRow = (props) => {
  const { icon: Icon, title, subtitle, meta = '', action = null } = props
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-ink-900">{title}</p>
          {subtitle && <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-ink-500">{subtitle}</p>}
          {meta && <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-400"><Calendar size={11} />{meta}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
