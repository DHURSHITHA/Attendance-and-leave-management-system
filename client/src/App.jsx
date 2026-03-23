import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import StudentDashboardHome from "./pages/student/StudentDashboardHome";
import StudentAttendancePage from "./pages/student/StudentAttendancePage";
import StudentCalendarPage from "./pages/student/StudentCalendarPage";
import StudentBiometricLogsPage from "./pages/student/StudentBiometricLogsPage";
import StudentLeavePage from "./pages/student/StudentLeavePage";
import StudentPerformancePage from "./pages/student/StudentPerformancePage";
import StudentNotificationsPage from "./pages/student/StudentNotificationsPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import FacultyDashboardHome from "./pages/faculty/FacultyDashboardHome";
import FacultyStudentsPage from "./pages/faculty/FacultyStudentsPage";
import FacultyAttendanceMonitorPage from "./pages/faculty/FacultyAttendanceMonitorPage";
import FacultyBiometricLogsPage from "./pages/faculty/FacultyBiometricLogsPage";
import FacultyLowAttendancePage from "./pages/faculty/FacultyLowAttendancePage";
import FacultyLeaveRequestsPage from "./pages/faculty/FacultyLeaveRequestsPage";
import FacultyAnalyticsPage from "./pages/faculty/FacultyAnalyticsPage";
import FacultyReportsPage from "./pages/faculty/FacultyReportsPage";
import FacultyStudentManagementPage from "./pages/faculty/FacultyStudentManagementPage";
import FacultyNotificationsPage from "./pages/faculty/FacultyNotificationsPage";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminModulePage from "./pages/admin/AdminModulePage";
import ParentDashboardHome from "./pages/parent/ParentDashboardHome";
import ParentAttendancePage from "./pages/parent/ParentAttendancePage";
import ParentCalendarPage from "./pages/parent/ParentCalendarPage";
import ParentMessagesPage from "./pages/parent/ParentMessagesPage";
import ParentFeesPage from "./pages/parent/ParentFeesPage";
import ParentNotificationsPage from "./pages/parent/ParentNotificationsPage";
import ParentProfilePage from "./pages/parent/ParentProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="student" />}>
          <Route element={<DashboardLayout role="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboardHome />} />
            <Route path="/student/attendance" element={<StudentAttendancePage />} />
            <Route path="/student/calendar" element={<StudentCalendarPage />} />
            <Route path="/student/biometric-logs" element={<StudentBiometricLogsPage />} />
            <Route path="/student/leave" element={<StudentLeavePage />} />
            <Route path="/student/performance" element={<StudentPerformancePage />} />
            <Route path="/student/notifications" element={<StudentNotificationsPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="faculty" />}>
          <Route element={<DashboardLayout role="faculty" />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboardHome />} />
            <Route path="/faculty/students" element={<FacultyStudentsPage />} />
            <Route
              path="/faculty/attendance-monitor"
              element={<FacultyAttendanceMonitorPage />}
            />
            <Route path="/faculty/biometric-logs" element={<FacultyBiometricLogsPage />} />
            <Route path="/faculty/low-attendance" element={<FacultyLowAttendancePage />} />
            <Route path="/faculty/leave-requests" element={<FacultyLeaveRequestsPage />} />
            <Route path="/faculty/analytics" element={<FacultyAnalyticsPage />} />
            <Route path="/faculty/reports" element={<FacultyReportsPage />} />
            <Route
              path="/faculty/student-management"
              element={<FacultyStudentManagementPage />}
            />
            <Route path="/faculty/notifications" element={<FacultyNotificationsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="admin" />}>
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
            <Route path="/admin/students" element={<AdminModulePage section="students" />} />
            <Route path="/admin/faculty" element={<AdminModulePage section="faculty" />} />
            <Route path="/admin/mentor-assignment" element={<AdminModulePage section="mentor-assignment" />} />
            <Route path="/admin/departments" element={<AdminModulePage section="departments" />} />
            <Route path="/admin/attendance-monitor" element={<AdminModulePage section="attendance-monitor" />} />
            <Route path="/admin/faculty-attendance" element={<AdminModulePage section="faculty-attendance" />} />
            <Route path="/admin/biometric-settings" element={<AdminModulePage section="biometric-settings" />} />
            <Route path="/admin/manual-attendance" element={<AdminModulePage section="manual-attendance" />} />
            <Route path="/admin/leave-monitoring" element={<AdminModulePage section="leave-monitoring" />} />
            <Route path="/admin/reports" element={<AdminModulePage section="reports" />} />
            <Route path="/admin/analytics" element={<AdminModulePage section="analytics" />} />
            <Route path="/admin/notifications" element={<AdminModulePage section="notifications" />} />
            <Route path="/admin/system-settings" element={<AdminModulePage section="system-settings" />} />
            <Route path="/admin/activity-logs" element={<AdminModulePage section="activity-logs" />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="parent" />}>
          <Route element={<DashboardLayout role="parent" />}>
            <Route path="/parent/dashboard" element={<ParentDashboardHome />} />
            <Route path="/parent/attendance" element={<ParentAttendancePage />} />
            <Route path="/parent/calendar" element={<ParentCalendarPage />} />
            <Route path="/parent/messages" element={<ParentMessagesPage />} />
            <Route path="/parent/fees" element={<ParentFeesPage />} />
            <Route path="/parent/notifications" element={<ParentNotificationsPage />} />
            <Route path="/parent/profile" element={<ParentProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
