import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { currentUser } = useAuth();
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>
        ?
      </button>
      <div className="topbar-title">{currentUser?.role === "faculty" ? "Faculty Dashboard" : "Student Dashboard"}</div>
      <div className="topbar-user">
        <img src={currentUser?.photo} alt="user" />
        <span>{currentUser?.name}</span>
      </div>
    </header>
  );
}
