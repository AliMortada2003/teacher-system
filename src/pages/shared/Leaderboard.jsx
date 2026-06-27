import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { leaderboardService } from '../../services/leaderboardService.js'
import { db } from '../../db/database.js'
import { Card } from '../../components/ui/Card.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Trophy } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export default function Leaderboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSubjects([{ value: '', label: 'كل الكورسات' }, ...db.all('subjects').map((subject) => ({ value: subject.id, label: subject.name }))])
  }, [])

  useEffect(() => {
    setLoading(true)
    leaderboardService.compute({ subjectId: subjectId || undefined }).then((result) => {
      setRows(result)
      setLoading(false)
    })
  }, [subjectId])

  const top3 = rows.slice(0, 3)
  const rest = rows.slice(3)
  const myRank = rows.find((row) => row.student.id === user?.id)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-ink-900">ترتيب المتصدرين</h2>
          <p className="text-sm text-ink-500">ترتيب من النتائج والحضور والمشاركة.</p>
        </div>
        <Select options={subjects} value={subjectId} onChange={(e) => setSubjectId(e.target.value)} />
      </div>

      {myRank && (
        <div className="card p-5 bg-brand-600 text-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 rounded-xl p-3"><Trophy size={22} /></div>
              <div>
                <p className="text-sm text-white/80">ترتيبك الحالي</p>
                <p className="text-2xl font-extrabold">#{myRank.rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-xs text-white/70">النقاط</p><p className="font-extrabold text-lg">{myRank.points}</p></div>
              <div><p className="text-xs text-white/70">الاختبارات</p><p className="font-extrabold text-lg">{myRank.avgExam}%</p></div>
              <div><p className="text-xs text-white/70">الحضور</p><p className="font-extrabold text-lg">{myRank.attendanceRate}%</p></div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="skeleton h-48" />
      ) : rows.length === 0 ? (
        <EmptyState icon={Trophy} title="لا توجد بيانات كافية" description="تظهر النتائج بعد وجود محاولات اختبارات أو سجلات حضور." />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {top3.map((row, index) => {
              const medal = leaderboardService.medal(row.rank)
              return (
                <motion.div
                  key={row.student.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="card p-6 text-center"
                >
                  <div
                    className="mx-auto w-20 h-20 rounded-full text-white flex items-center justify-center text-3xl font-extrabold shadow-soft"
                    style={{ backgroundColor: medal.color }}
                  >
                    {medal.icon}
                  </div>
                  <p className="text-xs text-ink-500 mt-3">المركز {row.rank}</p>
                  <p className="text-lg font-extrabold mt-1">{row.student.name}</p>
                  <p className="text-sm text-ink-500">{row.student.grade || '-'}</p>
                  <div className="flex justify-center gap-4 mt-4 text-sm">
                    <div><p className="text-xs text-ink-500">نقاط</p><p className="font-extrabold">{row.points}</p></div>
                    <div><p className="text-xs text-ink-500">اختبارات</p><p className="font-extrabold">{row.avgExam}%</p></div>
                    <div><p className="text-xs text-ink-500">حضور</p><p className="font-extrabold">{row.attendanceRate}%</p></div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {rest.length > 0 && (
            <Card className="!p-0">
              <div className="p-5 border-b border-ink-100"><h3 className="font-bold">باقي الترتيب</h3></div>
              <div>
                {rest.map((row, index) => (
                  <motion.div
                    key={row.student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex items-center gap-4 p-4 border-t border-ink-100 hover:bg-ink-50 transition ${row.student.id === user?.id ? 'bg-brand-50/60' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-ink-100 text-ink-700 font-bold flex items-center justify-center">{row.rank}</div>
                    <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center">
                      {row.student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{row.student.name}</p>
                      <p className="text-xs text-ink-500">{row.student.grade || '-'}</p>
                    </div>
                    <div className="hidden md:flex gap-4 text-sm">
                      <span className="chip bg-brand-50 text-brand-700">{row.avgExam}% اختبارات</span>
                      <span className="chip bg-emerald-50 text-emerald-700">{row.attendanceRate}% حضور</span>
                    </div>
                    <div className="font-extrabold text-lg text-brand-600 min-w-[60px] text-center">{row.points}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
