import { useEffect, useMemo, useState } from 'react'
import { examService } from '../../services/examService.js'
import { db } from '../../db/database.js'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Eye, FileText, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const questionCount = (exam) => (exam.questionIds || []).length

export default function AdminExamsManagement() {
  const toast = useToast()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)

  const load = async () => {
    setLoading(true)
    const list = await examService.listAll()
    setExams(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const attempts = useMemo(() => {
    const examIds = new Set(exams.map((exam) => exam.id))
    return db.all('attempts').filter((attempt) => examIds.has(attempt.examId) && attempt.status === 'submitted')
  }, [exams])

  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
    : 0

  const remove = async (id) => {
    if (!confirm('سيتم حذف الاختبار وكل محاولاته. هل أنت متأكد؟')) return
    await examService.removeExam(id)
    toast.success('تم حذف الاختبار')
    load()
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="الاختبارات" value={exams.length} icon="FileText" tone="brand" />
        <StatCard title="المنشورة" value={exams.filter((exam) => exam.published).length} icon="CheckCircle2" tone="emerald" />
        <StatCard title="المحاولات" value={attempts.length} icon="Activity" tone="accent" />
        <StatCard title="متوسط النتائج" value={averageScore} suffix="%" icon="Trophy" tone="gold" />
      </div>

      <SectionPanel
        title="اختبارات المنصة"
        subtitle="نظرة إدارية على اختبارات الكورسات ومحاولات الطلاب في منصة المدرس الواحد."
      >
        <Table
          columns={[
            { key: 'title', title: 'العنوان', render: (row) => <span className="font-bold text-ink-900">{row.title}</span> },
            { key: 'subject', title: 'الكورس', render: (row) => db.find('subjects', row.subjectId)?.name || '-' },
            { key: 'questions', title: 'الأسئلة', render: (row) => questionCount(row) },
            { key: 'score', title: 'الدرجة', render: (row) => row.totalScore },
            { key: 'duration', title: 'المدة', render: (row) => `${row.duration} دقيقة` },
            { key: 'published', title: 'الحالة', render: (row) => row.published ? <Badge tone="success">منشور</Badge> : <Badge tone="warning">مسودة</Badge> },
            { key: 'attempts', title: 'المحاولات', render: (row) => attempts.filter((attempt) => attempt.examId === row.id).length },
            { key: 'date', title: 'التاريخ', render: (row) => formatDate(row.createdAt) },
            {
              key: 'actions',
              title: 'الإجراءات',
              render: (row) => (
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setViewing(row)} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100" aria-label="عرض التفاصيل"><Eye size={16} /></button>
                  <button type="button" onClick={() => remove(row.id)} className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50" aria-label="حذف الاختبار"><Trash2 size={16} /></button>
                </div>
              )
            }
          ]}
          data={loading ? [] : exams}
          empty={loading ? 'جاري تحميل الاختبارات...' : 'لا توجد اختبارات لعرضها'}
        />
      </SectionPanel>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="تفاصيل الاختبار والمحاولات" size="lg">
        {viewing && <ExamDetails exam={viewing} />}
      </Modal>
    </div>
  )
}

function ExamDetails({ exam }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    examService.getWithQuestions(exam.id).then(async (full) => {
      const list = await examService.listAttemptsForExam(exam.id)
      setState({
        full,
        attempts: list
          .filter((attempt) => attempt.status === 'submitted')
          .map((attempt) => ({ ...attempt, student: db.find('users', attempt.studentId) }))
      })
    })
  }, [exam.id])

  if (!state) return <div className="skeleton h-48" />

  const { full, attempts } = state
  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
    : 0

  return (
    <div className="space-y-5">
      <div className="grid gap-3 text-center md:grid-cols-4">
        <SummaryMetric label="الأسئلة" value={full?.questions.length || 0} />
        <SummaryMetric label="الدرجة" value={full?.totalScore || 0} />
        <SummaryMetric label="المحاولات" value={attempts.length} />
        <SummaryMetric label="متوسط النتائج" value={`${averageScore}%`} />
      </div>

      {attempts.length === 0 ? (
        <div className="py-8 text-center text-ink-500">
          <FileText className="mx-auto mb-2" />
          لا توجد محاولات مسلمة لهذا الاختبار بعد
        </div>
      ) : (
        <Table
          columns={[
            { key: 'student', title: 'الطالب', render: (row) => row.student?.name || '-' },
            { key: 'score', title: 'الدرجة', render: (row) => `${row.score}/${row.totalScore}` },
            { key: 'percentage', title: 'النسبة', render: (row) => <Badge tone={row.percentage >= 80 ? 'success' : row.percentage >= 50 ? 'warning' : 'danger'}>{row.percentage}%</Badge> },
            { key: 'submittedAt', title: 'تاريخ التسليم', render: (row) => formatDate(row.submittedAt) }
          ]}
          data={attempts}
        />
      )}
    </div>
  )
}

const SummaryMetric = ({ label, value }) => (
  <div className="rounded-xl border border-ink-200 bg-white p-3">
    <p className="text-xs text-ink-500">{label}</p>
    <p className="mt-1 text-xl font-bold text-ink-900">{value}</p>
  </div>
)
