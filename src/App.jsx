import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute.jsx'
import { PublicLayout } from './layouts/PublicLayout.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'
import { ROLES } from './utils/constants.js'
import HomePage from './pages/public/HomePage.jsx'
import Grades from './pages/public/Grades.jsx'
import Contact from './pages/public/ContactPage.jsx'

const About = lazy(() => import('./pages/public/About.jsx'))
const SubjectsPublic = lazy(() => import('./pages/public/Subjects.jsx'))
const Login = lazy(() => import('./pages/public/Login.jsx'))
const Register = lazy(() => import('./pages/public/Register.jsx'))

const Profile = lazy(() => import('./pages/shared/Profile.jsx'))
const Leaderboard = lazy(() => import('./pages/shared/Leaderboard.jsx'))
const NotFound = lazy(() => import('./pages/shared/NotFound.jsx'))

const StudentDashboard = lazy(() => import('./pages/student/Dashboard.jsx'))
const CourseCatalog = lazy(() => import('./pages/student/CourseCatalog.jsx'))
const MySubjects = lazy(() => import('./pages/student/MySubjects.jsx'))
const SubjectDetails = lazy(() => import('./pages/student/SubjectDetails.jsx'))
const LessonPlayer = lazy(() => import('./pages/student/LessonPlayer.jsx'))
const StudentExams = lazy(() => import('./pages/student/Exams.jsx'))
const ExamPage = lazy(() => import('./pages/student/ExamPage.jsx'))
const Results = lazy(() => import('./pages/student/Results.jsx'))
const StudentAttendance = lazy(() => import('./pages/student/Attendance.jsx'))
const StudentNotifications = lazy(() => import('./pages/student/Notifications.jsx'))
const StudentOrders = lazy(() => import('./pages/student/Orders.jsx'))
const StudentCertificates = lazy(() => import('./pages/student/Certificates.jsx'))

const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard.jsx'))
const TeacherSubjects = lazy(() => import('./pages/teacher/MySubjects.jsx'))
const SectionsManagement = lazy(() => import('./pages/teacher/SectionsManagement.jsx'))
const LessonsManagement = lazy(() => import('./pages/teacher/LessonsManagement.jsx'))
const TeacherExams = lazy(() => import('./pages/teacher/ExamsManagement.jsx'))
const AssignmentsManagement = lazy(() => import('./pages/teacher/AssignmentsManagement.jsx'))
const TeacherStudents = lazy(() => import('./pages/teacher/StudentsManagement.jsx'))
const TeacherOrders = lazy(() => import('./pages/teacher/OrdersManagement.jsx'))
const CouponsManagement = lazy(() => import('./pages/teacher/CouponsManagement.jsx'))
const TeacherAttendance = lazy(() => import('./pages/teacher/AttendanceManagement.jsx'))
const Announcements = lazy(() => import('./pages/teacher/Announcements.jsx'))
const Reports = lazy(() => import('./pages/teacher/Reports.jsx'))
const InstructorSettings = lazy(() => import('./pages/teacher/InstructorSettings.jsx'))

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement.jsx'))
const StudentsManagement = lazy(() => import('./pages/admin/StudentsManagement.jsx'))
const SubjectsManagement = lazy(() => import('./pages/admin/SubjectsManagement.jsx'))
const AdminExamsManagement = lazy(() => import('./pages/admin/ExamsManagement.jsx'))
const AttendanceAnalytics = lazy(() => import('./pages/admin/AttendanceAnalytics.jsx'))
const LeaderboardControl = lazy(() => import('./pages/admin/LeaderboardControl.jsx'))
const AdminNotifications = lazy(() => import('./pages/admin/Notifications.jsx'))
const Settings = lazy(() => import('./pages/admin/Settings.jsx'))

const LoadingScreen = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-center">
      <div className="mx-auto w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 animate-pulse" />
      <p className="text-sm font-bold text-ink-500 mt-3">جاري التحميل...</p>
    </div>
  </div>
)

const WithSuspense = ({ children }) => (
  <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
)

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <WithSuspense>
            <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<About />} />
              <Route path="grades" element={<Grades />} />
              <Route path="contact" element={<Contact />} />
              <Route path="subjects" element={<SubjectsPublic />} />
            </Route>

            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

            <Route
              path="/student"
              element={
                <ProtectedRoute allow={[ROLES.STUDENT]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CourseCatalog />} />
              <Route path="subjects" element={<MySubjects />} />
              <Route path="subjects/:id" element={<SubjectDetails />} />
              <Route path="lessons/:id" element={<LessonPlayer />} />
              <Route path="exams" element={<StudentExams />} />
              <Route path="exams/:id" element={<ExamPage />} />
              <Route path="results" element={<Results />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="orders" element={<StudentOrders />} />
              <Route path="certificates" element={<StudentCertificates />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route
              path="/teacher"
              element={
                <ProtectedRoute allow={[ROLES.TEACHER]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<TeacherSubjects />} />
              <Route path="subjects" element={<Navigate to="/teacher/courses" replace />} />
              <Route path="sections" element={<SectionsManagement />} />
              <Route path="lessons" element={<LessonsManagement />} />
              <Route path="quizzes" element={<TeacherExams />} />
              <Route path="exams" element={<Navigate to="/teacher/quizzes" replace />} />
              <Route path="assignments" element={<AssignmentsManagement />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="orders" element={<TeacherOrders />} />
              <Route path="coupons" element={<CouponsManagement />} />
              <Route path="attendance" element={<TeacherAttendance />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<InstructorSettings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute allow={[ROLES.ADMIN]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="students" element={<StudentsManagement />} />
              <Route path="teachers" element={<Navigate to="/admin/settings" replace />} />
              <Route path="subjects" element={<SubjectsManagement />} />
              <Route path="exams" element={<AdminExamsManagement />} />
              <Route path="attendance" element={<AttendanceAnalytics />} />
              <Route path="leaderboard" element={<LeaderboardControl />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            </Routes>
          </WithSuspense>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
