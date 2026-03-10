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
      <PageHeader title="Mentor Dashboard Home" subtitle="Quick view of mentee attendance health" />
      <div className="cards-grid">
        <StatCard label="Total Mentees" value={data.totalMentees} />
        <StatCard label="Present Today" value={data.presentToday} />
        <StatCard label="Absent Today" value={data.absentToday} />
        <StatCard label="Average Attendance" value={`${data.averageAttendance}%`} />
      </div>
      <div className="card">
        <h3>Recent Activity</h3>
        <ul className="simple-list">
          {data.recentActivity?.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
