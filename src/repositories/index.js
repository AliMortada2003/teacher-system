import { db } from '../db/database.js'
import { uid, delay } from '../utils/id.js'

const make = (collection, prefix) => ({
  list: async (predicate) => {
    await delay(80)
    return predicate ? db.where(collection, predicate) : db.all(collection)
  },
  get: async (id) => {
    await delay(60)
    return db.find(collection, id)
  },
  create: async (data) => {
    await delay(120)
    const item = {
      id: uid(prefix),
      createdAt: new Date().toISOString(),
      ...data
    }
    return db.insert(collection, item)
  },
  update: async (id, patch) => {
    await delay(120)
    return db.update(collection, id, patch)
  },
  remove: async (id) => {
    await delay(100)
    return db.remove(collection, id)
  }
})

export const userRepo = make('users', 'usr')
export const subjectRepo = make('subjects', 'sub')
export const lessonRepo = make('lessons', 'lsn')
export const examRepo = make('exams', 'exm')
export const questionRepo = make('questions', 'q')
export const attemptRepo = make('attempts', 'att')
export const attendanceRepo = make('attendance', 'atr')
export const notificationRepo = make('notifications', 'ntf')
export const announcementRepo = make('announcements', 'ann')
export const activityRepo = make('activityLogs', 'log')
export const sessionRepo = make('sessions', 'ses')
