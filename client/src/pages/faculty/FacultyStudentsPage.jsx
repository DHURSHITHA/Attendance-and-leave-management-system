import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyStudentsPage() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => facultyApi.students(currentUser.id),
    [currentUser.id]
  );
  const mentees = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Mentee List" subtitle="Only students assigned to this mentor are visible" />
      {loading && <div className="card">Loading mentees...</div>}
      {error && <div className="card error-text">{error}</div>}
      <DataTable
        columns={["Roll Number", "Student Name", "Attendance %", "Status"]}
        rows={mentees.map((m) => [m.rollNumber, m.name, `${m.attendancePercent}%`, m.status])}
      />
    </div>
  );
}
