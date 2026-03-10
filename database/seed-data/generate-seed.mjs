import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "database", "seed-data");
fs.mkdirSync(outDir, { recursive: true });

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

const firstNames = [
  "Arjun", "Sara", "Rahul", "Neha", "Ishaan", "Priya", "Vikram", "Aisha", "Karan", "Meera",
  "Rohan", "Ananya", "Dev", "Pooja", "Nikhil", "Kavya", "Aman", "Riya", "Harsh", "Diya",
  "Ritvik", "Sanya", "Manav", "Tanya", "Aditya", "Naina", "Yash", "Sneha", "Krish", "Ira"
];

const lastNames = [
  "Patel", "Sharma", "Khan", "Nair", "Verma", "Reddy", "Gupta", "Iyer", "Joshi", "Singh"
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function pad(n) {
  return String(n).padStart(3, "0");
}

const faculties = Array.from({ length: 30 }, (_, i) => {
  const id = `FAC${pad(i + 1)}`;
  const name = `Dr. ${pick(firstNames, i)} ${pick(lastNames, i + 2)}`;
  return {
    facultyId: id,
    name,
    email: `faculty${i + 1}@college.edu`,
    passwordHash: "$2b$10$demoHashedPasswordReplaceInProd",
    phone: `+91-90010${String(1000 + i).slice(-4)}`,
    department: pick(departments, i),
    role: "faculty",
    designation: "Mentor",
    createdAt: new Date(2025, 5, (i % 28) + 1).toISOString(),
    updatedAt: new Date(2026, 1, (i % 28) + 1).toISOString(),
  };
});

const students = Array.from({ length: 60 }, (_, i) => {
  const id = `STU${pad(i + 1)}`;
  const mentor = faculties[i % faculties.length];
  const fn = pick(firstNames, i + 4);
  const ln = pick(lastNames, i + 1);
  const semester = (i % 8) + 1;
  const section = String.fromCharCode(65 + (i % 3));
  return {
    studentId: id,
    rollNumber: `${mentor.department.slice(0, 2).toUpperCase()}${2022 + (i % 4)}${pad(i + 1)}`,
    name: `${fn} ${ln}`,
    email: `student${i + 1}@college.edu`,
    passwordHash: "$2b$10$demoHashedPasswordReplaceInProd",
    phone: `+91-91020${String(2000 + i).slice(-4)}`,
    department: mentor.department,
    semester,
    section,
    mentorId: mentor.facultyId,
    role: "student",
    status: i % 12 === 0 ? "inactive" : "active",
    createdAt: new Date(2025, 6, (i % 28) + 1).toISOString(),
    updatedAt: new Date(2026, 2, ((i + 5) % 28) + 1).toISOString(),
  };
});

const attendanceStatus = ["present", "absent", "half_day", "leave"];
const attendanceRecords = Array.from({ length: 360 }, (_, i) => {
  const student = students[i % students.length];
  const day = (i % 30) + 1;
  const month = i % 2 === 0 ? 1 : 2; // Feb/Mar
  const status = attendanceStatus[i % attendanceStatus.length];
  const morningPresent = status === "present" || status === "half_day";
  const afternoonPresent = status === "present";
  const date = new Date(2026, month, day).toISOString().slice(0, 10);
  return {
    attendanceId: `ATT${pad(i + 1)}`,
    studentId: student.studentId,
    mentorId: student.mentorId,
    date,
    morningStatus: morningPresent ? "present" : "absent",
    afternoonStatus: afternoonPresent ? "present" : status === "half_day" ? "absent" : "absent",
    finalStatus: status,
    source: "biometric",
    remarks: status === "absent" ? "No biometric punch" : "Auto-generated",
    createdAt: new Date(2026, month, day, 18, 0, 0).toISOString(),
  };
});

const biometricLogs = Array.from({ length: 480 }, (_, i) => {
  const student = students[i % students.length];
  const day = (i % 30) + 1;
  const month = i % 2 === 0 ? 1 : 2;
  const date = new Date(2026, month, day).toISOString().slice(0, 10);
  const inHour = 8 + (i % 3);
  const outHour = 16 + (i % 2);
  const isIn = i % 2 === 0;
  return {
    logId: `BIO${pad(i + 1)}`,
    studentId: student.studentId,
    mentorId: student.mentorId,
    department: student.department,
    date,
    time: `${String(isIn ? inHour : outHour).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    device: `Gate-${String.fromCharCode(65 + (i % 4))}`,
    status: isIn ? "in" : "out",
    verification: i % 17 === 0 ? "manual" : "biometric",
    createdAt: new Date(2026, month, day, isIn ? inHour : outHour, (i * 7) % 60).toISOString(),
  };
});

const leaveTypes = ["Medical", "Personal", "Family Event", "Official", "Emergency"];
const leaveRequests = Array.from({ length: 90 }, (_, i) => {
  const student = students[i % students.length];
  const fromDay = (i % 24) + 1;
  const toDay = fromDay + (i % 3);
  const status = i % 4 === 0 ? "approved" : i % 4 === 1 ? "rejected" : "pending";
  return {
    leaveId: `LEV${pad(i + 1)}`,
    studentId: student.studentId,
    mentorId: student.mentorId,
    fromDate: new Date(2026, 2, fromDay).toISOString().slice(0, 10),
    toDate: new Date(2026, 2, Math.min(28, toDay)).toISOString().slice(0, 10),
    reason: pick(leaveTypes, i),
    attachmentUrl: i % 3 === 0 ? `https://files.college.edu/leaves/${i + 1}.pdf` : null,
    status,
    mentorComment: status === "approved" ? "Approved. Keep records updated." : status === "rejected" ? "Insufficient details." : "Awaiting review",
    appliedAt: new Date(2026, 1, (i % 28) + 1, 10, 0, 0).toISOString(),
    reviewedAt: status === "pending" ? null : new Date(2026, 1, ((i + 2) % 28) + 1, 14, 0, 0).toISOString(),
  };
});

const academicPerformance = [];
students.forEach((s, i) => {
  for (let sem = 1; sem <= 8; sem++) {
    academicPerformance.push({
      recordId: `PERF${s.studentId}${sem}`,
      studentId: s.studentId,
      mentorId: s.mentorId,
      department: s.department,
      semester: sem,
      sgpa: Number((6.5 + ((i + sem) % 25) / 10).toFixed(2)),
      cgpa: Number((6.8 + ((i + sem * 2) % 22) / 10).toFixed(2)),
      backlogs: (i + sem) % 9 === 0 ? 1 : 0,
      updatedAt: new Date(2026, (sem + 1) % 12, ((i + sem) % 28) + 1).toISOString(),
    });
  }
});

const notifTypes = ["warning", "leave_approval", "announcement", "reminder"];
const notifications = Array.from({ length: 180 }, (_, i) => {
  const user = i % 3 === 0 ? faculties[i % faculties.length] : students[i % students.length];
  const recipientRole = user.role || (user.facultyId ? "faculty" : "student");
  const recipientId = user.facultyId || user.studentId;
  const type = pick(notifTypes, i);
  return {
    notificationId: `NTF${pad(i + 1)}`,
    recipientRole,
    recipientId,
    senderId: i % 5 === 0 ? "SYSTEM" : faculties[i % faculties.length].facultyId,
    type,
    title:
      type === "warning"
        ? "Attendance Warning"
        : type === "leave_approval"
          ? "Leave Request Update"
          : type === "announcement"
            ? "Department Announcement"
            : "Attendance Reminder",
    message: `Notification ${i + 1}: ${type.replace("_", " ")} message for ${recipientId}.`,
    isRead: i % 4 === 0,
    createdAt: new Date(2026, i % 3, (i % 28) + 1, 9 + (i % 8), 10, 0).toISOString(),
  };
});

const lowAttendanceCases = students.slice(0, 40).map((s, i) => ({
  caseId: `LOW${pad(i + 1)}`,
  studentId: s.studentId,
  mentorId: s.mentorId,
  month: "2026-03",
  attendancePercent: Number((62 + (i % 14) * 0.8).toFixed(2)),
  warningCount: (i % 4) + 1,
  lastWarningDate: new Date(2026, 2, ((i + 3) % 28) + 1).toISOString().slice(0, 10),
  status: i % 3 === 0 ? "critical" : "watchlist",
}));

const reportRequests = Array.from({ length: 45 }, (_, i) => ({
  reportId: `RPT${pad(i + 1)}`,
  facultyId: faculties[i % faculties.length].facultyId,
  type: i % 3 === 0 ? "individual" : i % 3 === 1 ? "department" : "semester",
  filters: {
    department: pick(departments, i),
    semester: (i % 8) + 1,
    studentId: students[i % students.length].studentId,
  },
  format: "pdf",
  status: i % 5 === 0 ? "processing" : "completed",
  generatedAt: new Date(2026, 2, (i % 28) + 1, 11, 30).toISOString(),
  downloadUrl: i % 5 === 0 ? null : `https://files.college.edu/reports/RPT${pad(i + 1)}.pdf`,
}));

const collections = {
  faculties,
  students,
  attendance_records: attendanceRecords,
  biometric_logs: biometricLogs,
  leave_requests: leaveRequests,
  academic_performance: academicPerformance,
  notifications,
  low_attendance_cases: lowAttendanceCases,
  report_requests: reportRequests,
};

for (const [name, docs] of Object.entries(collections)) {
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(docs, null, 2));
}

const summary = Object.fromEntries(Object.entries(collections).map(([k, v]) => [k, v.length]));
fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("Seed files generated:", summary);
