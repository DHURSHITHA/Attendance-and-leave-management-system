import PageHeader from "../../components/common/PageHeader";
import ProgressBar from "../../components/common/ProgressBar";
import StatCard from "../../components/common/StatCard";
import useAsyncData from "../../hooks/useAsyncData";
import { studentApi } from "../../services/api";
import { useAuth } from "../../auth/AuthContext";

export default function StudentAttendancePage() {
  const { currentUser } = useAuth();
  const { data: s, loading, error } = useAsyncData(
    () => studentApi.attendanceSummary(currentUser.id),
    [currentUser.id]
  );

  if (loading) return <div className="card">Loading attendance...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <PageHeader title="Attendance Summary" subtitle="Track progress with predictive attendance trend" />
      <div className="cards-grid">
        <StatCard label="Total Working Days" value={s.totalWorkingDays} />
        <StatCard label="Present Days" value={s.presentDays} />
        <StatCard label="Absent Days" value={s.absentDays} />
        <StatCard label="Leave Days" value={s.leaveDays} />
        <StatCard label="Half Days" value={s.halfDays} />
        <StatCard label="Attendance %" value={`${s.attendancePercent}%`} />
      </div>
      <div className="card">
        <h3>Attendance Progress</h3>
        <ProgressBar value={s.attendancePercent} />
      </div>
      <div className="card">
        <h3>Prediction</h3>
        <p>{s.prediction}</p>
      </div>
    </div>
  );
}
