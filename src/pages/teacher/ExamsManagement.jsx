import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { examService } from '../../services/examService.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { db } from '../../db/database.js'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import {
  ClipboardList,
  Edit2,
  Eye,
  FileText,
  Plus,
  Trash2,
  X
} from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const emptyQuestion = () => ({
  text: '',
  choices: ['', '', '', ''],
  correctIndex: 0,
  points: 5
})

const questionCount = (exam) => (exam.questionIds || []).length

const toDateInput = (value) => {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10)
  return date.toISOString().slice(0, 10)
}

const fromDateInput = (value) => new Date(`${value}T12:00:00`).toISOString()

const statusOptions = [
  { value: 'true', label: 'منشور' },
  { value: 'false', label: 'مسودة' }
]

export default function TeacherExams() {
  const { user } = useAuth()
  const toast = useToast()

  const [exams, setExams] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)
  const [viewing, setViewing] = useState(null)

  const load = async () => {
    setLoading(true)
    const instructorId = singleInstructorService.getInstructorId()

    const ownedSubjects = db
      .all('subjects')
      .filter(
        (subject) =>
          subject.instructorId === instructorId ||
          subject.published !== false
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'))

    const list = await examService.listForTeacher(instructorId)

    setSubjects(ownedSubjects)
    setExams(
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user.id])

  const submittedAttempts = useMemo(() => {
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
    if (!submittedAttempts.length) return 0

    return Math.round(
      submittedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
        submittedAttempts.length
    )
  }, [submittedAttempts])

  const openAdd = () => {
    setEditing(null)

    setForm({
      title: '',
      description: '',
      subjectId: subjects[0]?.id || '',
      duration: 30,
      published: true,
      availableFrom: toDateInput(new Date()),
      availableTo: toDateInput(Date.now() + 14 * 86400000),
      questions: [emptyQuestion()]
    })

    setOpen(true)
  }

  const openEdit = async (exam) => {
    const full = await examService.getWithQuestions(exam.id)

    if (!full) {
      toast.error('تعذر تحميل بيانات الاختبار')
      return
    }

    setEditing(exam)

    setForm({
      title: full.title || '',
      description: full.description || '',
      subjectId: full.subjectId || subjects[0]?.id || '',
      duration: full.duration || 30,
      published: full.published ?? true,
      availableFrom: toDateInput(full.availableFrom),
      availableTo: toDateInput(full.availableTo),
      questions: full.questions.length
        ? full.questions.map((question) => ({
            text: question.text || '',
            choices: [...(question.choices || ['', '', '', ''])].slice(0, 4),
            correctIndex: question.correctIndex || 0,
            points: question.points || 5
          }))
        : [emptyQuestion()]
    })

    setOpen(true)
  }

  const addQuestion = () => {
    setForm((current) => ({
      ...current,
      questions: [...current.questions, emptyQuestion()]
    }))
  }

  const removeQuestion = (index) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.filter(
        (_, questionIndex) => questionIndex !== index
      )
    }))
  }

  const updateQuestion = (index, patch) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question
      )
    }))
  }

  const updateChoice = (questionIndex, choiceIndex, value) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, currentChoiceIndex) =>
                currentChoiceIndex === choiceIndex ? value : choice
              )
            }
          : question
      )
    }))
  }

  const save = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.subjectId) {
      toast.error('أكمل عنوان الاختبار والكورس')
      return
    }

    if (!form.questions.length) {
      toast.error('أضف سؤالًا واحدًا على الأقل')
      return
    }

    const questions = form.questions.map((question) => ({
      ...question,
      text: question.text.trim(),
      choices: question.choices.map((choice) => choice.trim()),
      points: Number(question.points) || 5
    }))

    if (
      questions.some(
        (question) =>
          !question.text || question.choices.some((choice) => !choice)
      )
    ) {
      toast.error('أكمل نصوص الأسئلة وكل الاختيارات')
      return
    }

    const availableFrom = fromDateInput(form.availableFrom)
    const availableTo = fromDateInput(form.availableTo)

    if (new Date(availableTo) <= new Date(availableFrom)) {
      toast.error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      subjectId: form.subjectId,
      duration: Number(form.duration) || 30,
      published: form.published,
      availableFrom,
      availableTo,
      questions,
      teacherId: singleInstructorService.getInstructorId()
    }

    try {
      if (editing) {
        await examService.updateExam(editing.id, payload)
        toast.success('تم حفظ تعديلات الاختبار')
      } else {
        await examService.createExam(payload)
        toast.success('تم نشر الاختبار وإشعار الطلاب')
      }

      setOpen(false)
      load()
    } catch (error) {
      toast.error(error.message)
    }
  }

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

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <ClipboardList size={15} />
              إدارة الاختبارات
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              اختبارات الكورسات ومحاولات الطلاب
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              أنشئ اختبارات قصيرة، أضف الأسئلة والاختيارات، وانشرها لطلاب الكورس مباشرة.
            </p>
          </div>

          <Button icon={Plus} onClick={openAdd} disabled={!subjects.length}>
            اختبار جديد
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="الاختبارات"
          value={exams.length}
          icon="FileText"
          tone="blue"
          description="إجمالي الاختبارات."
        />

        <StatCard
          title="المنشورة"
          value={publishedCount}
          icon="CheckCircle2"
          tone="green"
          description="اختبارات متاحة للطلاب."
        />

        <StatCard
          title="المحاولات"
          value={submittedAttempts.length}
          icon="Activity"
          tone="orange"
          description="محاولات مسلّمة من الطلاب."
        />

        <StatCard
          title="متوسط النتائج"
          value={averageScore}
          suffix="%"
          icon="Trophy"
          tone="burgundy"
          description="متوسط أداء الطلاب."
        />
      </div>

      <SectionPanel
        title="قائمة الاختبارات"
        subtitle="راجع الاختبارات المنشورة والمسودات ومحاولات الطلاب."
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
                submittedAttempts.filter((attempt) => attempt.examId === row.id)
                  .length
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
                    className="!bg-[#2563EB] hover:!bg-blue-700"
                    aria-label="عرض المحاولات"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="!bg-[#0B6F7A] hover:!bg-[#075B78]"
                    aria-label="تعديل الاختبار"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="!bg-[#DC2626] hover:!bg-red-700"
                    aria-label="حذف الاختبار"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={loading ? [] : exams}
          empty={loading ? 'جاري تحميل الاختبارات...' : 'لم تنشر أي اختبار بعد'}
        />
      </SectionPanel>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'تعديل الاختبار' : 'إنشاء اختبار جديد'}
        size="xl"
      >
        {form && (
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="عنوان الاختبار"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                required
              />

              <Select
                label="الكورس"
                value={form.subjectId}
                onChange={(event) =>
                  setForm({ ...form, subjectId: event.target.value })
                }
                options={subjects.map((subject) => ({
                  value: subject.id,
                  label: subject.name
                }))}
                required
              />

              <Input
                label="المدة بالدقائق"
                type="number"
                min="5"
                value={form.duration}
                onChange={(event) =>
                  setForm({ ...form, duration: event.target.value })
                }
              />

              <Select
                label="الحالة"
                value={form.published ? 'true' : 'false'}
                onChange={(event) =>
                  setForm({
                    ...form,
                    published: event.target.value === 'true'
                  })
                }
                options={statusOptions}
              />

              <Input
                label="متاح من"
                type="date"
                value={form.availableFrom}
                onChange={(event) =>
                  setForm({ ...form, availableFrom: event.target.value })
                }
              />

              <Input
                label="متاح إلى"
                type="date"
                value={form.availableTo}
                onChange={(event) =>
                  setForm({ ...form, availableTo: event.target.value })
                }
              />

              <Textarea
                label="وصف مختصر"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="md:col-span-2"
              />
            </div>

            <div className="border-t border-[#DCEAF3] pt-5 dark:border-slate-700">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#0B2B3F] dark:text-slate-50">
                    الأسئلة
                  </h3>

                  <p className="mt-1 text-sm font-bold text-[#6B8293] dark:text-slate-400">
                    {form.questions.length} سؤال في هذا الاختبار
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  icon={Plus}
                  onClick={addQuestion}
                >
                  سؤال جديد
                </Button>
              </div>

              <div className="space-y-3">
                {form.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF] p-4 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B6F7A] text-sm font-black text-white shadow-sm">
                        {questionIndex + 1}
                      </span>

                      <Input
                        placeholder="نص السؤال"
                        value={question.text}
                        onChange={(event) =>
                          updateQuestion(questionIndex, {
                            text: event.target.value
                          })
                        }
                        className="flex-1"
                      />

                      <Input
                        type="number"
                        min="1"
                        placeholder="الدرجة"
                        value={question.points}
                        onChange={(event) =>
                          updateQuestion(questionIndex, {
                            points: event.target.value
                          })
                        }
                        className="md:w-28"
                      />

                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label="حذف السؤال"
                        disabled={form.questions.length === 1}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2 md:pr-12">
                      {question.choices.map((choice, choiceIndex) => {
                        const selected = question.correctIndex === choiceIndex

                        return (
                          <label
                            key={choiceIndex}
                            className={`flex items-center gap-2 rounded-2xl border p-3 transition-all ${
                              selected
                                ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-300/30 dark:bg-emerald-400/10'
                                : 'border-[#DCEAF3] bg-white hover:border-[#0B6F7A]/30 hover:bg-[#F7FBFF] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800'
                            }`}
                          >
                            <input
                              className="h-4 w-4 accent-[#0B6F7A]"
                              type="radio"
                              name={`question-${questionIndex}`}
                              checked={selected}
                              onChange={() =>
                                updateQuestion(questionIndex, {
                                  correctIndex: choiceIndex
                                })
                              }
                            />

                            <input
                              value={choice}
                              onChange={(event) =>
                                updateChoice(
                                  questionIndex,
                                  choiceIndex,
                                  event.target.value
                                )
                              }
                              placeholder={`الاختيار ${choiceIndex + 1}`}
                              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#0B2B3F] outline-none placeholder:text-[#6B8293] dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </Button>

              <Button type="submit">
                {editing ? 'حفظ التغييرات' : 'نشر الاختبار'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="محاولات الاختبار"
        size="lg"
      >
        {viewing && <AttemptsView exam={viewing} />}
      </Modal>
    </div>
  )
}

function AttemptsView({ exam }) {
  const [attempts, setAttempts] = useState(null)

  useEffect(() => {
    examService.listAttemptsForExam(exam.id).then((list) => {
      setAttempts(
        list
          .filter((attempt) => attempt.status === 'submitted')
          .map((attempt) => ({
            ...attempt,
            student: db.find('users', attempt.studentId)
          }))
      )
    })
  }, [exam.id])

  if (!attempts) return <div className="skeleton h-40" />

  if (!attempts.length) {
    return (
      <EmptyState
        icon={FileText}
        title="لا توجد محاولات"
        description="لا توجد محاولات مسلمة لهذا الاختبار بعد."
      />
    )
  }

  return (
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
  )
}
