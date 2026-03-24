import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyDashboardHome() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => facultyApi.dashboard(currentUser.id),
    [currentUser.id]
  );

  if (loading) return <div className="card">Loading dashboard...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <div className="dashboard-hero">
        <div className="hero-panel">
          <PageHeader title="Mentor Dashboard Home" subtitle="Quick view of mentee attendance health" />
          <div className="hero-actions">
            <Link className="pill-btn" to="/faculty/attendance-monitor">
              Monitor Attendance
            </Link>
            <Link className="pill-btn ghost" to="/faculty/low-attendance">
              Low Attendance
            </Link>
            <Link className="pill-btn ghost" to="/faculty/reports">
              Reports
            </Link>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-ring" style={{ "--progress": data.averageAttendance }}>
            <span>{data.averageAttendance}%</span>
          </div>
          <div>
            <h3>Average Attendance</h3>
            <p className="muted">Across your mentees for the active term.</p>
            <div className="pill-row">
              <span className="pill">Present {data.presentToday}</span>
              <span className="pill">Absent {data.absentToday}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cards-grid">
        <StatCard label="Total Mentees" value={data.totalMentees} />
        <StatCard label="Present Today" value={data.presentToday} />
        <StatCard label="Absent Today" value={data.absentToday} />
        <StatCard label="Average Attendance" value={`${data.averageAttendance}%`} />
      </div>
      <div className="section-grid">
        <div className="card">
          <h3>Recent Activity</h3>
          <ul className="simple-list">
            {data.recentActivity?.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Quick Focus</h3>
          <ul className="simple-list">
            <li>Review students below 75% attendance.</li>
            <li>Send reminder to pending leave requests.</li>
            <li>Export weekly attendance report.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
