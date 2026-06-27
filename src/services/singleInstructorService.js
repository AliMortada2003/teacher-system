import { db } from '../db/database.js'

export const singleInstructorService = {
  getInstructorId() {
    db.migrate()
    return db.raw().settings?.globalInstructorId || null
  },

  getInstructor() {
    const id = this.getInstructorId()
    return id ? db.find('users', id) : null
  },

  getProfile() {
    const settings = db.raw().settings || {}
    const instructor = this.getInstructor()
    return {
      ...(settings.instructorProfile || {}),
      id: instructor?.id,
      name: settings.instructorProfile?.name || instructor?.name || 'المدرس',
      email: settings.instructorProfile?.email || instructor?.email || '',
      phone: settings.instructorProfile?.phone || instructor?.phone || '',
      city: settings.instructorProfile?.city || instructor?.city || '',
      bio: settings.instructorProfile?.bio || instructor?.bio || '',
      avatar: settings.instructorProfile?.avatar || instructor?.avatar || null
    }
  },

  updateProfile(profile) {
    const data = db.raw()
    const instructorId = data.settings?.globalInstructorId
    data.settings.instructorProfile = {
      ...(data.settings.instructorProfile || {}),
      ...profile
    }
    if (instructorId) {
      const users = data.users || []
      const idx = users.findIndex((user) => user.id === instructorId)
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          name: profile.name || users[idx].name,
          email: profile.email || users[idx].email,
          phone: profile.phone || users[idx].phone,
          city: profile.city || users[idx].city,
          bio: profile.bio || users[idx].bio,
          avatar: profile.avatar ?? users[idx].avatar
        }
      }
    }
    db.saveRaw(data)
    return this.getProfile()
  },

  isGlobalInstructor(userId) {
    return !!userId && this.getInstructorId() === userId
  },

  ownedSubjects() {
    const instructorId = this.getInstructorId()
    return db.all('subjects').filter((subject) => subject.instructorId === instructorId || subject.published !== false)
  }
}
