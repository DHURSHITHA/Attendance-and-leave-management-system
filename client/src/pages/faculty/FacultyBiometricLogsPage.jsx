import { useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { facultyApi } from "../../services/api";
import { useAuth } from "../../auth/AuthContext";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyBiometricLogsPage() {
  const { currentUser } = useAuth();
  const [date, setDate] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");

  const params = useMemo(() => ({ date, studentId, department }), [date, studentId, department]);

  const { data, loading, error } = useAsyncData(
    () => facultyApi.biometricLogs(currentUser.id, params),
    [currentUser.id, date, studentId, department]
  );
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Biometric Logs" subtitle="Restricted to mentor's mentees only" />
      <div className="card controls">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
      </div>
      {loading && <div className="card">Loading logs...</div>}
      {error && <div className="card error-text">{error}</div>}
      <DataTable
        columns={["Date", "Student", "Time", "Device", "Status"]}
        rows={rows.map((l) => [l.date, l.studentId, l.time, l.device, l.status])}
      />
    </div>
  );
}
