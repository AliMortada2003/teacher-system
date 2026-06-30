import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  PlayCircle,
  Star,
  UsersRound
} from 'lucide-react'
import { db } from '../../db/database.js'
import { commerceService } from '../../services/commerceService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { ROLES } from '../../utils/constants.js'

const countStudents = (subjectId) =>
  db.all('users').filter((item) => item.role === ROLES.STUDENT && item.subjectIds?.includes(subjectId)).length

const formatPrice = (subject) =>
  `${subject.currency || 'EGP'} ${Number(subject.price || 0).toLocaleString('ar-EG')}`

export default function CourseDetails() {
  const { id } = useParams()
  const location = useLocation()
  const { user, refresh } = useAuth()
  const toast = useToast()
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(false)

  const inStudentArea = location.pathname.startsWith('/student/')
  const backPath = inStudentArea ? '/student/courses' : '/subjects'
  const isStudent = user?.role === ROLES.STUDENT
  const enrolled = isStudent && user.subjectIds?.includes(id)

  const load = () => {
    const subject = db.find('subjects', id)
    const lessons = db.all('lessons')
      .filter((lesson) => lesson.subjectId === id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
    const exams = db.all('exams').filter((exam) => exam.subjectId === id && exam.published)
    const progress = isStudent ? commerceService.progressForCourse(user.id, id) : null

    setState({
      subject,
      lessons,
      exams,
      progress,
      studentsCount: countStudents(id)
    })
  }

  useEffect(() => {
    load()
  }, [id, user?.id, user?.subjectIds?.length])

  const totalMinutes = useMemo(() => {
    if (!state?.lessons?.length) return 0
    return state.lessons.reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0)
  }, [state?.lessons])

  const purchase = async () => {
    if (!isStudent) return

    setLoading(true)
    try {
      const result = await commerceService.purchaseCourse({ studentId: user.id, subjectId: id })
      toast.success(result.alreadyPurchased ? 'أنت مشترك في هذا الكورس بالفعل' : 'تم تفعيل الكورس بنجاح')
      refresh()
      load()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!state) return <div className="skeleton h-96" />

  const { subject, lessons, exams, progress, studentsCount } = state

  if (!subject) {
    return (
      <div className={inStudentArea ? '' : 'px-4 py-10 sm:px-6 lg:px-8'}>
        <div className="mx-auto max-w-5xl">
          <EmptyState
            icon={BookOpen}
            title="الكورس غير موجود"
            description="ارجع لقائمة الكورسات واختر كورس متاح."
            action={<Link to={backPath} className="btn-primary">العودة للكورسات</Link>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={inStudentArea ? 'space-y-6' : 'bg-[#F6FAFB] px-4 py-10 sm:px-6 lg:px-8 dark:bg-[#0B1220]'}>
      <div className={inStudentArea ? 'space-y-6' : 'mx-auto max-w-7xl space-y-6'}>
        <Link to={backPath} className="btn-outline w-fit">
          <ArrowRight size={16} />
          العودة للكورسات
        </Link>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="overflow-hidden !p-0">
            <div className="relative min-h-[280px] bg-[#075B78] p-6 text-white md:p-8">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#FFFFFF_0,transparent_28%),radial-gradient(circle_at_82%_70%,#14B8A6_0,transparent_26%)]" />
              <div className="relative">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="brand" className="border-white/20 bg-white/95 text-[#0B6F7A] before:bg-[#0B6F7A]">
                    {subject.level || subject.grade || 'كورس'}
                  </Badge>
                  <Badge tone="warning" className="border-white/20 bg-white/95 text-[#075B78] before:bg-[#075B78]">
                    {subject.code}
                  </Badge>
                </div>

                <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
                  {subject.name}
                </h1>
                <p className="mt-4 max-w-3xl text-sm font-bold leading-8 text-white/85 md:text-base">
                  {subject.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <HeroStat icon={BookOpen} label="الدروس" value={lessons.length} />
                  <HeroStat icon={FileText} label="الاختبارات" value={exams.length} />
                  <HeroStat icon={Clock} label="إجمالي الدقائق" value={totalMinutes} />
                  <HeroStat icon={UsersRound} label="طلاب مسجلين" value={studentsCount} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-fit">
            <CardHeader title="تفاصيل الاشتراك" subtitle="كل الدروس وروابط الفيديو في مكان واحد." />
            <div className="space-y-4">
              <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
                <p className="text-sm font-bold text-ink-500">سعر الكورس</p>
                <p className="mt-1 text-3xl font-black text-[#0B6F7A]">{formatPrice(subject)}</p>
              </div>

              {progress && <ProgressBar value={progress.percentage} />}

              {enrolled ? (
                <Link to={`/student/subjects/${subject.id}`} className="btn-primary w-full">
                  <CheckCircle2 size={16} />
                  متابعة الكورس
                </Link>
              ) : isStudent ? (
                <Button icon={CreditCard} loading={loading} onClick={purchase} className="w-full">
                  شراء الكورس
                </Button>
              ) : (
                <Link to="/login" className="btn-primary w-full">
                  تسجيل الدخول للاشتراك
                </Link>
              )}

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-black text-ink-500">
                <span className="rounded-xl bg-ink-50 p-3">{lessons.length} درس</span>
                <span className="rounded-xl bg-ink-50 p-3">{exams.length} اختبار</span>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardHeader title="فيديوهات الكورس" subtitle="روابط الفيديوهات الخاصة بكل درس داخل الكورس." />
            {lessons.length === 0 ? (
              <EmptyState icon={PlayCircle} title="لا توجد دروس بعد" />
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <article
                    key={lesson.id}
                    className="rounded-2xl border border-ink-200 bg-white p-4 transition-colors hover:border-brand-200 hover:bg-brand-50"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8FA] text-sm font-black text-[#0B6F7A]">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-black text-ink-900">{lesson.title}</h2>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-500">{lesson.summary}</p>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-ink-500">
                            <Clock size={13} />
                            {lesson.duration} دقيقة
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {enrolled && (
                          <Link to={`/student/lessons/${lesson.id}`} className="btn-primary">
                            <PlayCircle size={15} />
                            مشاهدة داخل المنصة
                          </Link>
                        )}

                        {!enrolled && (
                          <span className="chip bg-ink-50 text-ink-500">
                            اشترك للمشاهدة داخل المنصة
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader title="محتوى الكورس" />
              <div className="space-y-3 text-sm font-bold text-ink-600">
                <InfoLine label="المستوى" value={subject.level || subject.grade || 'غير محدد'} />
                <InfoLine label="الكود" value={subject.code || '-'} />
                <InfoLine label="التقييم" value={subject.rating || '4.9'} icon={Star} />
                <InfoLine label="المدة" value={`${totalMinutes} دقيقة`} />
              </div>
            </Card>

            <Card>
              <CardHeader title="الاختبارات" subtitle="الاختبارات المتاحة داخل الكورس." />
              {exams.length === 0 ? (
                <EmptyState icon={FileText} title="لا توجد اختبارات" />
              ) : (
                <div className="space-y-2">
                  {exams.map((exam) => (
                    <div key={exam.id} className="rounded-xl border border-ink-200 bg-white p-3">
                      <p className="text-sm font-black text-ink-900">{exam.title}</p>
                      <p className="mt-1 text-xs font-bold text-ink-500">
                        {exam.duration} دقيقة · {exam.totalScore} درجة
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

const HeroStat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
    <Icon size={18} className="mb-3 text-white/85" />
    <p className="text-2xl font-black">{value}</p>
    <p className="mt-1 text-xs font-bold text-white/75">{label}</p>
  </div>
)

const InfoLine = ({ label, value, icon: Icon = null }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-3 py-2">
    <span className="text-ink-500">{label}</span>
    <span className="inline-flex min-w-0 items-center gap-1 truncate font-black text-ink-900">
      {Icon && <Icon size={14} fill="currentColor" className="text-[#089CC9]" />}
      {value}
    </span>
  </div>
)
