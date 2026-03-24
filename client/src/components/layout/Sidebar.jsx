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

const parentNav = [
  ["Dashboard", "/parent/dashboard"],
  ["Attendance", "/parent/attendance"],
  ["Calendar", "/parent/calendar"],
  ["Messages", "/parent/messages"],
  ["Fees & Payments", "/parent/fees"],
  ["Notifications", "/parent/notifications"],
  ["Profile", "/parent/profile"],
];

const iconMap = {
  Dashboard: ["M4 5h7M4 10h11M4 15h9", "M3 3h14v14H3z"],
  Attendance: ["M4 9l3 3 6-6", "M4 3h9l4 4v10H4z"],
  Calendar: ["M6 3v3M12 3v3M4 7h12M5 9h10v8H5z"],
  "Biometric Logs": ["M7 3v2M11 3v2M5 7h10", "M5 9c0 3.3 2.7 6 6 6s6-2.7 6-6"],
  Leave: ["M4 12l6-6 6 6", "M4 12v4h12v-4"],
  Performance: ["M4 14l4-4 3 3 5-6", "M3 16h14"],
  Notifications: ["M10 3a4 4 0 0 1 4 4v3l1 2H5l1-2V7a4 4 0 0 1 4-4", "M8.5 15a1.5 1.5 0 0 0 3 0"],
  Profile: ["M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6", "M4 16c1.6-3 10.4-3 12 0"],
  Students: ["M6 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5", "M13 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4", "M3.5 16c0-2.2 3-3.6 5.5-3.6S14.5 13.8 14.5 16"],
  "Attendance Monitor": ["M3 10s3.2-5 7-5 7 5 7 5-3.2 5-7 5-7-5-7-5", "M10 8v3l2 1"],
  "Low Attendance": ["M10 4l6 11H4z", "M10 8v3M10 14h0.01"],
  "Leave Requests": ["M5 4h8l3 3v9H5z", "M7 10h6M7 13h4"],
  Analytics: ["M4 15V9M9 15V6M14 15V11", "M3 16h14"],
  Reports: ["M6 4h6l3 3v9H6z", "M8 11h6M8 14h4"],
  "Student Management": ["M6 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5", "M11 11l2-2m0 0l2 2m-2-2v6", "M3.5 16c0-2.1 2.8-3.5 5.5-3.5"],
  Faculty: ["M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6", "M4 16c1.6-3 10.4-3 12 0"],
  "Mentor Assignment": ["M5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6", "M13 16l-3-3 3-3", "M9 13h4"],
  Departments: ["M4 6h12M5 6v10h10V6", "M8 10h4M8 13h4"],
  "Faculty Attendance": ["M5 4h8l3 3v9H5z", "M7 11l2 2 4-4"],
  "Biometric Settings": ["M10 4v2M6 6h8M6 14h8M10 12v2", "M4 8c0 3.3 2.7 6 6 6s6-2.7 6-6"],
  "Manual Attendance": ["M6 12l6-6 2 2-6 6-3 1z", "M4 16h12"],
  "Leave Monitoring": ["M5 4h8l3 3v9H5z", "M7 10h6M7 13h6"],
  "System Settings": ["M10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8", "M10 3v2M10 15v2M3 10h2M15 10h2M5.5 5.5l1.5 1.5M13 13l1.5 1.5M5.5 14.5l1.5-1.5M13 7l1.5-1.5"],
  "Activity Logs": ["M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12", "M10 7v4l3 2"],
  Messages: ["M4 5h12v7H8l-4 3v-3H4z"],
  "Fees & Payments": ["M4 6h12v8H4z", "M6 10h6"],
};

const renderIcon = (label) => {
  const paths = iconMap[label];
  if (!paths) {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {paths.map((d, index) => (
        <path key={`${label}-icon-${index}`} d={d} />
      ))}
    </svg>
  );
};

export default function Sidebar({ role, open, onClose }) {
  const links =
    role === "faculty"
      ? facultyNav
      : role === "admin"
        ? adminNav
        : role === "parent"
          ? parentNav
          : studentNav;
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
              <span className="nav-icon">{renderIcon(label)}</span>
              <span>{label}</span>
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
