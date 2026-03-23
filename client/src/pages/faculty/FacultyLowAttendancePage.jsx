import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";
import { useNavigate } from "react-router-dom";

export default function FacultyLowAttendancePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useAsyncData(
    () => facultyApi.lowAttendance(currentUser.id),
    [currentUser.id]
  );
  const rows = Array.isArray(data) ? data : [];

  const sendWarning = async (studentId, attendancePercent) => {
    const defaultMsg = `Your attendance is ${attendancePercent}%. Please meet your mentor and improve attendance.`;
    const message = prompt("Warning message (optional):", defaultMsg);
    if (message === null) return;
    await facultyApi.sendNotification(currentUser.id, {
      recipientRole: "student",
      recipientId: studentId,
      type: "warning",
      title: "Low Attendance Warning",
      message,
    });
    alert(`Warning sent to ${studentId}.`);
  };

  const viewReport = async (studentId) => {
    await facultyApi.createReport(currentUser.id, {
      type: "individual",
      filters: { studentId },
    });
    navigate("/faculty/reports");
  };

  return (
    <div className="page-grid">
      <PageHeader title="Low Attendance Monitor" subtitle="Students with attendance below 75%" />
      {loading && <div className="card">Loading low attendance...</div>}
      {error && <div className="card error-text">{error}</div>}
      <DataTable
        columns={["Student", "Attendance", "Actions"]}
        rows={rows.map((r) => [
          r.studentId,
          `${r.attendancePercent}%`,
          <div className="admin-actions" key={r.studentId}>
            <button className="btn-sm btn-secondary" onClick={() => sendWarning(r.studentId, r.attendancePercent)}>
              Send Warning
            </button>
            <button className="btn-sm btn-secondary" onClick={() => viewReport(r.studentId)}>
              View Report
            </button>
          </div>,
        ])}
      />
    </div>
  );
}
