import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { studentApi } from "../../services/api";

export default function StudentLeavePage() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ fromDate: "", toDate: "", reason: "", attachmentUrl: "" });
  const [history, setHistory] = useState([]);

  const load = () => studentApi.leaveHistory(currentUser.id).then(setHistory);

  useEffect(() => {
    load();
  }, [currentUser.id]);

  return (
    <div className="page-grid">
      <PageHeader title="Leave Management" subtitle="Apply leave and track request history" />
      <form
        className="card form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await studentApi.applyLeave(currentUser.id, form);
          setForm({ fromDate: "", toDate: "", reason: "", attachmentUrl: "" });
          load();
        }}
      >
        <input type="date" value={form.fromDate} onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))} required />
        <input type="date" value={form.toDate} onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))} required />
        <input placeholder="Reason" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} required />
        <input placeholder="Attachment URL" value={form.attachmentUrl} onChange={(e) => setForm((f) => ({ ...f, attachmentUrl: e.target.value }))} />
        <button type="submit">Submit Leave Request</button>
      </form>
      <DataTable
        columns={["From", "To", "Reason", "Status"]}
        rows={history.map((l) => [l.fromDate, l.toDate, l.reason, l.status])}
      />
    </div>
  );
}
