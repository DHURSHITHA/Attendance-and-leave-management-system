import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyReportsPage() {
  const { currentUser } = useAuth();
  const [report, setReport] = useState("individual");
  const { data, loading, error, setData } = useAsyncData(
    () => facultyApi.reports(currentUser.id),
    [currentUser.id]
  );
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Report Generator" subtitle="Generate and export attendance reports (PDF)" />
      <div className="card form-grid">
        <select value={report} onChange={(e) => setReport(e.target.value)}>
          <option value="individual">Individual Student Report</option>
          <option value="department">Department Report</option>
          <option value="semester">Semester Report</option>
        </select>
        <button
          onClick={async () => {
            const created = await facultyApi.createReport(currentUser.id, { type: report });
            setData([created, ...rows]);
          }}
        >
          Generate Report
        </button>
        <button>Export PDF</button>
      </div>
      {loading && <div className="card">Loading reports...</div>}
      {error && <div className="card error-text">{error}</div>}
      <div className="card">
        <ul className="simple-list">
          {rows.map((r) => (
            <li key={r._id || r.reportId}>{`${r.reportId} | ${r.type} | ${r.status}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
