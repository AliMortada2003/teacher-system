import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Database, RotateCcw, Save } from 'lucide-react'

export default function Settings() {
  const toast = useToast()
  const [settings, setSettings] = useState({
    academyName: '',
    tagline: '',
    allowRegistration: true,
    instructorName: '',
    instructorTitle: '',
    instructorBio: ''
  })

  useEffect(() => {
    const raw = db.raw().settings || {}
    const profile = singleInstructorService.getProfile()
    setSettings({
      academyName: raw.academyName || '',
      tagline: raw.tagline || '',
      allowRegistration: !!raw.allowRegistration,
      instructorName: profile.name || '',
      instructorTitle: profile.title || '',
      instructorBio: profile.bio || ''
    })
  }, [])

  const save = (event) => {
    event.preventDefault()
    db.setting('academyName', settings.academyName)
    db.setting('tagline', settings.tagline)
    db.setting('allowRegistration', settings.allowRegistration)
    db.setting('autoApproveTeachers', false)
    singleInstructorService.updateProfile({
      name: settings.instructorName,
      title: settings.instructorTitle,
      bio: settings.instructorBio
    })
    toast.success('تم حفظ الإعدادات')
  }

  const resetDb = () => {
    if (!confirm('سيتم حذف جميع البيانات المحلية وإعادة تهيئة المنصة. هل أنت متأكد؟')) return
    db.reset()
    toast.warning('تمت إعادة تهيئة قاعدة البيانات. سيتم تحديث الصفحة.')
    setTimeout(() => window.location.reload(), 1000)
  }

  const totals = {
    users: db.all('users').length,
    courses: db.all('subjects').length,
    lessons: db.all('lessons').length,
    quizzes: db.all('exams').length,
    orders: db.all('orders').length,
    certificates: db.all('certificates').length,
    progress: db.all('lessonProgress').length,
    notifications: db.all('notifications').length
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <CardHeader title="إعدادات المنصة" subtitle="هوية منصة المدرس الواحد وسياسات التسجيل." />
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="اسم المنصة" value={settings.academyName} onChange={(e) => setSettings({ ...settings, academyName: e.target.value })} />
          <Input label="الشعار" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
          <Input label="اسم المدرس" value={settings.instructorName} onChange={(e) => setSettings({ ...settings, instructorName: e.target.value })} />
          <Input label="مسمى المدرس" value={settings.instructorTitle} onChange={(e) => setSettings({ ...settings, instructorTitle: e.target.value })} />
          <Textarea label="نبذة المدرس" value={settings.instructorBio} onChange={(e) => setSettings({ ...settings, instructorBio: e.target.value })} className="md:col-span-2" />

          <label className="md:col-span-2 flex items-center justify-between p-4 rounded-xl bg-ink-50 cursor-pointer border border-ink-100">
            <div>
              <p className="font-bold">السماح بتسجيل الطلاب</p>
              <p className="text-xs text-ink-500">يفعّل صفحة إنشاء حساب الطالب فقط.</p>
            </div>
            <input type="checkbox" checked={settings.allowRegistration} onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })} className="w-5 h-5" />
          </label>

          <Button type="submit" icon={Save} className="md:col-span-2">حفظ الإعدادات</Button>
        </form>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader title="إحصائيات التخزين" />
          <div className="space-y-2 text-sm">
            {Object.entries(totals).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2.5 rounded-xl bg-ink-50">
                <span className="text-ink-500">{key}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-red-100 bg-red-50">
          <CardHeader title="منطقة الخطر" subtitle="إعادة ضبط قاعدة البيانات المحلية بالكامل." />
          <Button variant="danger" icon={RotateCcw} className="w-full" onClick={resetDb}>
            إعادة تهيئة النظام
          </Button>
          <p className="text-xs text-ink-500 mt-3 flex items-start gap-2">
            <Database size={14} className="mt-0.5 shrink-0" />
            سيتم حذف المستخدمين، الكورسات، الدروس، الطلبات، والشهادات المحفوظة في localStorage.
          </p>
        </Card>
      </div>
    </div>
  )
}
