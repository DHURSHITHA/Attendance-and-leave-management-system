import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import ProgressBar from "../../components/common/ProgressBar";
import DataTable from "../../components/common/DataTable";

export default function ParentAttendancePage() {
  const attendancePercent = 92;

  const columns = ["Date", "Status", "Check-in", "Check-out", "Source", "Note"];
  const rows = [
    [
      "2026-03-22",
      <span className="status-chip present" key="p1">Present</span>,
      "08:42 AM",
      "04:36 PM",
      "Biometric",
      "On time",
    ],
    [
      "2026-03-21",
      <span className="status-chip present" key="p2">Present</span>,
      "08:57 AM",
      "04:40 PM",
      "Biometric",
      "Late by 12 mins",
    ],
    [
      "2026-03-20",
      <span className="status-chip leave" key="p3">Leave</span>,
      "-",
      "-",
      "Manual",
      "Medical leave approved",
    ],
    [
      "2026-03-19",
      <span className="status-chip present" key="p4">Present</span>,
      "08:39 AM",
      "04:33 PM",
      "Biometric",
      "On time",
    ],
    [
      "2026-03-18",
      <span className="status-chip absent" key="p5">Absent</span>,
      "-",
      "-",
      "System",
      "No check-in recorded",
    ],
  ];

  return (
    <div className="page-grid">
      <PageHeader
        title="Attendance Overview"
        subtitle="Daily check-ins, leave tracking, and attendance consistency"
      />
      <div className="cards-grid">
        <StatCard label="Attendance %" value={`${attendancePercent}%`} />
        <StatCard label="Present Days" value="52" />
        <StatCard label="Absent Days" value="4" />
        <StatCard label="Leave Days" value="2" />
        <StatCard label="Late Arrivals" value="3" />
      </div>
      <div className="card">
        <h3>Attendance Progress</h3>
        <ProgressBar value={attendancePercent} />
      </div>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
