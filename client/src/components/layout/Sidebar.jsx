import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const studentNav = [
  ["Dashboard", "/student/dashboard"],
  ["Attendance", "/student/attendance"],
  ["Calendar", "/student/calendar"],
  ["Biometric Logs", "/student/biometric-logs"],
  ["Leave", "/student/leave"],
  ["Performance", "/student/performance"],
  ["Notifications", "/student/notifications"],
  ["Profile", "/student/profile"],
];

const facultyNav = [
  ["Dashboard", "/faculty/dashboard"],
  ["Students", "/faculty/students"],
  ["Attendance Monitor", "/faculty/attendance-monitor"],
  ["Biometric Logs", "/faculty/biometric-logs"],
  ["Low Attendance", "/faculty/low-attendance"],
  ["Leave Requests", "/faculty/leave-requests"],
  ["Analytics", "/faculty/analytics"],
  ["Reports", "/faculty/reports"],
  ["Student Management", "/faculty/student-management"],
  ["Notifications", "/faculty/notifications"],
];

const adminNav = [
  ["Dashboard", "/admin/dashboard"],
  ["Students", "/admin/students"],
  ["Faculty", "/admin/faculty"],
  ["Mentor Assignment", "/admin/mentor-assignment"],
  ["Departments", "/admin/departments"],
  ["Attendance Monitor", "/admin/attendance-monitor"],
  ["Faculty Attendance", "/admin/faculty-attendance"],
  ["Biometric Settings", "/admin/biometric-settings"],
  ["Manual Attendance", "/admin/manual-attendance"],
  ["Leave Monitoring", "/admin/leave-monitoring"],
  ["Reports", "/admin/reports"],
  ["Analytics", "/admin/analytics"],
  ["Notifications", "/admin/notifications"],
  ["System Settings", "/admin/system-settings"],
  ["Activity Logs", "/admin/activity-logs"],
];

export default function Sidebar({ role, open, onClose }) {
  const links = role === "faculty" ? facultyNav : role === "admin" ? adminNav : studentNav;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">AttendX</div>
        <nav>
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={onClose} className="nav-item">
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      {open && <div className="overlay" onClick={onClose} />}
    </>
  );
}
