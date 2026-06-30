import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ROLES } from '../utils/constants.js'

const roleHome = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.TEACHER]: '/teacher/dashboard',
  [ROLES.ASSISTANT]: '/assistant/dashboard'
}

export const ProtectedRoute = ({ allow, children }) => {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  if (allow && !allow.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || '/'} replace />
  }
  return children
}

export const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth()
  if (user) return <Navigate to={roleHome[user.role]} replace />
  return children
}
