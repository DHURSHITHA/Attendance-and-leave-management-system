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

  const updateStatus = async (leaveId, status) => {
    const mentorComment = prompt("Add a comment (optional):", status === "approved" ? "Approved" : "Rejected");
    const payload = { status };
    if (mentorComment !== null) payload.mentorComment = mentorComment;
    await facultyApi.updateLeaveRequest(currentUser.id, leaveId, payload);
    load();
  };

  return (
    <div className="page-grid">
      <PageHeader title="Leave Requests" subtitle="Approve, reject, and comment on leave applications" />
      <DataTable
        columns={["Student", "From", "To", "Type", "Reason", "Status", "Action"]}
        rows={rows.map((r) => {
          const disabled = r.status && r.status !== "pending";
          return [
            r.studentId,
            r.fromDate,
            r.toDate,
            r.leaveType || "-",
            r.reason,
            r.status,
            <div className="admin-actions" key={r.leaveId || r._id}>
              <button className="btn-sm btn-secondary" disabled={disabled} onClick={() => updateStatus(r.leaveId, "approved")}>
                Approve
              </button>
              <button className="btn-sm btn-danger" disabled={disabled} onClick={() => updateStatus(r.leaveId, "rejected")}>
                Reject
              </button>
            </div>,
          ];
        })}
      />
    </div>
  );
}
