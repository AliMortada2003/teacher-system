import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, NotebookPen, PlayCircle } from 'lucide-react'
import { db } from '../../db/database.js'
import { commerceService } from '../../services/commerceService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'

export default function LessonPlayer() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const [lesson, setLesson] = useState(null)
  const [subject, setSubject] = useState(null)
  const [resources, setResources] = useState([])
  const [progress, setProgress] = useState(null)
  const [lessons, setLessons] = useState([])
  const [notes, setNotes] = useState('')

  const load = () => {
    const found = db.find('lessons', id)
    const foundSubject = found ? db.find('subjects', found.subjectId) : null
    const courseLessons = found
      ? db.all('lessons').filter((item) => item.subjectId === found.subjectId).sort((a, b) => (a.order || 0) - (b.order || 0))
      : []
    setLesson(found)
    setSubject(foundSubject)
    setLessons(courseLessons)
    setResources(found ? db.all('resources').filter((resource) => found.resourceIds?.includes(resource.id) || resource.lessonId === found.id) : [])
    if (found) setProgress(commerceService.progressForCourse(user.id, found.subjectId))
  }

  useEffect(() => { load() }, [id, user.id])

  const completed = useMemo(() => (
    !!progress?.completed?.some((item) => item.lessonId === id && item.completed)
  ), [progress, id])

  const navigation = useMemo(() => {
    const index = lessons.findIndex((item) => item.id === id)
    return {
      previous: index > 0 ? lessons[index - 1] : null,
      next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null
    }
  }, [id, lessons])

  const markComplete = () => {
    try {
      commerceService.markLessonComplete(user.id, id)
      toast.success('تم حفظ تقدمك في الدرس')
      load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const download = (resourceId) => {
    commerceService.recordResourceDownload(resourceId)
    toast.success('تم تسجيل تحميل المورد')
    load()
  }

  if (!lesson) return <EmptyState icon={PlayCircle} title="الدرس غير موجود" />
  if (!user.subjectIds?.includes(lesson.subjectId)) {
    return (
      <EmptyState
        icon={PlayCircle}
        title="هذا الدرس غير متاح بعد"
        description="اشترك في الكورس أولاً لفتح الدروس والموارد."
        action={<Link to="/student/courses" className="btn-primary">استكشاف الكورسات</Link>}
      />
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to={`/student/subjects/${lesson.subjectId}`} className="btn-outline">
            <ArrowLeft size={16} /> العودة للكورس
          </Link>
          {completed ? (
            <span className="chip border-emerald-100 bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={14} /> مكتمل
            </span>
          ) : (
            <Button icon={CheckCircle2} onClick={markComplete}>تحديد كمكتمل</Button>
          )}
        </div>

        <Card className="!p-0 overflow-hidden">
          <div className="aspect-video bg-slate-950 text-white">
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                  <PlayCircle className="text-brand-200" size={42} />
                </div>
                <p className="text-2xl font-extrabold">{lesson.title}</p>
                <p className="mt-2 text-sm text-slate-300">{lesson.duration} دقيقة · {subject?.name}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-ink-100 p-5">
            <ProgressBar value={progress?.percentage || 0} />
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader title="محتوى الدرس" subtitle={lesson.summary} />
            <p className="text-sm leading-8 text-ink-600">{lesson.content}</p>
          </Card>

          <Card>
            <CardHeader title="ملاحظاتي" subtitle="مساحة كتابة شخصية أثناء المشاهدة" />
            <label className="sr-only" htmlFor="lesson-notes">ملاحظاتي</label>
            <textarea
              id="lesson-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="input min-h-[180px] resize-y leading-7"
              placeholder="اكتب ملاحظاتك هنا..."
            />
          </Card>
        </div>

        <Card>
          <CardHeader title="الموارد القابلة للتحميل" />
          {resources.length === 0 ? (
            <EmptyState icon={FileText} title="لا توجد موارد" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  download={`${resource.title}.txt`}
                  onClick={() => download(resource.id)}
                  className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition-colors hover:border-brand-200 hover:bg-brand-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
                    <Download size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-ink-900">{resource.title}</p>
                    <p className="text-xs text-ink-500">{resource.size} · {resource.downloads || 0} تحميل</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </Card>

        <div className="grid gap-3 md:grid-cols-2">
          {navigation.previous ? (
            <Link to={`/student/lessons/${navigation.previous.id}`} className="btn-outline justify-start">
              <ArrowRight size={16} />
              الدرس السابق
            </Link>
          ) : <span />}
          {navigation.next ? (
            <Link to={`/student/lessons/${navigation.next.id}`} className="btn-primary justify-center md:justify-self-end">
              الدرس التالي
              <ArrowLeft size={16} />
            </Link>
          ) : (
            <Link to={`/student/subjects/${lesson.subjectId}`} className="btn-primary justify-center md:justify-self-end">
              إنهاء ومراجعة الكورس
              <CheckCircle2 size={16} />
            </Link>
          )}
        </div>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <Card>
          <CardHeader title="منهج الكورس" subtitle={`${progress?.completedCount || 0}/${progress?.totalLessons || lessons.length} دروس مكتملة`} />
          <div className="space-y-2">
            {lessons.map((item, index) => {
              const done = progress?.completed?.some((entry) => entry.lessonId === item.id && entry.completed)
              const active = item.id === lesson.id
              return (
                <Link
                  key={item.id}
                  to={`/student/lessons/${item.id}`}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    active ? 'border-brand-200 bg-brand-50' : 'border-ink-200 bg-white hover:border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold ${
                    done ? 'bg-emerald-50 text-emerald-700' : active ? 'bg-brand-600 text-white' : 'bg-ink-50 text-ink-600'
                  }`}>
                    {done ? <CheckCircle2 size={17} /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-ink-900">{item.title}</span>
                    <span className="text-xs text-ink-500">{item.duration} دقيقة</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="ملخص سريع" />
          <div className="space-y-3 text-sm">
            <InfoRow label="الكورس" value={subject?.name} />
            <InfoRow label="مدة الدرس" value={`${lesson.duration} دقيقة`} />
            <InfoRow label="حالة الدرس" value={completed ? 'مكتمل' : 'قيد التعلم'} />
          </div>
          <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-3 text-xs leading-6 text-ink-500">
            <NotebookPen className="mb-2 text-brand-600" size={16} />
            استخدم الملاحظات أثناء المشاهدة، ثم حمّل الموارد قبل الانتقال للدرس التالي.
          </div>
        </Card>
      </aside>
    </div>
  )
}

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-3 py-2">
    <span className="font-bold text-ink-500">{label}</span>
    <span className="truncate font-extrabold text-ink-900">{value}</span>
  </div>
)
