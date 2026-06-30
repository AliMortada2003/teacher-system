import { useEffect, useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'

import { db } from '../../db/database.js'
import { commerceService } from '../../services/commerceService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export default function TeacherStudentsManagement() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')

  const load = () => {
    const students = db.all('users').filter((user) => user.role === 'student')
    const attempts = db.all('attempts').filter((attempt) => attempt.status === 'submitted')
    const orders = db.all('orders')

    setRows(
      students.map((student) => {
        const studentAttempts = attempts.filter((attempt) => attempt.studentId === student.id)
        const avg = studentAttempts.length ? Math.round(studentAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / studentAttempts.length) : 0
        const progressValues = (student.subjectIds || []).map((subjectId) => commerceService.progressForCourse(student.id, subjectId).percentage)
        const progress = progressValues.length ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length) : 0

        return {
          ...student,
          courses: student.subjectIds?.length || 0,
          orders: orders.filter((order) => order.studentId === student.id).length,
          avg,
          progress
        }
      })
    )
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return rows

    return rows.filter((row) => row.name?.toLowerCase().includes(query) || row.email?.toLowerCase().includes(query) || row.phone?.toLowerCase().includes(query))
  }, [rows, search])

  const stats = useMemo(() => {
    const enrolled = rows.filter((row) => row.courses > 0).length
    const totalOrders = rows.reduce((sum, row) => sum + Number(row.orders || 0), 0)
    const avgProgress = rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row.progress || 0), 0) / rows.length) : 0
    const avgExams = rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row.avg || 0), 0) / rows.length) : 0

    return { total: rows.length, enrolled, totalOrders, avgProgress, avgExams }
  }, [rows])

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Users size={15} />
              إدارة الطلاب
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              طلاب الكورسات ومتابعة الأداء
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              تابع الطلاب المشتركين، عدد كورساتهم، الطلبات، التقدم، ومتوسط نتائج الاختبارات.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[#6B8293] dark:text-slate-400" size={16} />
            <Input className="w-full [&_input]:pr-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن طالب..." />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="الطلاب" value={stats.total} icon="Users" tone="blue" description="إجمالي الطلاب." />
        <StatCard title="مشتركين بكورسات" value={stats.enrolled} icon="BookMarked" tone="green" description="طلاب لديهم كورسات." />
        <StatCard title="الطلبات" value={stats.totalOrders} icon="Receipt" tone="orange" description="إجمالي طلبات الطلاب." />
        <StatCard title="متوسط التقدم" value={stats.avgProgress} suffix="%" icon="Activity" tone="burgundy" description="متوسط تقدم الطلاب." />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader title="قائمة الطلاب" subtitle={`${filtered.length} طالب مطابق للبحث`} />
        </div>

        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Users} title="لا يوجد طلاب" description="لا توجد نتائج مطابقة للبحث الحالي." />
          </div>
        ) : (
          <Table
            columns={[
              {
                key: 'name',
                title: 'الطالب',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0B6F7A] text-xs font-black text-white">
                      {row.name?.charAt(0) || 'ط'}
                    </div>
                    <span className="font-black text-[#0B2B3F] dark:text-slate-50">{row.name}</span>
                  </div>
                )
              },
              { key: 'email', title: 'البريد' },
              { key: 'courses', title: 'الكورسات', render: (row) => <Badge tone="brand">{row.courses}</Badge> },
              { key: 'orders', title: 'الطلبات', render: (row) => <span className="font-black text-[#0B6F7A] dark:text-cyan-300">{row.orders}</span> },
              { key: 'progress', title: 'التقدم', render: (row) => <Badge tone={row.progress >= 70 ? 'success' : row.progress >= 40 ? 'warning' : 'default'}>{row.progress}%</Badge> },
              { key: 'avg', title: 'متوسط الاختبارات', render: (row) => <Badge tone={row.avg >= 70 ? 'success' : row.avg >= 50 ? 'warning' : 'default'}>{row.avg}%</Badge> },
              { key: 'phone', title: 'الهاتف', render: (row) => row.phone || '-' }
            ]}
            data={filtered}
            empty="لا يوجد طلاب"
          />
        )}
      </Card>
    </div>
  )
}