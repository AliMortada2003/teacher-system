import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { db } from '../../db/database.js'
import { commerceService } from '../../services/commerceService.js'
import { CourseCard } from '../../components/ui/CourseCard.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export default function MySubjects() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    const subs = db.all('subjects').filter((subject) => user.subjectIds?.includes(subject.id))
    const lessons = db.all('lessons')
    const exams = db.all('exams')
    const attempts = db.all('attempts').filter((attempt) => attempt.studentId === user.id)
    setSubjects(subs.map((subject) => {
      const myAttempts = attempts.filter((attempt) => attempt.subjectId === subject.id && attempt.status === 'submitted')
      const avg = myAttempts.length
        ? Math.round(myAttempts.reduce((acc, attempt) => acc + attempt.percentage, 0) / myAttempts.length)
        : 0
      const progress = commerceService.progressForCourse(user.id, subject.id)
      return {
        ...subject,
        lessonsCount: lessons.filter((lesson) => lesson.subjectId === subject.id).length,
        examsCount: exams.filter((exam) => exam.subjectId === subject.id).length,
        avg,
        progress: progress.percentage
      }
    }))
  }, [user.id, user.subjectIds])

  if (!subjects.length) {
    return (
      <EmptyState
        title="لا توجد كورسات"
        description="لم تشترك في أي كورس بعد."
        action={<Link to="/student/courses" className="btn-primary">استكشاف الكورسات</Link>}
      />
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <div key={subject.id} className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-soft">
          <CourseCard
            course={subject}
            to={`/student/subjects/${subject.id}`}
            lessonsCount={subject.lessonsCount}
            rating={subject.avg ? (subject.avg / 20).toFixed(1) : 4.8}
            action={
              <Link to={`/student/subjects/${subject.id}`} className="inline-flex items-center gap-2 text-base font-extrabold text-ink-900 transition-colors hover:text-brand-600">
                دخول
                <ArrowLeft size={16} />
              </Link>
            }
          />

          <div className="space-y-3 border-t border-ink-100 p-4">
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold">
                <span className="text-ink-500">تقدم الدروس</span>
                <span className="text-brand-600">{subject.progress}%</span>
              </div>
              <ProgressBar value={subject.progress} showLabel={false} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold">
                <span className="text-ink-500">متوسط الاختبارات</span>
                <span className="text-orange-600">{subject.avg}%</span>
              </div>
              <ProgressBar value={subject.avg} tone="warning" showLabel={false} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
