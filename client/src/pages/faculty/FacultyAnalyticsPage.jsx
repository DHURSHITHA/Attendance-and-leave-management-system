import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyAnalyticsPage() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => facultyApi.analytics(currentUser.id),
    [currentUser.id]
  );
  const analytics = data || { dailyTrend: [], monthlyAttendance: [], distribution: {} };

  if (loading) return <div className="card">Loading analytics...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <PageHeader title="Attendance Analytics" subtitle="Daily trend, monthly trend, and distribution" />
      <div className="card">
        <h3>Daily Attendance Trend</h3>
        <div className="mini-chart">
          {analytics.dailyTrend.map((v) => (
            <div key={v.date} style={{ height: `${v.percent}%` }} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3>Monthly Attendance</h3>
        <div className="mini-chart">
          {analytics.monthlyAttendance.map((v) => (
            <div key={v.month} style={{ height: `${v.percent}%` }} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3>Distribution</h3>
        <p>
          Present {analytics.distribution.present || 0} | Half Day {analytics.distribution.halfDay || 0} | Absent {analytics.distribution.absent || 0} | Leave {analytics.distribution.leave || 0}
        </p>
      </div>
    </div>
  );
}
