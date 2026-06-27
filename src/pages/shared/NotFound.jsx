import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Card } from '../../components/ui/Card.jsx'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] px-6 py-20 flex items-center justify-center">
      <Card className="max-w-xl text-center">
        <div className="mx-auto w-16 h-16 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
          <Compass size={30} />
        </div>
        <h1 className="text-3xl font-extrabold text-ink-900">الصفحة غير موجودة</h1>
        <p className="text-ink-500 mt-3 leading-7">الرابط الذي تحاول فتحه غير متاح أو تم نقله.</p>
        <Link to="/" className="btn-primary mt-6">العودة للرئيسية</Link>
      </Card>
    </div>
  )
}
