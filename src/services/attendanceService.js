import { db } from '../db/database.js'
import { attendanceRepo, activityRepo } from '../repositories/index.js'
import { delay, uid } from '../utils/id.js'
import { ATTENDANCE_STATUS } from '../utils/constants.js'

export const attendanceService = {
  async listForStudent(studentId) {
    await delay(80)
    return db.all('attendance').filter((a) => a.studentId === studentId)
  },

  async listForSubject(subjectId) {
    await delay(80)
    return db.all('attendance').filter((a) => a.subjectId === subjectId)
  },

  async listForTeacher(teacherId) {
    await delay(80)
    return db.all('attendance').filter((a) => a.teacherId === teacherId)
  },

  async mark({ studentId, subjectId, teacherId, status, sessionDate, note }) {
    await delay(120)
    const record = {
      id: uid('atr'),
      studentId,
      subjectId,
      teacherId,
      status,
      sessionDate: sessionDate || new Date().toISOString(),
      note: note || ''
    }
    db.insert('attendance', record)
    activityRepo.create({ userId: teacherId, action: 'تسجيل حضور طالب' })
    return record
  },

  async bulkMark(records, teacherId, subjectId) {
    await delay(150)
    const sessionDate = new Date().toISOString()
    const saved = records.map((r) => {
      const rec = {
        id: uid('atr'),
        studentId: r.studentId,
        subjectId,
        teacherId,
        status: r.status,
        sessionDate,
        note: r.note || ''
      }
      db.insert('attendance', rec)
      return rec
    })
    activityRepo.create({ userId: teacherId, action: `تسجيل حضور جلسة كاملة (${records.length} طالب)` })
    return saved
  },

  async update(id, patch) {
    await delay(100)
    return attendanceRepo.update(id, patch)
  },

  async remove(id) {
    await delay(100)
    return attendanceRepo.remove(id)
  },

  stats(records) {
    const total = records.length
    if (!total) return { total: 0, present: 0, absent: 0, late: 0, rate: 0, absenceRate: 0 }
    const present = records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length
    const absent = records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length
    const late = records.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length
    const rate = Math.round(((present + late * 0.5) / total) * 100)
    const absenceRate = Math.round((absent / total) * 100)
    return { total, present, absent, late, rate, absenceRate }
  },

  topCommitted(records, users, limit = 5) {
    const grouped = {}
    records.forEach((r) => {
      grouped[r.studentId] = grouped[r.studentId] || []
      grouped[r.studentId].push(r)
    })
    return Object.entries(grouped)
      .map(([sid, rs]) => {
        const st = users.find((u) => u.id === sid)
        const stats = this.stats(rs)
        return { student: st, ...stats }
      })
      .filter((x) => x.student)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, limit)
  },

  topAbsent(records, users, limit = 5) {
    const grouped = {}
    records.forEach((r) => {
      grouped[r.studentId] = grouped[r.studentId] || []
      grouped[r.studentId].push(r)
    })
    return Object.entries(grouped)
      .map(([sid, rs]) => {
        const st = users.find((u) => u.id === sid)
        const stats = this.stats(rs)
        return { student: st, ...stats }
      })
      .filter((x) => x.student)
      .sort((a, b) => b.absenceRate - a.absenceRate)
      .slice(0, limit)
  }
}
