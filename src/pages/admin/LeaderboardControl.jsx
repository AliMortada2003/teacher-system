import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { leaderboardService } from '../../services/leaderboardService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Save, RefreshCcw } from 'lucide-react'

export default function LeaderboardControl() {
  const toast = useToast()
  const [weights, setWeights] = useState({ exams: 0.6, attendance: 0.25, participation: 0.15 })
  const [rows, setRows] = useState([])

  const load = () => leaderboardService.compute().then(setRows)

  useEffect(() => {
    const s = db.raw().settings?.leaderboardWeights
    if (s) setWeights(s)
    load()
  }, [])

  const save = () => {
    const sum = (+weights.exams) + (+weights.attendance) + (+weights.participation)
    if (Math.abs(sum - 1) > 0.01) return toast.error('مجموع الأوزان يجب أن يساوي 1')
    db.setting('leaderboardWeights', {
      exams: +weights.exams, attendance: +weights.attendance, participation: +weights.participation
    })
    toast.success('تم حفظ الأوزان')
    load()
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="أوزان حساب الترتيب" subtitle="تعديل أوزان العناصر الداخلة في حساب نقاط الطالب" />
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="وزن الاختبارات" type="number" step="0.05" min="0" max="1" value={weights.exams} onChange={(e) => setWeights({ ...weights, exams: e.target.value })} />
          <Input label="وزن الحضور" type="number" step="0.05" min="0" max="1" value={weights.attendance} onChange={(e) => setWeights({ ...weights, attendance: e.target.value })} />
          <Input label="وزن المشاركة" type="number" step="0.05" min="0" max="1" value={weights.participation} onChange={(e) => setWeights({ ...weights, participation: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" icon={RefreshCcw} onClick={load}>تحديث الترتيب</Button>
          <Button icon={Save} onClick={save}>حفظ الأوزان</Button>
        </div>
      </Card>

      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100"><CardHeader title="الترتيب الحالي" /></div>
        <Table
          columns={[
            { key: 'rank', title: '#', render: (r) => <span className="font-extrabold text-brand-600">#{r.rank}</span> },
            { key: 'name', title: 'الطالب', render: (r) => r.student.name },
            { key: 'avgExam', title: 'الاختبارات', render: (r) => <Badge tone="brand">{r.avgExam}%</Badge> },
            { key: 'att', title: 'الحضور', render: (r) => <Badge tone="success">{r.attendanceRate}%</Badge> },
            { key: 'part', title: 'المشاركة', render: (r) => <Badge tone="warning">{r.participation}%</Badge> },
            { key: 'points', title: 'النقاط', render: (r) => <span className="font-extrabold">{r.points}</span> }
          ]}
          data={rows}
          empty="لا توجد بيانات كافية"
        />
      </Card>
    </div>
  )
}
