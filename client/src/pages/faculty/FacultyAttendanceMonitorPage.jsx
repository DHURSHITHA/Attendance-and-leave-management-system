import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyAttendanceMonitorPage() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => facultyApi.attendanceMonitor(currentUser.id),
    [currentUser.id]
  );

  if (loading) return <div className="card">Loading monitor...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <PageHeader title="Attendance Monitor" subtitle="Live window status and shift attendance distribution" />
      <div className="cards-grid">
        <StatCard label="Morning Present" value={data.morningPresent} />
        <StatCard label="Afternoon Present" value={data.afternoonPresent} />
        <StatCard label="Full Day" value={data.fullDay} />
        <StatCard label="Half Day" value={data.halfDay} />
        <StatCard label="Absent" value={data.absent} />
        <StatCard label="Window Status" value={data.windowStatus} />
      </div>
    </div>
  );
}
