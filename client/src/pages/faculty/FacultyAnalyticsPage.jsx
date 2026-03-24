import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
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
      <div className="cards-grid">
        <StatCard label="Present" value={analytics.distribution.present || 0} />
        <StatCard label="Half Day" value={analytics.distribution.halfDay || 0} />
        <StatCard label="Absent" value={analytics.distribution.absent || 0} />
        <StatCard label="Leave" value={analytics.distribution.leave || 0} />
      </div>

      <div className="section-grid">
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h3>Daily Attendance Trend</h3>
              <p className="muted">Last 7 days snapshot</p>
            </div>
            <span className="pill">Daily</span>
          </div>
          <div className="trend-chart">
            {analytics.dailyTrend.map((v) => (
              <div key={v.date} className="trend-item">
                <div className="trend-bar" style={{ height: `${v.percent}%` }} title={`${v.date}: ${v.percent}%`} />
                <span className="trend-label">{String(v.date).slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h3>Monthly Attendance</h3>
              <p className="muted">Semester-wide performance</p>
            </div>
            <span className="pill">Monthly</span>
          </div>
          <div className="trend-chart">
            {analytics.monthlyAttendance.map((v) => (
              <div key={v.month} className="trend-item">
                <div className="trend-bar alt" style={{ height: `${v.percent}%` }} title={`${v.month}: ${v.percent}%`} />
                <span className="trend-label">{v.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-header">
          <div>
            <h3>Distribution</h3>
            <p className="muted">Attendance status breakdown</p>
          </div>
        </div>
        <div className="distribution-grid">
          <div className="distribution-pill">Present {analytics.distribution.present || 0}</div>
          <div className="distribution-pill">Half Day {analytics.distribution.halfDay || 0}</div>
          <div className="distribution-pill">Absent {analytics.distribution.absent || 0}</div>
          <div className="distribution-pill">Leave {analytics.distribution.leave || 0}</div>
        </div>
      </div>
    </div>
  );
}
