import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import useAsyncData from "../../hooks/useAsyncData";
import { adminApi } from "../../services/api";

export default function AdminDashboardHome() {
  const { data, loading, error } = useAsyncData(() => adminApi.dashboard(), []);
  if (loading) return <div className="card">Loading admin dashboard...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  const stats = [
    ["Total Students", data.totals.students],
    ["Total Faculty", data.totals.faculties],
    ["Total Departments", data.totals.departments],
    ["Students Present Today", data.today.studentPresent],
    ["Students Absent Today", data.today.studentAbsent],
    ["Students on Leave", data.today.studentLeave],
    ["Faculty Present Today", data.today.facultyPresent],
    ["Faculty Absent Today", data.today.facultyAbsent],
    ["Avg Attendance %", data.averageAttendancePercent],
  ];

  return (
    <div className="page-grid">
      <PageHeader
        title="Admin System Overview"
        subtitle="Institution-wide attendance, operations and governance view"
      />
      <div className="cards-grid">
        {stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>

      <div className="card">
        <h3>Daily Attendance Trend</h3>
        <div className="mini-chart">
          {data.charts.dailyTrend.map((v) => (
            <div key={v.date} style={{ height: `${v.percent}%` }} title={`${v.date}: ${v.percent}%`} />
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Department-wise Attendance Comparison</h3>
        <div className="bar-chart">
          {data.charts.deptComparison.map((r) => (
            <div key={r.department} className="bar-item">
              <div className="bar" style={{ height: `${r.percent}%` }} />
              <span>{r.department}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Monthly Attendance Statistics</h3>
        <ul className="simple-list">
          {data.charts.monthlyStats.map((r) => (
            <li key={r.month}>{`${r.month}: ${r.percent}%`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
