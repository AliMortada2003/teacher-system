import { useEffect, useState } from 'react'
import { Receipt } from 'lucide-react'
import { commerceService } from '../../services/commerceService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { formatDate } from '../../utils/date.js'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    commerceService.ordersForStudent(user.id).then(setOrders)
  }, [user.id])

  return (
    <Card className="!p-0">
      <div className="p-5 border-b border-ink-100">
        <h2 className="text-lg font-bold text-ink-900">طلبات الشراء</h2>
        <p className="text-sm text-ink-500 mt-1">كل عمليات الشراء المحلية المسجلة على هذا المتصفح.</p>
      </div>
      {orders.length === 0 ? (
        <EmptyState icon={Receipt} title="لا توجد طلبات بعد" description="ستظهر هنا الكورسات التي تقوم بشرائها." />
      ) : (
        <Table
          columns={[
            { key: 'courseTitle', title: 'الكورس', render: (row) => <span className="font-bold">{row.courseTitle}</span> },
            { key: 'total', title: 'الإجمالي', render: (row) => `${row.total} ${row.currency}` },
            { key: 'discount', title: 'الخصم', render: (row) => `${row.discount} ${row.currency}` },
            { key: 'status', title: 'الحالة', render: () => <Badge tone="success">مدفوع</Badge> },
            { key: 'date', title: 'التاريخ', render: (row) => formatDate(row.createdAt) }
          ]}
          data={orders}
        />
      )}
    </Card>
  )
}
