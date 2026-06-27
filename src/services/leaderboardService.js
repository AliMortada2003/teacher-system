import { db } from '../db/database.js'
import { delay } from '../utils/id.js'
import { ROLES, ATTENDANCE_STATUS } from '../utils/constants.js'

export const leaderboardService = {
  async compute(filter = {}) {
    await delay(100)
    const settings = db.raw().settings || {}
    const weights = settings.leaderboardWeights || { exams: 0.6, attendance: 0.25, participation: 0.15 }
    const students = db.all('users').filter((user) => user.role === ROLES.STUDENT)
    const attempts = db.all('attempts')
    const attendance = db.all('attendance')

    const rows = students.map((student) => {
      const myAttempts = attempts.filter(
        (attempt) => attempt.studentId === student.id && attempt.status === 'submitted' &&
          (!filter.subjectId || attempt.subjectId === filter.subjectId)
      )
      const myAttendance = attendance.filter(
        (record) => record.studentId === student.id && (!filter.subjectId || record.subjectId === filter.subjectId)
      )

      const avgExam = myAttempts.length
        ? myAttempts.reduce((acc, attempt) => acc + attempt.percentage, 0) / myAttempts.length
        : 0
      const attTotal = myAttendance.length
      const attRate = attTotal
        ? (myAttendance.filter((record) => record.status === ATTENDANCE_STATUS.PRESENT).length +
            myAttendance.filter((record) => record.status === ATTENDANCE_STATUS.LATE).length * 0.5) /
            attTotal * 100
        : 0
      const participationScore = Math.min(100, myAttempts.length * 20)

      const total =
        avgExam * weights.exams + attRate * weights.attendance + participationScore * weights.participation

      return {
        student,
        examsCount: myAttempts.length,
        avgExam: Math.round(avgExam),
        attendanceRate: Math.round(attRate),
        participation: Math.round(participationScore),
        points: Math.round(total)
      }
    })

    return rows
      .filter((row) => row.points > 0)
      .sort((a, b) => b.points - a.points)
      .map((row, index) => ({ ...row, rank: index + 1 }))
  },

  medal(rank) {
    if (rank === 1) return { label: 'ذهبية', color: '#F59E0B', icon: '1' }
    if (rank === 2) return { label: 'فضية', color: '#64748B', icon: '2' }
    if (rank === 3) return { label: 'برونزية', color: '#D97706', icon: '3' }
    return null
  }
}
