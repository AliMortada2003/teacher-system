import { useEffect, useMemo, useState } from 'react'
import { Receipt } from 'lucide-react'

import { commerceService } from '../../services/commerceService.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { formatDate } from '../../utils/date.js'

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    certificates: 0
  })

  useEffect(() => {
    commerceService.allOrders().then((list) => {
      setOrders(
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      )
    })

    setMetrics({
      revenue: commerceService.reportMetrics().revenue || 0,
      orders: commerceService.reportMetrics().orders || 0,
      certificates: commerceService.reportMetrics().certificates || 0
    })
  }, [])

  const paidOrders = useMemo(() => {
    return orders.filter((order) => order.status === 'paid' || !order.status)
  }, [orders])

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-5 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#BEE8F4]/45 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#D8F0E9]/35 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-xs font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
            <Receipt size={15} />
            إدارة الطلبات
          </div>

          <h2 className="mt-4 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
            طلبات الكورسات والمدفوعات
          </h2>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#41596B] dark:text-slate-300">
            تابع عمليات شراء الكورسات، الإيرادات المحلية، والكوبونات المستخدمة داخل المنصة.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          title="إجمالي الطلبات"
          value={metrics.orders}
          icon="Receipt"
          tone="blue"
          description="عدد عمليات الشراء المسجلة."
        />

        <StatCard
          title="الإيرادات المحلية"
          value={metrics.revenue}
          suffix="EGP"
          icon="Wallet"
          tone="green"
          description="إجمالي المدفوعات المحفوظة."
        />

        <StatCard
          title="الشهادات"
          value={metrics.certificates}
          icon="Award"
          tone="burgundy"
          description="عدد الشهادات الصادرة."
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-[#DCEAF3] bg-white/85 p-0 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="border-b border-[#DCEAF3] p-5 dark:border-slate-700">
          <CardHeader
            title="قائمة الطلبات"
            subtitle={`${orders.length} طلب داخل المنصة · ${paidOrders.length} مدفوع`}
          />
        </div>

        {orders.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Receipt}
              title="لا توجد طلبات بعد"
              description="ستظهر هنا طلبات شراء الكورسات بعد إتمام الدفع."
            />
          </div>
        ) : (
          <Table
            columns={[
              {
                key: 'student',
                title: 'الطالب',
                render: (row) => db.find('users', row.studentId)?.name || '-'
              },
              {
                key: 'courseTitle',
                title: 'الكورس',
                render: (row) => (
                  <span className="font-black text-[#0B2B3F] dark:text-slate-50">
                    {row.courseTitle}
                  </span>
                )
              },
              {
                key: 'total',
                title: 'الإجمالي',
                render: (row) => (
                  <span className="font-black text-[#0B6F7A] dark:text-cyan-300">
                    {row.total} {row.currency}
                  </span>
                )
              },
              {
                key: 'coupon',
                title: 'الكوبون',
                render: (row) =>
                  row.couponCode ? (
                    <span className="rounded-xl bg-[#E8F8FA] px-3 py-1.5 text-xs font-black text-[#0B6F7A] dark:bg-cyan-400/10 dark:text-cyan-300">
                      {row.couponCode}
                    </span>
                  ) : (
                    '-'
                  )
              },
              {
                key: 'status',
                title: 'الحالة',
                render: (row) =>
                  row.status === 'cancelled' ? (
                    <Badge tone="danger">ملغي</Badge>
                  ) : (
                    <Badge tone="success">مدفوع</Badge>
                  )
              },
              {
                key: 'date',
                title: 'التاريخ',
                render: (row) => formatDate(row.createdAt)
              }
            ]}
            data={orders}
          />
        )}
      </Card>
    </div>
  )
}