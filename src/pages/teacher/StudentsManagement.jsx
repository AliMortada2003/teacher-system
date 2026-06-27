import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { commerceService } from '../../services/commerceService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Search } from 'lucide-react'

export default function TeacherStudentsManagement() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')

  const load = () => {
    const students = db.all('users').filter((user) => user.role === 'student')
    const attempts = db.all('attempts').filter((attempt) => attempt.status === 'submitted')
    const orders = db.all('orders')
    setRows(students.map((student) => {
      const studentAttempts = attempts.filter((attempt) => attempt.studentId === student.id)
      const avg = studentAttempts.length
        ? Math.round(studentAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / studentAttempts.length)
        : 0
      const progressValues = (student.subjectIds || []).map((subjectId) => commerceService.progressForCourse(student.id, subjectId).percentage)
      const progress = progressValues.length
        ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
        : 0
      return {
        ...student,
        courses: student.subjectIds?.length || 0,
        orders: orders.filter((order) => order.studentId === student.id).length,
        avg,
        progress
      }
    }))
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter((row) =>
    !search ||
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="!p-0">
      <div className="p-5 border-b border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        <CardHeader title="الطلاب" subtitle={`${filtered.length} طالب`} />
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-400" size={16} />
          <Input className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن طالب..." />
        </div>
      </div>
      <Table
        columns={[
          { key: 'name', title: 'الطالب', render: (row) => <span className="font-bold">{row.name}</span> },
          { key: 'email', title: 'البريد' },
          { key: 'courses', title: 'الكورسات', render: (row) => <Badge tone="brand">{row.courses}</Badge> },
          { key: 'orders', title: 'الطلبات', render: (row) => row.orders },
          { key: 'progress', title: 'التقدم', render: (row) => `${row.progress}%` },
          { key: 'avg', title: 'متوسط الاختبارات', render: (row) => <Badge tone={row.avg >= 70 ? 'success' : row.avg >= 50 ? 'warning' : 'default'}>{row.avg}%</Badge> },
          { key: 'phone', title: 'الهاتف', render: (row) => row.phone || '-' }
        ]}
        data={filtered}
        empty="لا يوجد طلاب"
      />
    </Card>
  )
}
