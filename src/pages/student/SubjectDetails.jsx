import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../../db/database.js'
import { SubjectIcon } from '../../components/ui/SubjectIcon.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { BookOpen, FileText, Megaphone, Clock, ArrowLeft, CheckCircle2, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { commerceService } from '../../services/commerceService.js'
import { relativeTime } from '../../utils/date.js'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'

export default function SubjectDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [state, setState] = useState(null)

  useEffect(() => {
    const subject = db.find('subjects', id)
    const lessons = db.all('lessons').filter((lesson) => lesson.subjectId === id).sort((a, b) => a.order - b.order)
    const exams = db.all('exams').filter((exam) => exam.subjectId === id && exam.published)
    const attempts = db.all('attempts').filter((attempt) => attempt.studentId === user.id && attempt.subjectId === id)
    const announcements = db.all('announcements').filter((announcement) => announcement.subjectId === id)
    const resources = db.all('resources').filter((resource) => resource.subjectId === id)
    const progress = commerceService.progressForCourse(user.id, id)
    setState({ subject, lessons, exams, attempts, announcements, resources, progress })
  }, [id, user.id])

  const enrolled = useMemo(() => user.subjectIds?.includes(id), [user.subjectIds, id])

  if (!state) return <div className="skeleton h-96" />
  const { subject, lessons, exams, attempts, announcements, resources, progress } = state
  if (!subject) return <EmptyState title="الكورس غير موجود" />

  if (!enrolled) {
    return (
      <EmptyState
        icon={BookOpen}
        title="لم تشترك في هذا الكورس بعد"
        description="يمكنك شراء الكورس من صفحة الاستكشاف ثم العودة للدروس."
        action={<Link to="/student/courses" className="btn-primary">استكشاف الكورسات</Link>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <SubjectIcon subject={subject} size={32} className="!p-4" />
            <div>
              <h1 className="text-3xl font-extrabold text-ink-900">{subject.name}</h1>
              <p className="text-ink-500 mt-1 leading-7">{subject.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge tone="brand">{lessons.length} درس</Badge>
                <Badge tone="warning">{exams.length} اختبار</Badge>
                <Badge tone="success">{progress.percentage}% مكتمل</Badge>
              </div>
            </div>
          </div>
          <div className="min-w-[220px]">
            <ProgressBar value={progress.percentage} />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader title="الدروس" subtitle={`${progress.completedCount}/${progress.totalLessons} مكتمل`} />
          {lessons.length === 0 ? (
            <EmptyState icon={BookOpen} title="لا توجد دروس" />
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const done = progress.completed.some((item) => item.lessonId === lesson.id && item.completed)
                return (
                  <Link
                    key={lesson.id}
                    to={`/student/lessons/${lesson.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-brand-100 hover:bg-brand-50 transition"
                  >
                    <div className={`rounded-xl w-11 h-11 flex items-center justify-center font-bold ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'}`}>
                      {done ? <CheckCircle2 size={19} /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink-900">{lesson.title}</p>
                      <p className="text-sm text-ink-500 truncate">{lesson.summary}</p>
                    </div>
                    <span className="chip bg-ink-100 text-ink-600"><Clock size={12} /> {lesson.duration} د</span>
                  </Link>
                )
              })}
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="الاختبارات" />
            {exams.length === 0 ? (
              <EmptyState icon={FileText} title="لا توجد اختبارات" />
            ) : (
              <div className="space-y-2">
                {exams.map((exam) => {
                  const attempt = attempts.find((item) => item.examId === exam.id)
                  return (
                    <div key={exam.id} className="rounded-xl border border-ink-100 p-4">
                      <p className="font-bold text-sm">{exam.title}</p>
                      <p className="text-xs text-ink-500 mt-1">{exam.duration} دقيقة · {exam.totalScore} درجة</p>
                      {attempt ? (
                        <p className="mt-2 chip bg-emerald-50 text-emerald-700">مكتمل: {attempt.percentage}%</p>
                      ) : (
                        <Link to={`/student/exams/${exam.id}`} className="btn-primary w-full mt-3 !py-2 !text-xs justify-center">
                          بدء الاختبار <ArrowLeft size={14} />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="موارد الكورس" />
            {resources.length === 0 ? (
              <EmptyState icon={Download} title="لا توجد موارد" />
            ) : (
              <div className="space-y-2">
                {resources.slice(0, 5).map((resource) => (
                  <a key={resource.id} href={resource.url} download={`${resource.title}.txt`} className="flex items-center gap-2 rounded-xl bg-ink-50 p-3 text-sm font-bold text-ink-700 hover:bg-brand-50">
                    <Download size={15} className="text-brand-600" /> {resource.title}
                  </a>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="الإعلانات" />
            {announcements.length === 0 ? (
              <EmptyState icon={Megaphone} title="لا توجد إعلانات" />
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 rounded-xl bg-ink-50">
                    <p className="font-bold text-sm">{announcement.title}</p>
                    <p className="text-xs text-ink-500 mt-1 leading-5">{announcement.body}</p>
                    <p className="text-[10px] text-ink-400 mt-2">{relativeTime(announcement.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
