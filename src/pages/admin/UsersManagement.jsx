import { useEffect, useState } from 'react'
import { userRepo } from '../../repositories/index.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { SectionPanel } from '../../components/ui/Card.jsx'
import { Table } from '../../components/ui/Table.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Select } from '../../components/ui/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { ROLE_LABELS, ROLES } from '../../utils/constants.js'
import { Eye, Search, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

export default function UsersManagement() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [viewing, setViewing] = useState(null)

  const load = async () => {
    const instructorId = singleInstructorService.getInstructorId()
    const users = await userRepo.list((user) =>
      user.role !== ROLES.TEACHER || user.id === instructorId
    )
    setRows(users)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter((user) => {
    if (role !== 'all' && user.role !== role) return false
    if (search && !(user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  const remove = async (id) => {
    if (singleInstructorService.isGlobalInstructor(id)) return toast.error('لا يمكن حذف المدرس الرئيسي')
    if (!confirm('حذف المستخدم؟')) return
    await userRepo.remove(id)
    toast.success('تم الحذف')
    load()
  }

  return (
    <div className="space-y-5">
      <SectionPanel
        title="قائمة المستخدمين"
        subtitle={`${filtered.length} مستخدم ظاهر في منصة المدرس الواحد`}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block md:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <input className="input pr-10" placeholder="ابحث بالاسم أو البريد..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <Select
            className="md:w-48"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            options={[
              { value: 'all', label: 'كل الأدوار' },
              { value: 'student', label: 'طالب' },
              { value: 'admin', label: 'مالك' }
            ]}
          />
        </div>

        <Table
          columns={[
            {
              key: 'name',
              title: 'الاسم',
              render: (row) => (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                    {row.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-900">{row.name}</p>
                    <p className="truncate text-xs text-ink-400">{row.email}</p>
                  </div>
                </div>
              )
            },
            { key: 'role', title: 'الدور', render: (row) => <Badge tone={row.role === 'admin' ? 'brand' : row.role === 'teacher' ? 'warning' : 'success'}>{ROLE_LABELS[row.role]}</Badge> },
            { key: 'status', title: 'الحالة', render: (row) => <Badge tone={row.status === 'approved' || row.status === 'active' ? 'success' : 'default'}>{row.status === 'approved' ? 'مفعل' : row.status}</Badge> },
            { key: 'createdAt', title: 'منذ', render: (row) => formatDate(row.createdAt) },
            {
              key: 'actions',
              title: 'الإجراءات',
              render: (row) => (
                <div className="flex gap-1">
                  <button onClick={() => setViewing(row)} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100" aria-label="عرض المستخدم"><Eye size={16} /></button>
                  <button onClick={() => remove(row.id)} className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50" aria-label="حذف المستخدم"><Trash2 size={16} /></button>
                </div>
              )
            }
          ]}
          data={filtered}
        />
      </SectionPanel>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="تفاصيل المستخدم">
        {viewing && (
          <div className="space-y-2 text-sm">
            {Object.entries({
              الاسم: viewing.name,
              البريد: viewing.email,
              الدور: ROLE_LABELS[viewing.role],
              الحالة: viewing.status === 'approved' ? 'مفعل' : viewing.status,
              الهاتف: viewing.phone || '-',
              المدينة: viewing.city || '-',
              'تاريخ التسجيل': formatDate(viewing.createdAt)
            }).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-ink-100 py-2">
                <span className="text-ink-500">{key}</span>
                <span className="font-bold text-ink-900">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
