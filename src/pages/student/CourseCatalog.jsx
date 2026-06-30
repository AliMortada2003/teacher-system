import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, CreditCard, Search, TicketPercent, UserRound } from 'lucide-react'
import { commerceService } from '../../services/commerceService.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { CourseCard } from '../../components/ui/CourseCard.jsx'

export default function CourseCatalog() {
  const { user, refresh } = useAuth()
  const toast = useToast()
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [coupon, setCoupon] = useState('')
  const [loadingId, setLoadingId] = useState('')
  const instructor = singleInstructorService.getProfile()

  const load = () => {
    commerceService.catalog(user.id).then(setCourses)
  }

  useEffect(() => { load() }, [user.id])

  const purchase = async (subjectId) => {
    setLoadingId(subjectId)
    try {
      const result = await commerceService.purchaseCourse({ studentId: user.id, subjectId, couponCode: coupon })
      if (result.alreadyPurchased) {
        toast.info('أنت مشترك في هذا الكورس بالفعل')
      } else {
        toast.success('تم تفعيل الكورس بنجاح')
      }
      setCoupon('')
      refresh()
      load()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoadingId('')
    }
  }

  const filtered = courses.filter((course) =>
    course.name.toLowerCase().includes(query.toLowerCase()) ||
    course.code.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-ink-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-600">كورسات المدرس</p>
            <h2 className="mt-2 text-2xl font-bold text-ink-900">استكشف كورسات {instructor.name}</h2>
            <p className="mt-2 leading-7 text-ink-600">
              اختر الكورس المناسب، فعّل الاشتراك محليا، وابدأ التعلم من لوحة الطالب.
            </p>
          </div>
          <div className="flex min-w-[260px] items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
            <UserRound className="text-brand-600" size={19} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink-900">{instructor.name}</p>
              <p className="truncate text-xs text-ink-500">{instructor.title}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <label className="relative block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input pr-10"
            placeholder="ابحث عن كورس..."
          />
        </label>
        <label className="relative block">
          <TicketPercent className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
          <input
            value={coupon}
            onChange={(event) => setCoupon(event.target.value.toUpperCase())}
            className="input pr-10"
            placeholder="كود خصم اختياري مثل WELCOME20"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="لا توجد كورسات مطابقة" description="جرّب البحث باسم آخر أو امسح كلمة البحث." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              purchased={course.purchased}
              action={course.purchased ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link to={`/student/courses/${course.id}`} className="btn-outline">
                      تفاصيل
                    </Link>
                    <Link to={`/student/subjects/${course.id}`} className="btn-primary">
                      <CheckCircle2 size={16} />
                      متابعة
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link to={`/student/courses/${course.id}`} className="btn-outline">
                      تفاصيل
                    </Link>
                    <Button icon={CreditCard} loading={loadingId === course.id} onClick={() => purchase(course.id)}>
                      شراء
                    </Button>
                  </div>
                )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
