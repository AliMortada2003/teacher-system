import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { examService } from '../../services/examService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Send } from 'lucide-react'
import { formatTimeLeft } from '../../utils/date.js'

const LETTERS = ['أ', 'ب', 'ج', 'د']

export default function ExamPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [exam, setExam] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(true)
  const submittingRef = useRef(false)

  useEffect(() => {
    const run = async () => {
      try {
        const data = await examService.getWithQuestions(id)
        if (!data) throw new Error('الاختبار غير موجود')
        const startedAttempt = await examService.startAttempt(id, user.id)
        const startedAt = new Date(startedAttempt.startedAt).getTime()
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        const left = Math.max(0, data.duration * 60 - elapsed)
        setExam(data)
        setAttempt(startedAttempt)
        setAnswers(startedAttempt.answers || {})
        setTimeLeft(left)
      } catch (error) {
        toast.error(error.message)
        nav('/student/exams')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  useEffect(() => {
    if (!exam || submitted) return undefined
    if (timeLeft <= 0 && !submittingRef.current) {
      handleSubmit(true)
      return undefined
    }
    const intervalId = setInterval(() => setTimeLeft((value) => value - 1), 1000)
    return () => clearInterval(intervalId)
  }, [timeLeft, exam, submitted])

  const question = exam?.questions?.[current]
  const answeredCount = useMemo(
    () => exam?.questions?.filter((item) => answers[item.id] !== undefined).length || 0,
    [answers, exam]
  )
  const progressPct = exam ? Math.round((answeredCount / exam.questions.length) * 100) : 0

  const selectAnswer = (questionId, index) => {
    const next = { ...answers, [questionId]: index }
    setAnswers(next)
    examService.saveAnswer(attempt.id, questionId, index)
  }

  const handleSubmit = async (auto = false) => {
    if (submittingRef.current) return
    submittingRef.current = true
    try {
      const result = await examService.submitAttempt(attempt.id, answers)
      setSubmitted(result)
      if (auto) toast.warning('انتهى الوقت - تم التسليم تلقائيا')
      else toast.success('تم تسليم الاختبار')
    } catch (error) {
      toast.error(error.message)
      submittingRef.current = false
    }
  }

  if (loading || !exam) {
    return <div className="skeleton h-96" />
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">تم تسليم الاختبار</h1>
          <p className="mt-2 text-ink-500">{exam.title}</p>
          <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5">
            <p className="text-sm text-ink-500">درجتك النهائية</p>
            <p className="mt-2 text-4xl font-bold text-brand-600">
              {submitted.score}<span className="text-xl text-ink-400">/{submitted.totalScore}</span>
            </p>
            <p className="mt-2 text-base font-bold text-accent-600">{submitted.percentage}%</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => nav('/student/results')}>عرض النتائج</Button>
            <Button onClick={() => nav('/student/exams')}>العودة للاختبارات</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-ink-900">{exam.title}</h1>
            <p className="mt-1 text-xs text-ink-500">سؤال {current + 1} من {exam.questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${
            timeLeft < 60 ? 'border-red-100 bg-red-50 text-red-700' : 'border-brand-100 bg-brand-50 text-brand-700'
          }`}>
            <Clock size={17} />
            <span className="tabular-nums">{formatTimeLeft(timeLeft)}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-semibold">
            <span className="text-ink-500">إجاباتك</span>
            <span className="text-brand-600">{answeredCount}/{exam.questions.length}</span>
          </div>
          <ProgressBar value={progressPct} showLabel={false} />
        </div>
      </section>

      <Card className="p-5">
        <p className="chip mb-4 border-brand-100 bg-brand-50 text-brand-700">سؤال {current + 1} - {question.points} درجة</p>
        <p className="text-lg font-bold leading-8 text-ink-900">{question.text}</p>
        <div className="mt-5 grid gap-3">
          {question.choices.map((choice, index) => {
            const selected = answers[question.id] === index
            return (
              <button
                key={index}
                onClick={() => selectAnswer(question.id, index)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-right transition-colors ${
                  selected
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300'
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  selected ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
                }`}>
                  {LETTERS[index]}
                </span>
                <span className="min-w-0">{choice}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} icon={ChevronRight}>
          السابق
        </Button>
        <div className="flex max-w-md flex-wrap justify-center gap-1.5">
          {exam.questions.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrent(index)}
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                index === current ? 'bg-brand-600 text-white' :
                answers[item.id] !== undefined ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-100 text-ink-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {current < exam.questions.length - 1 ? (
          <Button onClick={() => setCurrent((value) => value + 1)} icon={ChevronLeft}>
            التالي
          </Button>
        ) : (
          <Button onClick={() => handleSubmit(false)} icon={Send}>تسليم</Button>
        )}
      </div>
    </div>
  )
}
