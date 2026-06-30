import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  ArrowLeft,
  Award,
  Bell,
  BookOpenText,
  Calendar,
  FileText,
  Megaphone
} from 'lucide-react'

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
    let mounted = true

    dashboardService.studentMetrics(user.id).then((result) => {
      if (mounted) setData(result)
    })

    return () => {
      mounted = false
    }
  }, [user.id])

  const derived = useMemo(() => {
    if (!data) return null

    const notifications = db
      .all('notifications')
      .filter((notification) => notification.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)

    const announcements = db
      .all('announcements')
      .filter((announcement) => user.subjectIds?.includes(announcement.subjectId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)

    const certificates = db
      .all('certificates')
      .filter((certificate) => certificate.studentId === user.id)
      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
      .slice(0, 2)

    const progressItems = data.subjects.map((subject) => ({
      subject,
      progress: commerceService.progressForCourse(user.id, subject.id)
    }))

    const continueItem = progressItems.find((item) => item.progress.percentage < 100) || progressItems[0]

    const nextLesson =
      continueItem?.progress.lessons.find(
        (lesson) =>
          !continueItem.progress.completed.some(
            (item) => item.lessonId === lesson.id && item.completed
          )
      ) || continueItem?.progress.lessons[0]

    return {
      notifications,
      announcements,
      certificates,
      progressItems,
      continueItem,
      nextLesson
    }
  }, [data, user.id, user.subjectIds])

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
              <BookOpenText size={15} />
              لوحة الطالب
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              مرحباً بك، {user.name} 👋
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              هنا نظرة عامة على تقدمك في التعلم، الكورسات، الاختبارات، الإشعارات والشهادات.
            </p>
          </div>

          <Link
            to="/student/courses"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-5 py-3 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition-all hover:-translate-y-0.5 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
          >
            استكشاف كورس جديد
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="كورساتي" value={data.subjects.length} icon="BookMarked" tone="blue" description="الكورسات المشترك بها حالياً." />
        <StatCard title="متوسط الدرجات" value={data.avgScore} suffix="%" icon="Trophy" tone="green" description="متوسط نتائجك في الاختبارات." />
        <StatCard title="اختبارات مكتملة" value={data.totalExams} icon="CheckCircle2" tone="orange" description="عدد الاختبارات التي تم حلها." />
        <StatCard title="شهاداتي" value={data.certificates} icon="Award" tone="burgundy" description="الشهادات الصادرة لك." />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
        <SectionPanel
          title="متابعة التعلم"
          subtitle="آخر كورس يحتاج إلى خطوة تالية"
          action={
            derived.nextLesson && (
              <Link to={`/student/lessons/${derived.nextLesson.id}`} className="btn-primary">
                استكمال الدرس
              </Link>
            )
          }
        >
          {!derived.continueItem ? (
            <EmptyState
              icon={BookOpenText}
              title="لا توجد كورسات بعد"
              action={<Link to="/student/courses" className="btn-primary">استكشاف الكورسات</Link>}
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <CourseCard
                course={derived.continueItem.subject}
                to={`/student/subjects/${derived.continueItem.subject.id}`}
                compact
                action={
                  <Link
                    to={`/student/subjects/${derived.continueItem.subject.id}`}
                    className="text-sm font-black text-[#0B6F7A] hover:underline dark:text-cyan-300"
                  >
                    فتح الكورس
                  </Link>
                }
              />

              <div className="rounded-[1.5rem] border border-[#DCEAF3] bg-[#F7FBFF] p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-black text-[#0B2B3F] dark:text-slate-50">
                  {derived.nextLesson?.title || 'كل الدروس مكتملة'}
                </p>

                <p className="mt-2 text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
                  {derived.nextLesson?.summary || 'يمكنك مراجعة الكورس أو طلب الشهادة عند الاستحقاق.'}
                </p>

                <ProgressBar value={derived.continueItem.progress.percentage} className="mt-5" />

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniBox label="الدروس المكتملة" value={`${derived.continueItem.progress.completedCount}/${derived.continueItem.progress.totalLessons}`} />
                  <MiniBox label="التقدم" value={`${derived.continueItem.progress.percentage}%`} />
                </div>
              </div>
            </div>
          )}
        </SectionPanel>

        <SectionPanel
          title="الإشعارات الأخيرة"
          action={
            <Link to="/student/notifications" className="text-sm font-black text-[#0B6F7A] hover:underline dark:text-cyan-300">
              عرض الكل
            </Link>
          }
        >
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
                <div key={subject.id} className="rounded-2xl border border-[#DCEAF3] bg-white/75 p-4 transition-colors hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800/70">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#0B2B3F] dark:text-slate-50">{subject.name}</p>
                      <p className="text-xs font-bold text-[#6B8293] dark:text-slate-400">{progress.completedCount}/{progress.totalLessons} درس مكتمل</p>
                    </div>

                    <span className="text-sm font-black text-[#0B6F7A] dark:text-cyan-300">
                      {progress.percentage}%
                    </span>
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
                <AreaChart data={data.scoreTrend} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#DCEAF3" vertical={false} strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B8293', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B8293', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 18, borderColor: '#DCEAF3', background: 'rgba(255,255,255,0.95)', boxShadow: '0 18px 45px rgba(11,95,122,0.10)', fontWeight: 800 }} />
                  <Area type="monotone" dataKey="score" stroke="#0B6F7A" fill="#E8F8FA" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SectionPanel
          title="اختبارات قادمة"
          action={<Link to="/student/exams" className="text-sm font-black text-[#0B6F7A] hover:underline dark:text-cyan-300">عرض الكل</Link>}
        >
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

        <SectionPanel
          title="الشهادات"
          action={<Link to="/student/certificates" className="text-sm font-black text-[#0B6F7A] hover:underline dark:text-cyan-300">إدارة الشهادات</Link>}
        >
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
  <div className="rounded-2xl border border-[#DCEAF3] bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
    <p className="text-xs font-black text-[#6B8293] dark:text-slate-400">{label}</p>
    <p className="mt-1 text-lg font-black text-[#0B2B3F] dark:text-slate-50">{value}</p>
  </div>
)

const ListRow = ({ icon: Icon, title, subtitle, meta = '', action = null }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#DCEAF3] bg-white/75 p-3 shadow-sm transition-colors hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800/70">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B6F7A] text-white shadow-sm">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-black text-[#0B2B3F] dark:text-slate-50">{title}</p>
        {subtitle && <p className="mt-0.5 line-clamp-1 text-xs font-bold leading-5 text-[#6B8293] dark:text-slate-400">{subtitle}</p>}
        {meta && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#6B8293] dark:text-slate-500">
            <Calendar size={11} />
            {meta}
          </p>
        )}
      </div>
    </div>

    {action}
  </div>
)