import { useEffect, useMemo, useState } from 'react'
import { Eye, FileText, Trash2, ClipboardList } from 'lucide-react'

import { examService } from '../../services/examService.js'
import { db } from '../../db/database.js'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate } from '../../utils/date.js'

const questionCount = (exam) => (exam.questionIds || []).length

export default function AdminExamsManagement() {
  const toast = useToast()

  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)

  const load = async () => {
    setLoading(true)

    try {
      const list = await examService.listAll()

      setExams(
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const attempts = useMemo(() => {
    const examIds = new Set(exams.map((exam) => exam.id))

    return db
      .all('attempts')
      .filter(
        (attempt) =>
          examIds.has(attempt.examId) && attempt.status === 'submitted'
      )
  }, [exams])

  const publishedCount = useMemo(() => {
    return exams.filter((exam) => exam.published).length
  }, [exams])

  const averageScore = useMemo(() => {
    if (!attempts.length) return 0

    return Math.round(
      attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
        attempts.length
    )
  }, [attempts])

  const remove = async (id) => {
    if (!confirm('سيتم حذف الاختبار وكل محاولاته. هل أنت متأكد؟')) return

    await examService.removeExam(id)

    toast.success('تم حذف الاختبار')
    load()
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
            <ClipboardList size={15} />
            إدارة الاختبارات
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              اختبارات المنصة ومحاولات الطلاب
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              تابع الاختبارات المنشورة والمسودات، عدد المحاولات، ومتوسط نتائج الطلاب من مكان واحد.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="الاختبارات"
          value={exams.length}
          icon="FileText"
          tone="blue"
          description="إجمالي الاختبارات المضافة داخل المنصة."
        />

        <StatCard
          title="المنشورة"
          value={publishedCount}
          icon="CheckCircle2"
          tone="green"
          description="اختبارات متاحة للطلاب ويمكنهم حلها."
        />

        <StatCard
          title="المحاولات"
          value={attempts.length}
          icon="Activity"
          tone="orange"
          description="عدد المحاولات المسلّمة من الطلاب."
        />

        <StatCard
          title="متوسط النتائج"
          value={averageScore}
          suffix="%"
          icon="Trophy"
          tone="burgundy"
          description="متوسط أداء الطلاب في الاختبارات."
        />
      </div>

      <SectionPanel
        title="اختبارات المنصة"
        subtitle="نظرة إدارية على اختبارات الكورسات ومحاولات الطلاب في منصة المدرس الواحد."
      >
        <Table
          columns={[
            {
              key: 'title',
              title: 'العنوان',
              render: (row) => (
                <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                  {row.title}
                </span>
              )
            },
            {
              key: 'subject',
              title: 'الكورس',
              render: (row) => db.find('subjects', row.subjectId)?.name || '-'
            },
            {
              key: 'questions',
              title: 'الأسئلة',
              render: (row) => (
                <span className="font-black text-[#0B6F7A] dark:text-cyan-300">
                  {questionCount(row)}
                </span>
              )
            },
            {
              key: 'score',
              title: 'الدرجة',
              render: (row) => row.totalScore
            },
            {
              key: 'duration',
              title: 'المدة',
              render: (row) => `${row.duration} دقيقة`
            },
            {
              key: 'published',
              title: 'الحالة',
              render: (row) =>
                row.published ? (
                  <Badge tone="success">منشور</Badge>
                ) : (
                  <Badge tone="warning">مسودة</Badge>
                )
            },
            {
              key: 'attempts',
              title: 'المحاولات',
              render: (row) =>
                attempts.filter((attempt) => attempt.examId === row.id).length
            },
            {
              key: 'date',
              title: 'التاريخ',
              render: (row) => formatDate(row.createdAt)
            },
            {
              key: 'actions',
              title: 'الإجراءات',
              render: (row) => (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewing(row)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#41596B] transition-colors hover:bg-[#E8F8FA] hover:text-[#0B6F7A] dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-300"
                    aria-label="عرض التفاصيل"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10"
                    aria-label="حذف الاختبار"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={loading ? [] : exams}
          empty={loading ? 'جاري تحميل الاختبارات...' : 'لا توجد اختبارات لعرضها'}
        />
      </SectionPanel>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="تفاصيل الاختبار والمحاولات"
        size="lg"
      >
        {viewing && <ExamDetails exam={viewing} />}
      </Modal>
    </div>
  )
}

function ExamDetails({ exam }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    let cancelled = false

    examService.getWithQuestions(exam.id).then(async (full) => {
      const list = await examService.listAttemptsForExam(exam.id)

      if (cancelled) return

      setState({
        full,
        attempts: list
          .filter((attempt) => attempt.status === 'submitted')
          .map((attempt) => ({
            ...attempt,
            student: db.find('users', attempt.studentId)
          }))
      })
    })

    return () => {
      cancelled = true
    }
  }, [exam.id])

  if (!state) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-20" />
        <div className="skeleton h-48" />
      </div>
    )
  }

  const { full, attempts } = state

  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
          attempts.length
      )
    : 0

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF] p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <h3 className="text-base font-black text-[#0B2B3F] dark:text-slate-50">
          {full?.title || exam.title}
        </h3>

        <p className="mt-2 text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
          ملخص سريع عن الاختبار وعدد الأسئلة والمحاولات ومتوسط النتائج.
        </p>
      </div>

      <div className="grid gap-3 text-center md:grid-cols-4">
        <SummaryMetric label="الأسئلة" value={full?.questions.length || 0} tone="blue" />
        <SummaryMetric label="الدرجة" value={full?.totalScore || 0} tone="green" />
        <SummaryMetric label="المحاولات" value={attempts.length} tone="orange" />
        <SummaryMetric label="متوسط النتائج" value={`${averageScore}%`} tone="burgundy" />
      </div>

      {attempts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="لا توجد محاولات"
          description="لا توجد محاولات مسلمة لهذا الاختبار بعد."
        />
      ) : (
        <Table
          columns={[
            {
              key: 'student',
              title: 'الطالب',
              render: (row) => row.student?.name || '-'
            },
            {
              key: 'score',
              title: 'الدرجة',
              render: (row) => `${row.score}/${row.totalScore}`
            },
            {
              key: 'percentage',
              title: 'النسبة',
              render: (row) => (
                <Badge
                  tone={
                    row.percentage >= 80
                      ? 'success'
                      : row.percentage >= 50
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {row.percentage}%
                </Badge>
              )
            },
            {
              key: 'submittedAt',
              title: 'تاريخ التسليم',
              render: (row) => formatDate(row.submittedAt)
            }
          ]}
          data={attempts}
        />
      )}
    </div>
  )
}

const SUMMARY_TONES = {
  blue: 'bg-[#2563EB]',
  green: 'bg-[#16A34A]',
  orange: 'bg-[#EA580C]',
  burgundy: 'bg-[#9F1239]'
}

const SummaryMetric = ({ label, value, tone = 'blue' }) => (
  <div className="relative overflow-hidden rounded-2xl border border-[#DCEAF3] bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${
        SUMMARY_TONES[tone] || SUMMARY_TONES.blue
      }`}
    />

    <p className="text-xs font-black text-[#6B8293] dark:text-slate-400">
      {label}
    </p>

    <p className="mt-2 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
      {value}
    </p>
  </div>
)