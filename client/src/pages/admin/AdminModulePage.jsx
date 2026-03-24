import { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import useAsyncData from "../../hooks/useAsyncData";
import { adminApi } from "../../services/api";

function JsonPreview({ data }) {
  return <pre className="card" style={{ overflow: "auto" }}>{JSON.stringify(data, null, 2)}</pre>;
}

function SectionTitle({ title, subtitle }) {
  return <PageHeader title={title} subtitle={subtitle} />;
}

export default function AdminModulePage({ section }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [q, setQ] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("present");
  const [selectedMentor, setSelectedMentor] = useState(null);

  const loader = useMemo(
    () => () => {
      switch (section) {
        case "students":
          return adminApi.students({ q });
        case "faculty":
          return adminApi.faculties({ q });
        case "mentor-assignment":
          return adminApi.mentorAssignment();
        case "departments":
          return adminApi.departments();
        case "attendance-monitor":
          return adminApi.attendanceMonitor({});
        case "faculty-attendance":
          return adminApi.facultyAttendance({ date });
        case "biometric-settings":
          return Promise.all([adminApi.biometricSettings(), adminApi.biometricLogs({})]).then(([settings, logs]) => ({
            settings,
            logs,
          }));
        case "leave-monitoring":
          return adminApi.leaveMonitoring({});
        case "reports":
          return adminApi.reports();
        case "analytics":
          return adminApi.analytics();
        case "notifications":
          return adminApi.notifications();
        case "system-settings":
          return adminApi.systemSettings();
        case "activity-logs":
          return adminApi.activityLogs(200);
        default:
          return Promise.resolve([]);
      }
    },
    [date, q, section]
  );

  const { data, loading, error } = useAsyncData(loader, [loader, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  if (loading) return <div className="card">Loading {section}...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  if (section === "students") {
    return (
      <div className="page-grid">
        <SectionTitle title="Student Management" subtitle="Add, edit, delete and search students" />
        <div className="card controls">
          <input placeholder="Search by name/roll/department" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={refresh}>Search</button>
        </div>
        <div className="card form-grid form-stack">
          <input id="s-name" placeholder="Name" />
          <input id="s-email" placeholder="Email" />
          <input id="s-roll" placeholder="Roll Number" />
          <input id="s-dept" placeholder="Department" />
          <input id="s-sem" placeholder="Semester" type="number" />
          <input id="s-mentor" placeholder="Mentor ID (FACxxx)" />
          <button
            onClick={async () => {
              const payload = {
                name: document.getElementById("s-name").value,
                email: document.getElementById("s-email").value,
                rollNumber: document.getElementById("s-roll").value,
                department: document.getElementById("s-dept").value,
                semester: Number(document.getElementById("s-sem").value || 1),
                mentorId: document.getElementById("s-mentor").value,
                password: "password123",
              };
              await adminApi.addStudent(payload);
              refresh();
            }}
          >
            Add Student
          </button>
        </div>
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Roll</th><th>Department</th><th>Semester</th><th>Mentor</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.studentId}</td>
                  <td>{s.name}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.department}</td>
                  <td>{s.semester}</td>
                  <td>{s.mentorId}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-sm btn-secondary" onClick={async () => { const mentorId = prompt("New mentorId", s.mentorId || ""); if (mentorId !== null) { await adminApi.updateStudent(s.studentId, { mentorId }); refresh(); } }}>Assign</button>
                      <button className="btn-sm btn-secondary" onClick={async () => { const name = prompt("New name", s.name || ""); if (name !== null) { await adminApi.updateStudent(s.studentId, { name }); refresh(); } }}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={async () => { if (confirm(`Delete ${s.studentId}?`)) { await adminApi.deleteStudent(s.studentId); refresh(); } }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "faculty") {
    return (
      <div className="page-grid">
        <SectionTitle title="Faculty Management" subtitle="Manage faculty profiles and allocations" />
        <div className="card controls">
          <input placeholder="Search by name/department/id" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={refresh}>Search</button>
        </div>
        <div className="card form-grid">
          <input id="f-name" placeholder="Name" />
          <input id="f-email" placeholder="Email" />
          <input id="f-dept" placeholder="Department" />
          <input id="f-designation" placeholder="Designation" />
          <button
            onClick={async () => {
              await adminApi.addFaculty({
                name: document.getElementById("f-name").value,
                email: document.getElementById("f-email").value,
                department: document.getElementById("f-dept").value,
                designation: document.getElementById("f-designation").value,
                password: "password123",
              });
              refresh();
            }}
          >
            Add Faculty
          </button>
        </div>
        <div className="table-wrap card">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Mentees</th><th>Actions</th></tr></thead>
            <tbody>
              {data.map((f) => (
                <tr key={f.facultyId}>
                  <td>{f.facultyId}</td><td>{f.name}</td><td>{f.department}</td><td>{f.menteeCount}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-sm btn-secondary" onClick={async () => { const name = prompt("New name", f.name || ""); if (name !== null) { await adminApi.updateFaculty(f.facultyId, { name }); refresh(); } }}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={async () => { if (confirm(`Delete ${f.facultyId}?`)) { await adminApi.deleteFaculty(f.facultyId); refresh(); } }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "mentor-assignment") {
    const rows = Array.isArray(data) ? data : [];
    return (
      <div className="page-grid">
        <SectionTitle title="Mentor-Mentee Assignment" subtitle="Reassign students between mentors and balance load" />
        <div className="card form-grid">
          <input id="assign-student" placeholder="Student ID (STUxxx)" />
          <input id="assign-mentor" placeholder="Mentor ID (FACxxx)" />
          <button
            onClick={async () => {
              await adminApi.reassignMentor(
                document.getElementById("assign-student").value,
                document.getElementById("assign-mentor").value
              );
              refresh();
            }}
          >
            Reassign
          </button>
        </div>
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Faculty</th><th>Name</th><th>Department</th><th>Mentee Count</th><th>Mentees</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.facultyId} className="clickable-row" onClick={() => setSelectedMentor(r)}>
                  <td>{r.facultyId}</td>
                  <td>{r.name}</td>
                  <td>{r.department}</td>
                  <td>{r.menteeCount}</td>
                  <td>{(Array.isArray(r.mentees) ? r.mentees : []).map((m) => m.studentId).join(", ")}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">No mentor-assignment data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedMentor && (
          <div className="modal-overlay" onClick={() => setSelectedMentor(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3>Mentor Details</h3>
                  <p className="muted">Students currently assigned to this mentor.</p>
                </div>
                <button type="button" className="modal-close" onClick={() => setSelectedMentor(null)}>
                  ×
                </button>
              </div>
              <div className="modal-meta">
                <div>
                  <span className="muted">Faculty ID</span>
                  <strong>{selectedMentor.facultyId}</strong>
                </div>
                <div>
                  <span className="muted">Faculty Name</span>
                  <strong>{selectedMentor.name}</strong>
                </div>
                <div>
                  <span className="muted">Department</span>
                  <strong>{selectedMentor.department}</strong>
                </div>
                <div>
                  <span className="muted">Mentee Count</span>
                  <strong>{selectedMentor.menteeCount}</strong>
                </div>
              </div>
              <div className="modal-list">
                <div className="modal-list-head">
                  <span>Student ID</span>
                  <span>Student Name</span>
                </div>
                {(Array.isArray(selectedMentor.mentees) ? selectedMentor.mentees : []).map((m) => (
                  <div className="modal-list-row" key={`${selectedMentor.facultyId}-${m.studentId}`}>
                    <span>{m.studentId}</span>
                    <span>{m.name || "-"}</span>
                  </div>
                ))}
                {(!selectedMentor.mentees || selectedMentor.mentees.length === 0) && (
                  <div className="modal-empty muted">No students assigned.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (section === "departments") {
    return (
      <div className="page-grid">
        <SectionTitle title="Department Management" subtitle="Add, edit and remove departments" />
        <div className="card form-grid">
          <input id="d-name" placeholder="Department Name" />
          <input id="d-code" placeholder="Code" />
          <input id="d-hod" placeholder="HOD Name" />
          <button
            onClick={async () => {
              await adminApi.addDepartment({
                name: document.getElementById("d-name").value,
                code: document.getElementById("d-code").value,
                hodName: document.getElementById("d-hod").value,
              });
              refresh();
            }}
          >
            Add Department
          </button>
        </div>
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Name</th><th>Code</th><th>HOD</th><th>Actions</th></tr></thead>
            <tbody>
              {data.map((d) => (
                <tr key={d._id || d.name}>
                  <td>{d.name}</td>
                  <td>{d.code || "-"}</td>
                  <td>{d.hodName || "-"}</td>
                  <td>
                    {d._id ? (
                      <div className="admin-actions">
                        <button className="btn-sm btn-secondary" onClick={async () => { const name = prompt("Department name", d.name); if (name !== null) { await adminApi.updateDepartment(d._id, { name }); refresh(); } }}>Edit</button>
                        <button className="btn-sm btn-danger" onClick={async () => { if (confirm(`Delete ${d.name}?`)) { await adminApi.deleteDepartment(d._id); refresh(); } }}>Delete</button>
                      </div>
                    ) : (
                      <span className="muted">Derived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "attendance-monitor") {
    return (
      <div className="page-grid">
        <SectionTitle title="Institution Attendance Monitor" subtitle="Track present/absent/leave/half-day across all students" />
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Date</th><th>Student</th><th>ID</th><th>Department</th><th>Semester</th><th>Status</th><th>Remarks</th></tr></thead>
            <tbody>
              {data.map((r) => (
                <tr key={r._id}>
                  <td>{r.date}</td><td>{r.studentName}</td><td>{r.studentId}</td><td>{r.department}</td><td>{r.semester ?? "-"}</td><td>{r.finalStatus}</td><td>{r.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "faculty-attendance") {
    return (
      <div className="page-grid">
        <SectionTitle title="Faculty Attendance Monitoring" subtitle="Mark and monitor daily faculty attendance" />
        <div className="card controls">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={refresh}>Load Date</button>
        </div>
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Faculty ID</th><th>Name</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.facultyId}>
                  <td>{r.facultyId}</td><td>{r.name}</td><td>{r.department}</td><td>{r.status}</td>
                  <td>
                    <div className="admin-actions">
                      <select className="admin-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="present">present</option>
                        <option value="absent">absent</option>
                        <option value="leave">leave</option>
                        <option value="late">late</option>
                      </select>
                      <button className="btn-sm btn-secondary" onClick={async () => { await adminApi.updateFacultyAttendance(r.facultyId, { date, status }); refresh(); }}>Save</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "biometric-settings") {
    const settings = data?.settings || {};
    const logs = Array.isArray(data?.logs) ? data.logs : [];
    return (
      <div className="page-grid">
        <SectionTitle title="Biometric Configuration" subtitle="Configure biometric windows and inspect logs" />
        <div className="card form-grid">
          <input id="bio-m-start" defaultValue={settings.morningStart || "08:30"} placeholder="Morning Start" />
          <input id="bio-m-end" defaultValue={settings.morningEnd || "08:45"} placeholder="Morning End" />
          <input id="bio-a-start" defaultValue={settings.afternoonStart || "12:45"} placeholder="Afternoon Start" />
          <input id="bio-a-end" defaultValue={settings.afternoonEnd || "13:15"} placeholder="Afternoon End" />
          <select id="bio-enabled" defaultValue={String(settings.enabled ?? true)}>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
          <input id="bio-device" defaultValue={settings.deviceStatus || "online"} placeholder="Device Status" />
          <button
            onClick={async () => {
              await adminApi.updateBiometricSettings({
                morningStart: document.getElementById("bio-m-start").value,
                morningEnd: document.getElementById("bio-m-end").value,
                afternoonStart: document.getElementById("bio-a-start").value,
                afternoonEnd: document.getElementById("bio-a-end").value,
                enabled: document.getElementById("bio-enabled").value === "true",
                deviceStatus: document.getElementById("bio-device").value,
              });
              refresh();
            }}
          >
            Save Settings
          </button>
        </div>
        <div className="card">
          <h3>Latest Biometric Logs</h3>
          <ul className="simple-list">
            {logs.slice(0, 30).map((l) => (
              <li key={l._id || l.logId}>{`${l.date} ${l.time} | ${l.studentId} | ${l.status}`}</li>
            ))}
            {logs.length === 0 && <li className="muted">No biometric logs found.</li>}
          </ul>
        </div>
      </div>
    );
  }

  if (section === "manual-attendance") {
    return (
      <div className="page-grid">
        <SectionTitle title="Manual Attendance Control" subtitle="Override student attendance records" />
        <div className="card form-grid">
          <input id="ma-student" placeholder="Student ID (STUxxx)" />
          <input id="ma-date" type="date" />
          <select id="ma-status" defaultValue="present">
            <option value="present">present</option>
            <option value="absent">absent</option>
            <option value="leave">leave</option>
            <option value="half_day">half_day</option>
          </select>
          <input id="ma-remarks" placeholder="Remarks" />
          <button
            onClick={async () => {
              await adminApi.manualAttendance({
                studentId: document.getElementById("ma-student").value,
                date: document.getElementById("ma-date").value,
                finalStatus: document.getElementById("ma-status").value,
                remarks: document.getElementById("ma-remarks").value,
              });
              alert("Attendance updated");
            }}
          >
            Apply Update
          </button>
        </div>
      </div>
    );
  }

  if (section === "leave-monitoring") {
    return (
      <div className="page-grid">
        <SectionTitle title="Leave Management Monitoring" subtitle="Track and override leave decisions" />
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Leave ID</th><th>Student</th><th>From</th><th>To</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.leaveId || r._id}>
                  <td>{r.leaveId}</td><td>{r.studentId}</td><td>{r.fromDate}</td><td>{r.toDate}</td><td>{r.status}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-sm btn-secondary" onClick={async () => { await adminApi.updateLeaveMonitoring(r.leaveId, { status: "approved" }); refresh(); }}>Approve</button>
                      <button className="btn-sm btn-danger" onClick={async () => { await adminApi.updateLeaveMonitoring(r.leaveId, { status: "rejected" }); refresh(); }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "reports") {
    return (
      <div className="page-grid">
        <SectionTitle title="Attendance Report Generation" subtitle="Generate and review institutional reports" />
        <div className="card controls">
          <select id="r-type" defaultValue="institution-summary">
            <option value="institution-summary">Institution Summary</option>
            <option value="department">Department</option>
            <option value="semester">Semester</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
          <select id="r-format" defaultValue="pdf">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
          <button onClick={async () => { await adminApi.createReport({ type: document.getElementById("r-type").value, format: document.getElementById("r-format").value }); refresh(); }}>
            Generate Report
          </button>
        </div>
        <ul className="simple-list card">
          {data.map((r) => (
            <li key={r.reportId || r._id}>{`${r.reportId} | ${r.type} | ${r.format} | ${r.status} | ${r.generatedAt}`}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (section === "analytics") {
    const monthlyTrend = Array.isArray(data?.monthlyTrend) ? data.monthlyTrend : [];
    const deptComparison = Array.isArray(data?.deptComparison) ? data.deptComparison : [];
    const facultyStats = data?.facultyStats || {};
    return (
      <div className="page-grid">
        <SectionTitle title="Attendance Analytics" subtitle="Institution-level trends and risk insights" />
        <div className="card">
          <h3>Monthly Trend</h3>
          <ul className="simple-list">
            {monthlyTrend.map((m) => (
              <li key={m.month}>{`${m.month}: ${m.percent}%`}</li>
            ))}
            {monthlyTrend.length === 0 && <li className="muted">No monthly trend data.</li>}
          </ul>
        </div>
        <div className="card">
          <h3>Department Comparison</h3>
          <ul className="simple-list">
            {deptComparison.map((d) => (
              <li key={d.department}>{`${d.department}: ${d.percent}%`}</li>
            ))}
            {deptComparison.length === 0 && <li className="muted">No department comparison data.</li>}
          </ul>
        </div>
        <JsonPreview data={facultyStats} />
      </div>
    );
  }

  if (section === "notifications") {
    return (
      <div className="page-grid">
        <SectionTitle title="Notifications & Announcements" subtitle="Send targeted admin communications" />
        <div className="card form-grid">
          <select id="n-role" defaultValue="student">
            <option value="student">student</option>
            <option value="faculty">faculty</option>
          </select>
          <input id="n-target" placeholder='Recipient ID ("all" for broadcast)' defaultValue="all" />
          <input id="n-title" placeholder="Title" />
          <textarea id="n-message" placeholder="Message" />
          <button
            onClick={async () => {
              await adminApi.sendNotification({
                recipientRole: document.getElementById("n-role").value,
                recipientId: document.getElementById("n-target").value,
                title: document.getElementById("n-title").value,
                message: document.getElementById("n-message").value,
              });
              refresh();
            }}
          >
            Send Notification
          </button>
        </div>
        <ul className="simple-list card">
          {data.map((n) => (
            <li key={n.notificationId || n._id}>{`${n.createdAt} | ${n.recipientRole}:${n.recipientId} | ${n.title}`}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (section === "system-settings") {
    return (
      <div className="page-grid">
        <SectionTitle title="System Configuration" subtitle="Manage core attendance policies and academic settings" />
        <div className="card form-grid">
          <input id="sys-min" type="number" defaultValue={data.minimumAttendancePercent} placeholder="Minimum Attendance %" />
          <input id="sys-year" defaultValue={data.academicYear} placeholder="Academic Year" />
          <input id="sys-sem" defaultValue={data.semesterStructure} placeholder="Semester Structure" />
          <input id="sys-rule" defaultValue={data.attendanceWindowRule} placeholder="Attendance Rule" />
          <input
            id="sys-grace"
            type="number"
            defaultValue={data.attendanceGraceMinutes}
            placeholder="Attendance Grace (minutes)"
          />
          <input
            id="sys-late"
            type="number"
            defaultValue={data.lateArrivalThresholdMinutes}
            placeholder="Late Arrival Threshold (minutes)"
          />
          <input
            id="sys-leave"
            type="number"
            defaultValue={data.maxLeaveDaysPerSemester}
            placeholder="Max Leave Days / Semester"
          />
          <input
            id="sys-alert"
            type="number"
            defaultValue={data.autoLowAttendanceAlertPercent}
            placeholder="Low Attendance Alert %"
          />
          <select id="sys-override" defaultValue={String(data.manualOverrideAllowed ?? true)}>
            <option value="true">Allow Manual Override: Yes</option>
            <option value="false">Allow Manual Override: No</option>
          </select>
          <select id="sys-biometric" defaultValue={String(data.biometricRequired ?? true)}>
            <option value="true">Biometric Required: Yes</option>
            <option value="false">Biometric Required: No</option>
          </select>
          <select id="sys-report-email" defaultValue={String(data.reportAutoEmail ?? false)}>
            <option value="true">Auto Email Reports: Yes</option>
            <option value="false">Auto Email Reports: No</option>
          </select>
          <select id="sys-channel" defaultValue={data.notificationChannel || "both"}>
            <option value="email">Notification Channel: Email</option>
            <option value="sms">Notification Channel: SMS</option>
            <option value="both">Notification Channel: Both</option>
          </select>
          <input id="sys-timezone" defaultValue={data.timezone} placeholder="Time Zone (e.g. Asia/Calcutta)" />
          <input id="sys-retention" type="number" defaultValue={data.dataRetentionDays} placeholder="Data Retention (days)" />
          <input id="sys-holiday" defaultValue={data.holidayCalendarUrl} placeholder="Holiday Calendar URL" />
          <input id="sys-backdate" type="number" defaultValue={data.maxBackdateDays} placeholder="Max Backdate Days" />
          <button
            onClick={async () => {
              const readNumber = (id, fallback = 0) => {
                const value = Number(document.getElementById(id).value);
                return Number.isFinite(value) ? value : fallback;
              };
              await adminApi.updateSystemSettings({
                minimumAttendancePercent: readNumber("sys-min", 75),
                academicYear: document.getElementById("sys-year").value,
                semesterStructure: document.getElementById("sys-sem").value,
                attendanceWindowRule: document.getElementById("sys-rule").value,
                attendanceGraceMinutes: readNumber("sys-grace", 10),
                lateArrivalThresholdMinutes: readNumber("sys-late", 20),
                maxLeaveDaysPerSemester: readNumber("sys-leave", 6),
                autoLowAttendanceAlertPercent: readNumber("sys-alert", 75),
                manualOverrideAllowed: document.getElementById("sys-override").value === "true",
                biometricRequired: document.getElementById("sys-biometric").value === "true",
                reportAutoEmail: document.getElementById("sys-report-email").value === "true",
                notificationChannel: document.getElementById("sys-channel").value,
                timezone: document.getElementById("sys-timezone").value,
                dataRetentionDays: readNumber("sys-retention", 365),
                holidayCalendarUrl: document.getElementById("sys-holiday").value,
                maxBackdateDays: readNumber("sys-backdate", 3),
              });
              refresh();
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  }

  if (section === "activity-logs") {
    return (
      <div className="page-grid">
        <SectionTitle title="Activity Logs" subtitle="Audit trail for admin operations and system events" />
        <ul className="simple-list card">
          {data.map((l) => (
            <li key={l._id}>{`${l.at || l.createdAt} | ${l.action} | ${l.targetType}:${l.targetId} | ${l.details || ""}`}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="page-grid">
      <SectionTitle title="Admin Module" subtitle={section} />
      <JsonPreview data={data} />
    </div>
  );
}
