import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpenText, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { ROLES } from '../../utils/constants.js'

const HOME_BY_ROLE = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.TEACHER]: '/teacher/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard'
}

const DEMOS = [
  { label: 'طالب', email: 'student1@academy.sa', password: '123456' },
  { label: 'المدرس', email: 'teacher1@academy.sa', password: '123456' },
  { label: 'المالك', email: 'admin@academy.sa', password: '123456' }
]

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success('مرحباً بك في منصة الأوائل')
      nav(location.state?.from || HOME_BY_ROLE[user.role] || '/', { replace: true })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-6 shadow-soft">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <BookOpenText size={23} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink-900">تسجيل الدخول</h1>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            ادخل إلى حسابك في منصة الأوائل لمتابعة كورسات العربي.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Button type="submit" loading={loading} icon={LogIn} className="w-full">
            دخول
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-ink-200 bg-ink-50 p-3">
          <p className="mb-2 text-xs font-extrabold text-ink-500">حسابات تجريبية</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMOS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => setForm({ email: demo.email, password: demo.password })}
                className="rounded-lg border border-ink-200 bg-white px-2 py-2 text-xs font-extrabold text-ink-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-ink-500">
          لا تملك حساباً؟ <Link to="/register" className="font-extrabold text-brand-600 hover:underline">إنشاء حساب طالب</Link>
        </p>
      </div>
    </section>
  )
}
