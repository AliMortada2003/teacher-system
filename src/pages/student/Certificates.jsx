import { useEffect, useState } from 'react'
import { Award, Download, RefreshCw } from 'lucide-react'
import { commerceService } from '../../services/commerceService.js'
import { db } from '../../db/database.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { formatDate } from '../../utils/date.js'

export default function Certificates() {
  const { user } = useAuth()
  const toast = useToast()
  const [certificates, setCertificates] = useState([])
  const [courses, setCourses] = useState([])

  const load = () => {
    setCertificates(commerceService.certificatesForStudent(user.id))
    setCourses(db.all('subjects').filter((subject) => user.subjectIds?.includes(subject.id)))
  }

  useEffect(() => { load() }, [user.id, user.subjectIds])

  const issue = (subjectId) => {
    try {
      commerceService.issueCertificate(user.id, subjectId)
      toast.success('تم إصدار الشهادة')
      load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="الشهادات"
          subtitle="تصدر الشهادة بعد إكمال الدروس أو تحقيق 70% في اختبارات الكورس."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const certificate = certificates.find((item) => item.subjectId === course.id)
            const progress = commerceService.progressForCourse(user.id, course.id)
            return (
              <div key={course.id} className="rounded-xl border border-ink-100 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-ink-900">{course.name}</h3>
                    <p className="text-xs text-ink-500 mt-1">{progress.completedCount}/{progress.totalLessons} دروس مكتملة</p>
                  </div>
                  <Award className={certificate ? 'text-emerald-600' : 'text-ink-300'} />
                </div>
                <ProgressBar value={progress.percentage} className="mt-4" />
                {certificate ? (
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(`شهادة إتمام\n${certificate.studentName}\n${certificate.courseTitle}\n${certificate.code}`)}`}
                    download={`${certificate.code}.txt`}
                    className="btn-outline w-full mt-4 justify-center"
                  >
                    <Download size={16} /> تحميل الشهادة
                  </a>
                ) : (
                  <Button className="w-full mt-4" icon={RefreshCw} onClick={() => issue(course.id)}>
                    إصدار عند الاستحقاق
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        {courses.length === 0 && <EmptyState icon={Award} title="لا توجد كورسات بعد" />}
      </Card>

      <Card className="!p-0">
        <div className="p-5 border-b border-ink-100">
          <h3 className="font-bold text-ink-900">الشهادات الصادرة</h3>
        </div>
        {certificates.length === 0 ? (
          <EmptyState icon={Award} title="لا توجد شهادات صادرة بعد" />
        ) : (
          <div className="grid md:grid-cols-2 gap-4 p-5">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="rounded-xl border border-ink-100 p-5 bg-white">
                <p className="text-xs text-ink-500">كود الشهادة</p>
                <p className="font-extrabold text-brand-600">{certificate.code}</p>
                <h4 className="font-extrabold text-ink-900 mt-4">{certificate.courseTitle}</h4>
                <p className="text-sm text-ink-500 mt-1">صدرت في {formatDate(certificate.issuedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
