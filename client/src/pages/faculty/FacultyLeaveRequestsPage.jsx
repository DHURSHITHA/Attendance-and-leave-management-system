import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { facultyApi } from "../../services/api";
import { useAuth } from "../../auth/AuthContext";

export default function FacultyLeaveRequestsPage() {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState([]);

  const load = () => facultyApi.leaveRequests(currentUser.id).then(setRows);

  useEffect(() => {
    load();
  }, [currentUser.id]);

  return (
    <div className="page-grid">
      <PageHeader title="Leave Requests" subtitle="Approve, reject, and comment on leave applications" />
      <DataTable
        columns={["Student", "From", "To", "Reason", "Status"]}
        rows={rows.map((r) => [r.studentId, r.fromDate, r.toDate, r.reason, r.status])}
      />
    </div>
  );
}
