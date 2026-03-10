import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { studentApi } from "../../services/api";

export default function StudentBiometricLogsPage() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("2026-03");
  const [page, setPage] = useState(1);
  const [resp, setResp] = useState({ data: [], totalPages: 1 });
  const [error, setError] = useState("");

  useEffect(() => {
    studentApi
      .biometricLogs(currentUser.id, { month, q: query, page, limit: 8 })
      .then(setResp)
      .catch((e) => setError(e.message));
  }, [currentUser.id, month, query, page]);

  return (
    <div className="page-grid">
      <PageHeader title="Biometric Logs" subtitle="Search, filter by month, and paginate logs" />
      {error && <div className="card error-text">{error}</div>}
      <div className="card controls">
        <input placeholder="Search logs" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      <DataTable
        columns={["Date", "Time", "Device", "Status"]}
        rows={resp.data.map((p) => [p.date, p.time, p.device, p.status])}
      />
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span>{`Page ${page} of ${resp.totalPages}`}</span>
        <button onClick={() => setPage((p) => Math.min(resp.totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
}
