import { db } from '../db/database.js'
import { notificationRepo } from '../repositories/index.js'
import { delay } from '../utils/id.js'

export const notificationService = {
  async listForUser(userId) {
    await delay(60)
    return db.all('notifications')
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async unreadCount(userId) {
    await delay(30)
    return db.all('notifications').filter((n) => n.userId === userId && !n.read).length
  },

  async markRead(id) {
    return notificationRepo.update(id, { read: true })
  },

  async markAllRead(userId) {
    await delay(100)
    const all = db.all('notifications').filter((n) => n.userId === userId && !n.read)
    all.forEach((n) => notificationRepo.update(n.id, { read: true }))
    return all.length
  },

  async sendToRole(role, { title, body, type = 'info' }) {
    await delay(120)
    const users = db.all('users').filter((u) => !u.hidden && (role === 'all' ? true : u.role === role))
    users.forEach((u) => {
      notificationRepo.create({
        userId: u.id,
        title,
        body,
        type,
        read: false
      })
    })
    return users.length
  },

  async sendToUser(userId, payload) {
    return notificationRepo.create({ userId, ...payload, read: false })
  },

  async remove(id) {
    return notificationRepo.remove(id)
  }
}
