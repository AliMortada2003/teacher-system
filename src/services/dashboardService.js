import { db } from '../db/database.js'
import { delay } from '../utils/id.js'
import { ROLES } from '../utils/constants.js'
import { attendanceService } from './attendanceService.js'
import { commerceService } from './commerceService.js'
import { singleInstructorService } from './singleInstructorService.js'

const submittedAttempts = () => db.all('attempts').filter((attempt) => attempt.status === 'submitted')

export const dashboardService = {
  async adminMetrics() {
    await delay(100)
    const users = db.all('users')
    const students = users.filter((user) => user.role === ROLES.STUDENT)
    const subjects = db.all('subjects')
    const exams = db.all('exams')
    const attempts = submittedAttempts()
    const attendance = db.all('attendance')
    const commerce = commerceService.reportMetrics()

    const avgScore = attempts.length
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
      : 0

    const attendanceStats = attendanceService.stats(attendance)
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleDateString('ar-EG', { month: 'short' })
      const newStudents = students.filter((student) => {
        const created = new Date(student.createdAt)
        return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth()
      }).length
      const newOrders = db.all('orders').filter((order) => {
        const created = new Date(order.createdAt)
        return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth()
      }).length
      months.push({ month: label, students: newStudents, orders: newOrders })
    }

    const subjectDist = subjects.map((subject) => ({
      name: subject.name,
      value: students.filter((student) => student.subjectIds?.includes(subject.id)).length
    }))

    return {
      totals: {
        users: users.length,
        students: students.length,
        teachers: 1,
        subjects: subjects.length,
        exams: exams.length,
        attempts: attempts.length,
        orders: commerce.orders,
        revenue: commerce.revenue
      },
      avgScore,
      attendance: attendanceStats,
      trend: months,
      subjectDist,
      recentActivity: db.all('activityLogs')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8)
    }
  },

  async studentMetrics(studentId) {
    await delay(100)
    const student = db.find('users', studentId)
    if (!student) return null
    const subjects = db.all('subjects').filter((subject) => student.subjectIds?.includes(subject.id))
    const attempts = submittedAttempts().filter((attempt) => attempt.studentId === studentId)
    const attendance = db.all('attendance').filter((record) => record.studentId === studentId)
    const availableExams = db.all('exams').filter(
      (exam) => exam.published && student.subjectIds?.includes(exam.subjectId)
    )
    const pending = availableExams.filter(
      (exam) => !attempts.find((attempt) => attempt.examId === exam.id)
    )
    const avgScore = attempts.length
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
      : 0
    const attStats = attendanceService.stats(attendance)

    const subjectProgress = subjects.map((subject) => {
      const progress = commerceService.progressForCourse(studentId, subject.id)
      return { name: subject.name, value: progress.percentage }
    })

    const scoreTrend = attempts
      .slice()
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      .slice(-6)
      .map((attempt, index) => ({ label: `#${index + 1}`, score: attempt.percentage }))

    return {
      subjects,
      avgScore,
      totalExams: attempts.length,
      pendingExams: pending.length,
      attendance: attStats,
      subjectProgress,
      scoreTrend,
      upcomingExams: pending.slice(0, 5),
      orders: db.all('orders').filter((order) => order.studentId === studentId).length,
      certificates: db.all('certificates').filter((certificate) => certificate.studentId === studentId).length
    }
  },

  async teacherMetrics() {
    await delay(100)
    const instructorId = singleInstructorService.getInstructorId()
    const subjects = db.all('subjects')
    const exams = db.all('exams').filter((exam) => exam.teacherId === instructorId)
    const attempts = submittedAttempts().filter((attempt) => exams.some((exam) => exam.id === attempt.examId))
    const avgScore = attempts.length
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
      : 0
    const attendance = db.all('attendance').filter((record) => record.teacherId === instructorId)
    const attStats = attendanceService.stats(attendance)
    const students = db.all('users').filter((user) => user.role === ROLES.STUDENT)
    const commerce = commerceService.reportMetrics()

    const scoreBySubject = subjects.map((subject) => {
      const subjectAttempts = attempts.filter((attempt) => attempt.subjectId === subject.id)
      const avg = subjectAttempts.length
        ? Math.round(subjectAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / subjectAttempts.length)
        : 0
      return { name: subject.name, avg, count: subjectAttempts.length }
    })

    return {
      subjects,
      totalExams: exams.length,
      totalAttempts: attempts.length,
      totalStudents: students.length,
      avgScore,
      attendance: attStats,
      scoreBySubject,
      recentAttempts: attempts.slice(-5).reverse(),
      revenue: commerce.revenue,
      orders: commerce.orders,
      certificates: commerce.certificates
    }
  }
}
