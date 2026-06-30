import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpenText, LogIn, ShieldCheck, Sparkles } from 'lucide-react'

import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { ROLES } from '../../utils/constants.js'

const HOME_BY_ROLE = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.TEACHER]: '/teacher/dashboard',
  [ROLES.ASSISTANT]: '/assistant/dashboard'
}

const DEMOS = [
  { label: 'طالب', email: 'student1@academy.sa', password: '123456' },
  { label: 'مساعد', email: 'assistant@academy.sa', password: '123456' },
  { label: 'المدرس', email: 'teacher@academy.sa', password: '123456' }
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
      const user = await login(form.email.trim(), form.password)

      toast.success('مرحباً بك في منصة الأوائل')

      nav(location.state?.from || HOME_BY_ROLE[user.role] || '/', {
        replace: true
      })
    } catch (error) {
      toast.error(error?.message || 'حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative flex min-h-[calc(100vh-160px)] items-center justify-center overflow-hidden px-4 py-12 text-[#0B2B3F] transition-colors duration-300 dark:text-slate-100">
      {/* Background نفس ألوان الهوم */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#F7FAF9] dark:bg-[#0B1220]" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_8%,rgba(11,111,122,0.105),transparent_30%),radial-gradient(circle_at_12%_22%,rgba(195,145,53,0.085),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(120,198,176,0.09),transparent_35%),linear-gradient(180deg,#F7FAF9_0%,#FFFFFF_38%,#F4F8FA_100%)] dark:bg-[radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_12%_22%,rgba(247,215,25,0.08),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.08),transparent_35%),linear-gradient(180deg,#0B1220_0%,#111827_42%,#0B1220_100%)]" />

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055] [background-image:radial-gradient(#0B2B3F_0.55px,transparent_0.55px)] [background-size:22px_22px] dark:opacity-[0.08] dark:[background-image:radial-gradient(#FFFFFF_0.55px,transparent_0.55px)]" />

      <div className="pointer-events-none absolute -right-32 top-28 -z-10 h-96 w-96 rounded-full bg-[#BEE8F4]/20 blur-[90px] dark:bg-cyan-400/10" />
      <div className="pointer-events-none absolute -left-32 bottom-20 -z-10 h-[420px] w-[420px] rounded-full bg-[#F5D58A]/20 blur-[95px] dark:bg-yellow-300/10" />

      <div className="grid w-full max-w-5xl items-stretch gap-6 lg:grid-cols-[1fr_440px]">
        <div className="hidden rounded-[2rem] border border-[#DCEAF3] bg-white/70 p-8 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-none lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0B6F7A]/15 bg-[#E8F8FA] px-4 py-2 text-sm font-black text-[#0B6F7A] dark:border-cyan-300/15 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Sparkles size={16} />
              منصة تعليمية منظمة للثانوي
            </div>

            <h1 className="mt-7 max-w-lg text-4xl font-black leading-[1.25] text-[#0B2B3F] dark:text-slate-50">
              ادخل حسابك وكمل رحلتك التعليمية بسهولة.
            </h1>

            <p className="mt-4 max-w-md text-base font-medium leading-8 text-[#41596B] dark:text-slate-300">
              تابع دروسك، اختباراتك، تقدمك، وإشعاراتك من مكان واحد داخل منصة الأوائل.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {[
              'متابعة تقدم الطالب بشكل منظم',
              'اختبارات وتدريبات بعد كل جزء',
              'لوحة تحكم بسيطة وواضحة'
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-[#DCEAF3] bg-white/75 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8FA] text-[#0B6F7A] dark:bg-cyan-400/15 dark:text-cyan-300">
                  <ShieldCheck size={18} />
                </span>

                <span className="text-sm font-black text-[#0B2B3F] dark:text-slate-100">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-[2rem] border border-[#DCEAF3] bg-white/85 p-5 shadow-2xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none sm:p-7">
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#075B78] text-white shadow-xl shadow-[#075B78]/20 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none">
              <BookOpenText size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#0B2B3F] dark:text-slate-50">
              تسجيل الدخول
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-[#41596B] dark:text-slate-300">
              ادخل إلى حسابك في منصة الأوائل لمتابعة الدروس والكورسات الخاصة بك.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              autoComplete="email"
              required
            />

            <Input
              label="كلمة المرور"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              loading={loading}
              icon={LogIn}
              className="w-full bg-[#075B78] text-white shadow-xl shadow-[#075B78]/20 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
            >
              دخول
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-[#DCEAF3] bg-[#F7FBFF]/80 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="mb-3 text-xs font-black text-[#6B8293] dark:text-slate-400">
              حسابات تجريبية
            </p>

            <div className="grid grid-cols-3 gap-2">
              {DEMOS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() =>
                    setForm({
                      email: demo.email,
                      password: demo.password
                    })
                  }
                  className="rounded-xl border border-[#DCEAF3] bg-white px-2 py-2.5 text-xs font-black text-[#0B2B3F] transition-all hover:-translate-y-0.5 hover:border-[#C39135]/40 hover:bg-[#FFF5DF] hover:text-[#C39135] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-yellow-300/30 dark:hover:bg-yellow-300/10 dark:hover:text-yellow-300"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm font-medium text-[#41596B] dark:text-slate-300">
            لا تملك حساباً؟{' '}
            <Link
              to="/register"
              className="font-black text-[#0B6F7A] hover:underline dark:text-cyan-300"
            >
              إنشاء حساب طالب
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
