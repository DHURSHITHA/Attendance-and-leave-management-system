import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyLowAttendancePage() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => facultyApi.lowAttendance(currentUser.id),
    [currentUser.id]
  );
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Low Attendance Monitor" subtitle="Students with attendance below 75%" />
      {loading && <div className="card">Loading low attendance...</div>}
      {error && <div className="card error-text">{error}</div>}
      <DataTable
        columns={["Student", "Attendance", "Actions"]}
        rows={rows.map((r) => [r.studentId, `${r.attendancePercent}%`, "Send Warning | View Report"])}
      />
    </div>
  );
}
