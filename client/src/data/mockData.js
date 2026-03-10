export const users = [
  {
    id: "fac-001",
    name: "Dr. Maya Sharma",
    role: "faculty",
    email: "faculty@college.edu",
    password: "password123",
    department: "Computer Science",
    phone: "+91-900000001",
    photo: "https://i.pravatar.cc/100?img=48",
  },
  {
    id: "stu-001",
    name: "Arjun Patel",
    role: "student",
    email: "student@college.edu",
    password: "password123",
    mentorId: "fac-001",
    department: "Computer Science",
    phone: "+91-900000101",
    photo: "https://i.pravatar.cc/100?img=13",
  },
  {
    id: "stu-002",
    name: "Sara Khan",
    role: "student",
    email: "sara@college.edu",
    password: "password123",
    mentorId: "fac-001",
    department: "Computer Science",
    phone: "+91-900000102",
    photo: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: "stu-003",
    name: "Rahul Nair",
    role: "student",
    email: "rahul@college.edu",
    password: "password123",
    mentorId: "fac-002",
    department: "Information Technology",
    phone: "+91-900000103",
    photo: "https://i.pravatar.cc/100?img=67",
  },
];

export const studentAttendanceSummary = {
  totalWorkingDays: 120,
  presentDays: 92,
  absentDays: 16,
  leaveDays: 8,
  halfDays: 4,
  attendancePercent: 78,
  prediction: "Expected to finish semester at 80-82% with current pace.",
  warning: "Warning: Maintain above 75% to avoid examination restriction.",
  weeklyInsights: [
    "Mon-Fri morning attendance was 96%.",
    "Two late biometric punches detected this week.",
    "Attendance improved by 4% over last week.",
  ],
};

export const studentCalendarData = [
  { date: "2026-03-01", status: "present" },
  { date: "2026-03-02", status: "present" },
  { date: "2026-03-03", status: "half" },
  { date: "2026-03-04", status: "absent" },
  { date: "2026-03-05", status: "leave" },
  { date: "2026-03-06", status: "present" },
  { date: "2026-03-07", status: "present" },
  { date: "2026-03-08", status: "present" },
];

export const biometricLogs = [
  { id: 1, studentId: "stu-001", date: "2026-03-01", time: "08:58", device: "Gate-A", status: "In" },
  { id: 2, studentId: "stu-001", date: "2026-03-01", time: "16:50", device: "Gate-A", status: "Out" },
  { id: 3, studentId: "stu-001", date: "2026-03-03", time: "09:45", device: "Lab-2", status: "In" },
  { id: 4, studentId: "stu-001", date: "2026-03-04", time: "--", device: "--", status: "Absent" },
  { id: 5, studentId: "stu-002", date: "2026-03-01", time: "09:02", device: "Gate-B", status: "In" },
  { id: 6, studentId: "stu-002", date: "2026-03-01", time: "16:47", device: "Gate-B", status: "Out" },
  { id: 7, studentId: "stu-002", date: "2026-03-05", time: "--", device: "--", status: "Leave" },
  { id: 8, studentId: "stu-003", date: "2026-03-02", time: "08:55", device: "Gate-C", status: "In" },
];

export const leaveHistory = [
  { id: 1, from: "2026-02-08", to: "2026-02-09", reason: "Medical", status: "Approved" },
  { id: 2, from: "2026-02-18", to: "2026-02-18", reason: "Family event", status: "Pending" },
];

export const performanceData = {
  cgpa: 8.41,
  sgpa: [7.9, 8.2, 8.4, 8.7, 8.9],
  semesters: [
    { sem: "Sem 1", sgpa: 7.9 },
    { sem: "Sem 2", sgpa: 8.2 },
    { sem: "Sem 3", sgpa: 8.4 },
    { sem: "Sem 4", sgpa: 8.7 },
    { sem: "Sem 5", sgpa: 8.9 },
  ],
};

export const notifications = [
  { id: 1, type: "warning", text: "Attendance dipped below 80% in Week 2." },
  { id: 2, type: "leave", text: "Your leave request for 2026-02-08 is approved." },
  { id: 3, type: "announcement", text: "Department seminar scheduled on 2026-03-12." },
];

export function getFacultyMentees(facultyId) {
  return users.filter((u) => u.role === "student" && u.mentorId === facultyId);
}

export function getFacultyMenteeLogs(facultyId) {
  const menteeIds = getFacultyMentees(facultyId).map((s) => s.id);
  return biometricLogs.filter((log) => menteeIds.includes(log.studentId));
}
