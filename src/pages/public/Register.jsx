import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { db } from '../../db/database.js'

export default function Register() {
  const { registerStudent } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    grade: 'الصف العاشر',
    subjectIds: []
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState({})

  useEffect(() => {
    setSubjects(db.all('subjects').filter((subject) => subject.published !== false))
  }, [])

  const toggleSubject = (id) => {
    setForm((current) => ({
      ...current,
      subjectIds: current.subjectIds.includes(id)
        ? current.subjectIds.filter((item) => item !== id)
        : [...current.subjectIds, id]
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const errors = {}
    if (!form.name) errors.name = 'الاسم مطلوب'
    if (!form.email) errors.email = 'البريد مطلوب'
    if (!form.password || form.password.length < 6) errors.password = 'كلمة المرور 6 أحرف على الأقل'
    if (Object.keys(errors).length) {
      setErr(errors)
      return
    }
    setLoading(true)
    try {
      await registerStudent(form)
      toast.success('تم إنشاء حسابك بنجاح')
      nav('/student/dashboard')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-6 py-10">
      <div className="container-lg mx-auto max-w-4xl">
        <div className="mb-6 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
            <GraduationCap size={14} />
            انضم كطالب
          </p>
          <h1 className="mt-3 text-3xl font-bold text-ink-900">إنشاء حساب طالب</h1>
          <p className="mt-2 leading-7 text-ink-600">
            أنشئ حسابك واختر كورسات البداية الاختيارية. يمكنك شراء المزيد لاحقا من لوحة الطالب.
          </p>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-5 shadow-soft md:p-6">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <Input label="الاسم الكامل" value={form.name} error={err.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="البريد الإلكتروني" type="email" value={form.email} error={err.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="كلمة المرور" type="password" value={form.password} error={err.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <Input label="رقم الهاتف" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Input label="المدينة" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <Input label="الصف الدراسي" value={form.grade} onChange={(event) => setForm({ ...form, grade: event.target.value })} />

            <div className="md:col-span-2">
              <label className="label">كورسات البداية الاختيارية</label>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={`rounded-xl border px-4 py-3 text-right text-sm font-semibold transition-colors ${
                      form.subjectIds.includes(subject.id)
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-ink-200 text-ink-700 hover:border-brand-300'
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={loading} icon={UserPlus} className="md:col-span-2">
              إنشاء الحساب
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-500">
            لديك حساب؟ <Link to="/login" className="font-bold text-brand-600 hover:underline">سجّل الدخول</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
