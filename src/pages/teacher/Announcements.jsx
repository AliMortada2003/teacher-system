import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { announcementRepo } from '../../repositories/index.js'
import { notificationService } from '../../services/notificationService.js'
import { db } from '../../db/database.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Textarea, Select } from '../../components/ui/Input.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Megaphone, Plus, Trash2, Edit2 } from 'lucide-react'
import { relativeTime } from '../../utils/date.js'
import { motion } from 'framer-motion'

export default function Announcements() {
  const { user } = useAuth()
  const toast = useToast()
  const [list, setList] = useState([])
  const [subjects, setSubjects] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', subjectId: '' })
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const subs = db.all('subjects').filter((s) => user.subjectIds?.includes(s.id))
    setSubjects(subs)
    const all = await announcementRepo.list((a) => a.authorId === user.id)
    setList(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  useEffect(() => { load() }, [user.id])

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', body: '', subjectId: subjects[0]?.id || '' })
    setOpen(true)
  }
  const openEdit = (a) => {
    setEditing(a)
    setForm({ title: a.title, body: a.body, subjectId: a.subjectId })
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.title || !form.body) return toast.error('أكمل العنوان والنص')
    if (editing) {
      await announcementRepo.update(editing.id, form)
      toast.success('تم التعديل')
    } else {
      await announcementRepo.create({ ...form, authorId: user.id })
      // notify enrolled students
      const students = db.all('users').filter(
        (u) => u.role === 'student' && u.subjectIds?.includes(form.subjectId)
      )
      students.forEach((s) => notificationService.sendToUser(s.id, {
        title: `إعلان جديد: ${form.title}`,
        body: form.body,
        type: 'info'
      }))
      toast.success('تم النشر وإرسال إشعارات')
    }
    setOpen(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('حذف الإعلان؟')) return
    await announcementRepo.remove(id)
    toast.success('تم الحذف')
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <CardHeader title="إعلانات الفصل" subtitle={`${list.length} إعلان`} />
        <Button icon={Plus} onClick={openAdd}>إعلان جديد</Button>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Megaphone} title="لا توجد إعلانات" description="ابدأ بإرسال أول إعلان لطلابك" />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <div className="flex items-start gap-3">
                  <div className="bg-accent-600 text-white rounded-xl p-3">
                    <Megaphone size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-ink-900">{a.title}</p>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600"><Edit2 size={14} /></button>
                        <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-ink-500 mt-1 leading-relaxed">{a.body}</p>
                    <p className="text-xs text-ink-400 mt-2">
                      {db.find('subjects', a.subjectId)?.name} · {relativeTime(a.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'تعديل إعلان' : 'نشر إعلان جديد'}>
        <form onSubmit={save} className="space-y-4">
          <Input label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="المادة" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
          <Textarea label="النص" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit">{editing ? 'حفظ' : 'نشر'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
