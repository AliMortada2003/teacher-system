import { useEffect, useMemo, useState } from 'react'
import { Award, RefreshCcw, Save, Settings2 } from 'lucide-react'

import { db } from '../../db/database.js'
import { leaderboardService } from '../../services/leaderboardService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'

const toNumber = (value) => Number(value) || 0

const formatPercent = (value) => `${Math.round(toNumber(value) * 100)}%`

export default function LeaderboardControl() {
  const toast = useToast()

  const [weights, setWeights] = useState({
    exams: 0.6,
    attendance: 0.25,
    participation: 0.15
  })

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)

    try {
      const result = await leaderboardService.compute()
      setRows(result)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedWeights = db.raw().settings?.leaderboardWeights

    if (savedWeights) {
      setWeights(savedWeights)
    }

    load()
  }, [])

  const totalWeight = useMemo(() => {
    return (
      toNumber(weights.exams) +
      toNumber(weights.attendance) +
      toNumber(weights.participation)
    )
  }, [weights])

  const isValidWeights = Math.abs(totalWeight - 1) <= 0.01

  const leaderboardStats = useMemo(() => {
    const totalStudents = rows.length

    const topStudent = rows[0]
    const highestPoints = topStudent?.points || 0

    const averagePoints = totalStudents
      ? Math.round(
          rows.reduce((sum, row) => sum + toNumber(row.points), 0) /
            totalStudents
        )
      : 0

    const averageExam = totalStudents
      ? Math.round(
          rows.reduce((sum, row) => sum + toNumber(row.avgExam), 0) /
            totalStudents
        )
      : 0

    return {
      totalStudents,
      topStudentName: topStudent?.student?.name || 'لا يوجد',
      highestPoints,
      averagePoints,
      averageExam
    }
  }, [rows])

  const updateWeight = (key, value) => {
    setWeights((current) => ({
      ...current,
      [key]: value
    }))
  }

  const save = () => {
    if (!isValidWeights) {
      toast.error('مجموع الأوزان يجب أن يساوي 1')
      return
    }

    db.setting('leaderboardWeights', {
      exams: toNumber(weights.exams),
      attendance: toNumber(weights.attendance),
      participation: toNumber(weights.participation)
    })

    toast.success('تم حفظ الأوزان')
    load()
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
            <Award size={15} />
            لوحة المتصدرين
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              التحكم في ترتيب الطلاب ونقاط التميز
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
              عدّل أوزان الاختبارات والحضور والمشاركة، وتابع الترتيب الحالي للطلاب حسب النقاط المحسوبة.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="عدد الطلاب"
          value={leaderboardStats.totalStudents}
          icon="Users"
          tone="blue"
          description="إجمالي الطلاب الموجودين في الترتيب الحالي."
        />

        <StatCard
          title="أعلى نقاط"
          value={leaderboardStats.highestPoints}
          icon="Trophy"
          tone="green"
          description={`المتصدر الحالي: ${leaderboardStats.topStudentName}`}
        />

        <StatCard
          title="متوسط النقاط"
          value={leaderboardStats.averagePoints}
          icon="Activity"
          tone="orange"
          description="متوسط نقاط الطلاب داخل لوحة المتصدرين."
        />

        <StatCard
          title="متوسط الاختبارات"
          value={leaderboardStats.averageExam}
          suffix="%"
          icon="FileText"
          tone="burgundy"
          description="متوسط أداء الطلاب في الاختبارات."
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <CardHeader
          title="أوزان حساب الترتيب"
          subtitle="مجموع الأوزان يجب أن يساوي 1 حتى يتم حساب النقاط بشكل صحيح."
          action={
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
                isValidWeights
                  ? 'border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-300'
                  : 'border border-red-100 bg-red-50 text-red-700 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-300'
              }`}
            >
              المجموع: {totalWeight.toFixed(2)}
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label={`وزن الاختبارات - ${formatPercent(weights.exams)}`}
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={weights.exams}
            onChange={(event) => updateWeight('exams', event.target.value)}
          />

          <Input
            label={`وزن الحضور - ${formatPercent(weights.attendance)}`}
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={weights.attendance}
            onChange={(event) => updateWeight('attendance', event.target.value)}
          />

          <Input
            label={`وزن المشاركة - ${formatPercent(weights.participation)}`}
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={weights.participation}
            onChange={(event) =>
              updateWeight('participation', event.target.value)
            }
          />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            icon={RefreshCcw}
            onClick={load}
            loading={loading}
          >
            تحديث الترتيب
          </Button>

          <Button icon={Save} onClick={save} disabled={!isValidWeights}>
            حفظ الأوزان
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader
            title="الترتيب الحالي"
            subtitle="قائمة الطلاب مرتبة حسب النقاط النهائية بعد تطبيق الأوزان الحالية."
            action={
              <div className="hidden items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-3 py-1.5 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300 sm:inline-flex">
                <Settings2 size={14} />
                {rows.length} طالب
              </div>
            }
          />
        </div>

        <Table
          columns={[
            {
              key: 'rank',
              title: '#',
              render: (row) => (
                <span
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-xl px-2 text-xs font-black text-white ${
                    row.rank === 1
                      ? 'bg-[#2563EB]'
                      : row.rank === 2
                        ? 'bg-[#0B6F7A]'
                        : row.rank === 3
                          ? 'bg-[#14B8A6]'
                          : 'bg-[#64748B]'
                  }`}
                >
                  #{row.rank}
                </span>
              )
            },
            {
              key: 'name',
              title: 'الطالب',
              render: (row) => (
                <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                  {row.student.name}
                </span>
              )
            },
            {
              key: 'avgExam',
              title: 'الاختبارات',
              render: (row) => <Badge tone="brand">{row.avgExam}%</Badge>
            },
            {
              key: 'att',
              title: 'الحضور',
              render: (row) => (
                <Badge tone="success">{row.attendanceRate}%</Badge>
              )
            },
            {
              key: 'part',
              title: 'المشاركة',
              render: (row) => (
                <Badge tone="warning">{row.participation}%</Badge>
              )
            },
            {
              key: 'points',
              title: 'النقاط',
              render: (row) => (
                <span className="font-black text-[#0B6F7A] dark:text-cyan-300">
                  {row.points}
                </span>
              )
            }
          ]}
          data={rows}
          empty={loading ? 'جاري تحديث الترتيب...' : 'لا توجد بيانات كافية'}
        />
      </Card>
    </div>
  )
}