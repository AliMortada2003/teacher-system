import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { examService } from '../../services/examService.js'
import { db } from '../../db/database.js'
import { Card } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { SubjectIcon } from '../../components/ui/SubjectIcon.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { FileText, Clock, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'
import { motion } from 'framer-motion'

export default function StudentExams() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    examService.listForStudent(user.id).then((list) => {
      setExams(list.map((e) => ({
        ...e,
        subject: db.find('subjects', e.subjectId)
      })))
    })
  }, [user.id])

  const filtered = exams.filter((e) => {
    if (filter === 'pending') return !e.attempt
    if (filter === 'done') return !!e.attempt
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[
          { k: 'all', l: 'الكل' },
          { k: 'pending', l: 'قادمة' },
          { k: 'done', l: 'مكتملة' }
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              filter === t.k ? 'bg-brand-600 text-white shadow-soft' : 'bg-white border border-ink-100 text-ink-600 hover:border-brand-300'
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="لا توجد اختبارات" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <SubjectIcon subject={e.subject} />
                  {e.attempt ? (
                    <Badge tone="success"><CheckCircle2 size={12} /> مكتمل</Badge>
                  ) : (
                    <Badge tone="warning">قيد الانتظار</Badge>
                  )}
                </div>
                <h3 className="font-extrabold text-ink-900 mt-4">{e.title}</h3>
                <p className="text-xs text-ink-500 mt-1">{e.subject?.name}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="chip bg-ink-100 text-ink-600"><Clock size={12} /> {e.duration} د</span>
                  <span className="chip bg-ink-100 text-ink-600">{e.totalScore} درجة</span>
                  <span className="chip bg-ink-100 text-ink-600"><Calendar size={12} /> {formatDate(e.availableTo)}</span>
                </div>
                {e.attempt ? (
                  <div className="mt-4 bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-emerald-700">درجتك</p>
                    <p className="text-2xl font-extrabold text-emerald-700">
                      {e.attempt.score}/{e.attempt.totalScore}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">{e.attempt.percentage}%</p>
                  </div>
                ) : (
                  <Link to={`/student/exams/${e.id}`} className="btn-primary w-full mt-4 justify-center">
                    بدء الاختبار <ArrowLeft size={16} />
                  </Link>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
