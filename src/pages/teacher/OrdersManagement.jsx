import { useEffect, useState } from 'react'
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
  const [metrics, setMetrics] = useState({ revenue: 0, orders: 0 })

  useEffect(() => {
    commerceService.allOrders().then(setOrders)
    setMetrics(commerceService.reportMetrics())
  }, [])

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="إجمالي الطلبات" value={metrics.orders} icon="Receipt" tone="brand" />
        <StatCard title="الإيرادات المحلية" value={metrics.revenue} suffix="EGP" icon="Wallet" tone="emerald" />
        <StatCard title="الشهادات" value={metrics.certificates} icon="Award" tone="gold" />
      </div>
      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100">
          <CardHeader title="طلبات الكورسات" subtitle="عمليات شراء محلية محفوظة داخل المتصفح." />
        </div>
        {orders.length === 0 ? (
          <EmptyState icon={Receipt} title="لا توجد طلبات بعد" />
        ) : (
          <Table
            columns={[
              { key: 'student', title: 'الطالب', render: (row) => db.find('users', row.studentId)?.name || '-' },
              { key: 'courseTitle', title: 'الكورس', render: (row) => <span className="font-bold">{row.courseTitle}</span> },
              { key: 'total', title: 'الإجمالي', render: (row) => `${row.total} ${row.currency}` },
              { key: 'coupon', title: 'الكوبون', render: (row) => row.couponCode || '-' },
              { key: 'status', title: 'الحالة', render: () => <Badge tone="success">مدفوع</Badge> },
              { key: 'date', title: 'التاريخ', render: (row) => formatDate(row.createdAt) }
            ]}
            data={orders}
          />
        )}
      </Card>
    </div>
  )
}
