import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { currentUser } = useAuth();
  const roleTitle = {
    student: "Student Dashboard",
    faculty: "Faculty Dashboard",
    admin: "Admin Dashboard",
    parent: "Parent Dashboard",
  };
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu" type="button">
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
          <rect width="20" height="2" rx="1" />
          <rect y="6" width="20" height="2" rx="1" />
          <rect y="12" width="20" height="2" rx="1" />
        </svg>
      </button>
      <div className="topbar-title">{roleTitle[currentUser?.role] || "Dashboard"}</div>
      <div className="topbar-user">
        <img src={currentUser?.photo} alt="user" />
        <span>{currentUser?.name}</span>
      </div>
    </header>
  );
}
