import { useEffect, useState } from 'react'
import { db } from '../../db/database.js'
import { singleInstructorService } from '../../services/singleInstructorService.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Save } from 'lucide-react'

export default function InstructorSettings() {
  const toast = useToast()
  const [settings, setSettings] = useState({
    academyName: '',
    tagline: '',
    name: '',
    title: '',
    email: '',
    phone: '',
    city: '',
    headline: '',
    experience: '',
    bio: ''
  })

  useEffect(() => {
    const raw = db.raw().settings || {}
    const profile = singleInstructorService.getProfile()
    setSettings({
      academyName: raw.academyName || '',
      tagline: raw.tagline || '',
      name: profile.name || '',
      title: profile.title || '',
      email: profile.email || '',
      phone: profile.phone || '',
      city: profile.city || '',
      headline: profile.headline || '',
      experience: profile.experience || '',
      bio: profile.bio || ''
    })
  }, [])

  const save = (event) => {
    event.preventDefault()
    db.setting('academyName', settings.academyName)
    db.setting('tagline', settings.tagline)
    singleInstructorService.updateProfile({
      name: settings.name,
      title: settings.title,
      email: settings.email,
      phone: settings.phone,
      city: settings.city,
      headline: settings.headline,
      experience: settings.experience,
      bio: settings.bio
    })
    toast.success('تم حفظ إعدادات المنصة')
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <CardHeader title="إعدادات المدرس والمنصة" subtitle="هذه البيانات تظهر في الواجهة العامة وداخل لوحة الطالب." />
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <Input label="اسم المنصة" value={settings.academyName} onChange={(e) => setSettings({ ...settings, academyName: e.target.value })} />
          <Input label="الشعار المختصر" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
          <Input label="اسم المدرس" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
          <Input label="المسمى" value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} />
          <Input label="البريد" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          <Input label="الهاتف" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          <Input label="المدينة" value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} />
          <Input label="الخبرة" value={settings.experience} onChange={(e) => setSettings({ ...settings, experience: e.target.value })} />
          <Input label="العنوان الرئيسي" value={settings.headline} onChange={(e) => setSettings({ ...settings, headline: e.target.value })} className="md:col-span-2" />
          <Textarea label="نبذة المدرس" value={settings.bio} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} className="md:col-span-2" />
          <Button type="submit" icon={Save} className="md:col-span-2">حفظ الإعدادات</Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="معاينة الهوية" />
        <div className="rounded-xl border border-ink-100 p-4">
          <div className="w-16 h-16 rounded-xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center">
            {settings.name?.charAt(0) || 'م'}
          </div>
          <h3 className="font-extrabold text-ink-900 mt-4">{settings.name}</h3>
          <p className="text-sm text-brand-600 font-bold mt-1">{settings.title}</p>
          <p className="text-sm text-ink-500 leading-6 mt-3">{settings.bio}</p>
        </div>
      </Card>
    </div>
  )
}
