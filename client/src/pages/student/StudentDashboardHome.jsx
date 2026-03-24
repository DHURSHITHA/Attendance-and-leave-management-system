import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../auth/AuthContext";
import useAsyncData from "../../hooks/useAsyncData";
import { studentApi } from "../../services/api";
import { getUserAvatar } from "../../utils/avatars";

export default function StudentDashboardHome() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => studentApi.dashboard(currentUser.id),
    [currentUser.id]
  );

  if (loading) return <div className="card">Loading dashboard...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <div className="dashboard-hero">
        <div className="hero-panel">
          <PageHeader title="Dashboard Home" subtitle="Today's overview and attendance insights" />
          <div className="hero-actions">
            <Link className="pill-btn" to="/student/calendar">
              View Calendar
            </Link>
            <Link className="pill-btn ghost" to="/student/leave">
              Apply Leave
            </Link>
            <Link className="pill-btn ghost" to="/student/performance">
              Performance
            </Link>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-ring" style={{ "--progress": data.attendancePercent }}>
            <span>{data.attendancePercent}%</span>
          </div>
          <div>
            <h3>Attendance Health</h3>
            <p className="muted">Goal-driven view of your current term attendance.</p>
            <div className="pill-row">
              <span className="pill">{data.todayStatus}</span>
              <span className="pill">{data.warning.includes("Warning") ? "Needs Attention" : "On Track"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cards-grid">
        <div className="card profile-card">
          <img src={getUserAvatar(currentUser)} alt="profile" />
          <h3>{data.profile?.name}</h3>
          <p>{data.profile?.department}</p>
          <span>{data.profile?.email}</span>
        </div>
        <StatCard label="Today's Attendance" value={data.todayStatus} />
        <StatCard label="Attendance %" value={`${data.attendancePercent}%`} />
        <StatCard label="Attendance Warning" value={data.warning.includes("Warning") ? "Active" : "Safe"} hint={data.warning} />
      </div>
      <div className="section-grid">
        <div className="card">
          <h3>Weekly Insights</h3>
          <ul className="simple-list">
            {data.weeklyInsights?.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Notifications</h3>
          <ul className="simple-list">
            {data.notifications?.map((n) => (
              <li key={n._id || n.notificationId}>{n.message || n.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
