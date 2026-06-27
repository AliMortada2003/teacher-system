import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.current())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(() => {
    setUser(authService.current())
  }, [])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [refresh])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { user } = await authService.login(email, password)
      setUser(user)
      return user
    } finally {
      setLoading(false)
    }
  }

  const registerStudent = async (payload) => {
    setLoading(true)
    try {
      const u = await authService.registerStudent(payload)
      const { user } = await authService.login(u.email, u.password)
      setUser(user)
      return user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const updateUser = async (patch) => {
    const updated = await authService.updateProfile(user.id, patch)
    setUser(updated)
    return updated
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerStudent, logout, updateUser, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
