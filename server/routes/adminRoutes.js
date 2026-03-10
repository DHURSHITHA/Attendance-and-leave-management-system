import { Router } from "express";
import { Student } from "../models/Student.js";
import { Faculty } from "../models/Faculty.js";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { BiometricLog } from "../models/BiometricLog.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { LowAttendanceCase } from "../models/LowAttendanceCase.js";
import { ReportRequest } from "../models/ReportRequest.js";
import { Notification } from "../models/Notification.js";
import { Department } from "../models/Department.js";
import { BiometricSetting } from "../models/BiometricSetting.js";
import { SystemSetting } from "../models/SystemSetting.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { FacultyAttendance } from "../models/FacultyAttendance.js";

const router = Router();

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function logAction(action, targetType, targetId, details = "") {
  try {
    await ActivityLog.create({
      actorId: "ADM001",
      actorRole: "admin",
      action,
      targetType,
      targetId,
      details,
      at: new Date().toISOString(),
    });
  } catch (_err) {
    // Logging should never block operations.
  }
}

router.get("/dashboard", async (_req, res) => {
  try {
    const today = todayISO();
    const [students, faculties, departments, todayRows, facultyTodayRows, allRows] = await Promise.all([
      Student.find().lean(),
      Faculty.find().lean(),
      Department.find({ isActive: true }).lean(),
      AttendanceRecord.find({ date: today }).lean(),
      FacultyAttendance.find({ date: today }).lean(),
      AttendanceRecord.find().lean(),
    ]);

    const studentPresent = todayRows.filter((r) => r.finalStatus === "present").length;
    const studentAbsent = todayRows.filter((r) => r.finalStatus === "absent").length;
    const studentLeave = todayRows.filter((r) => r.finalStatus === "leave").length;

    const facultyPresent = facultyTodayRows.filter((r) => r.status === "present").length;
    const facultyAbsent = Math.max(0, faculties.length - facultyPresent);

    const avgAttendance = allRows.length
      ? Number(
          (
            (allRows.filter((r) => r.finalStatus === "present").length +
              allRows.filter((r) => r.finalStatus === "half_day").length * 0.5) /
            allRows.length *
            100
          ).toFixed(2)
        )
      : 0;

    const dates = Array.from(new Set(allRows.map((r) => r.date))).sort().slice(-7);
    const dailyTrend = dates.map((date) => {
      const rows = allRows.filter((r) => r.date === date);
      const percent = rows.length
        ? Number(
            (
              (rows.filter((r) => r.finalStatus === "present").length +
                rows.filter((r) => r.finalStatus === "half_day").length * 0.5) /
              rows.length *
              100
            ).toFixed(2)
          )
        : 0;
      return { date, percent };
    });

    const deptNames = Array.from(
      new Set([...students.map((s) => s.department), ...departments.map((d) => d.name)].filter(Boolean))
    );
    const studentById = new Map(students.map((s) => [s.studentId, s]));
    const deptComparison = deptNames.map((name) => {
      const rows = todayRows.filter((r) => studentById.get(r.studentId)?.department === name);
      const percent = rows.length
        ? Number(((rows.filter((r) => r.finalStatus === "present").length / rows.length) * 100).toFixed(2))
        : 0;
      return { department: name, percent };
    });

    const currentYear = new Date().getFullYear();
    const monthly = new Map();
    allRows.forEach((r) => {
      if (!r.date?.startsWith(String(currentYear))) return;
      const key = r.date.slice(0, 7);
      if (!monthly.has(key)) monthly.set(key, { present: 0, total: 0 });
      const v = monthly.get(key);
      v.total += 1;
      if (r.finalStatus === "present") v.present += 1;
    });
    const monthlyStats = Array.from(monthly.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({
        month,
        percent: v.total ? Number(((v.present / v.total) * 100).toFixed(2)) : 0,
      }));

    res.json({
      totals: {
        students: students.length,
        faculties: faculties.length,
        departments: deptNames.length,
      },
      today: {
        studentPresent,
        studentAbsent,
        studentLeave,
        facultyPresent,
        facultyAbsent,
      },
      averageAttendancePercent: avgAttendance,
      charts: {
        dailyTrend,
        deptComparison,
        monthlyStats,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load admin dashboard", error: error.message });
  }
});

router.get("/students", async (req, res) => {
  try {
    const { q = "", department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);
    const text = String(q).trim().toLowerCase();
    let rows = await Student.find(filter).sort({ studentId: 1 }).lean();
    if (text) {
      rows = rows.filter((s) =>
        `${s.name} ${s.rollNumber} ${s.department} ${s.studentId}`.toLowerCase().includes(text)
      );
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load students", error: error.message });
  }
});

router.post("/students", async (req, res) => {
  try {
    const count = await Student.countDocuments();
    const studentId = `STU${String(count + 1).padStart(3, "0")}`;
    const created = await Student.create({
      ...req.body,
      studentId,
      role: "student",
      status: req.body.status || "active",
    });
    await logAction("create_student", "student", studentId, `Created student ${created.name || ""}`);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to add student", error: error.message });
  }
});

router.patch("/students/:studentId", async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate({ studentId: req.params.studentId }, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Student not found" });
    await logAction("update_student", "student", req.params.studentId, "Updated student profile");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
});

router.delete("/students/:studentId", async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({ studentId: req.params.studentId }).lean();
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    await logAction("delete_student", "student", req.params.studentId, "Deleted student");
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
});

router.get("/faculties", async (req, res) => {
  try {
    const { q = "", department } = req.query;
    const filter = {};
    if (department) filter.department = department;
    const text = String(q).trim().toLowerCase();
    let rows = await Faculty.find(filter).sort({ facultyId: 1 }).lean();
    if (text) rows = rows.filter((f) => `${f.name} ${f.department} ${f.facultyId}`.toLowerCase().includes(text));
    const menteeCounts = await Student.aggregate([{ $group: { _id: "$mentorId", count: { $sum: 1 } } }]);
    const map = new Map(menteeCounts.map((r) => [r._id, r.count]));
    res.json(rows.map((r) => ({ ...r, menteeCount: map.get(r.facultyId) || 0 })));
  } catch (error) {
    res.status(500).json({ message: "Failed to load faculties", error: error.message });
  }
});

router.post("/faculties", async (req, res) => {
  try {
    const count = await Faculty.countDocuments();
    const facultyId = `FAC${String(count + 1).padStart(3, "0")}`;
    const created = await Faculty.create({
      ...req.body,
      facultyId,
      role: "faculty",
    });
    await logAction("create_faculty", "faculty", facultyId, `Created faculty ${created.name || ""}`);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to add faculty", error: error.message });
  }
});

router.patch("/faculties/:facultyId", async (req, res) => {
  try {
    const updated = await Faculty.findOneAndUpdate({ facultyId: req.params.facultyId }, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Faculty not found" });
    await logAction("update_faculty", "faculty", req.params.facultyId, "Updated faculty profile");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update faculty", error: error.message });
  }
});

router.delete("/faculties/:facultyId", async (req, res) => {
  try {
    const deleted = await Faculty.findOneAndDelete({ facultyId: req.params.facultyId }).lean();
    if (!deleted) return res.status(404).json({ message: "Faculty not found" });
    await logAction("delete_faculty", "faculty", req.params.facultyId, "Deleted faculty");
    res.json({ message: "Faculty deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete faculty", error: error.message });
  }
});

router.get("/mentor-assignment", async (_req, res) => {
  try {
    const [faculties, students] = await Promise.all([Faculty.find().sort({ facultyId: 1 }).lean(), Student.find().lean()]);
    const grouped = new Map();
    students.forEach((s) => {
      if (!grouped.has(s.mentorId)) grouped.set(s.mentorId, []);
      grouped.get(s.mentorId).push({ studentId: s.studentId, name: s.name, department: s.department });
    });

    res.json(
      faculties.map((f) => ({
        facultyId: f.facultyId,
        name: f.name,
        department: f.department,
        menteeCount: (grouped.get(f.facultyId) || []).length,
        mentees: grouped.get(f.facultyId) || [],
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to load mentor assignments", error: error.message });
  }
});

router.patch("/mentor-assignment/:studentId", async (req, res) => {
  try {
    const { mentorId } = req.body;
    if (!mentorId) return res.status(400).json({ message: "mentorId is required" });
    const mentor = await Faculty.findOne({ facultyId: mentorId }).lean();
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const updated = await Student.findOneAndUpdate({ studentId: req.params.studentId }, { mentorId }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Student not found" });
    await logAction("reassign_mentor", "student", req.params.studentId, `Assigned to ${mentorId}`);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign mentor", error: error.message });
  }
});

router.get("/departments", async (_req, res) => {
  try {
    const stored = await Department.find().sort({ name: 1 }).lean();
    if (stored.length > 0) return res.json(stored);

    const derived = Array.from(
      new Set(
        [...(await Student.find({}, { department: 1 }).lean()), ...(await Faculty.find({}, { department: 1 }).lean())]
          .map((x) => x.department)
          .filter(Boolean)
      )
    ).map((name) => ({ name, code: name.slice(0, 3).toUpperCase(), isActive: true }));
    res.json(derived);
  } catch (error) {
    res.status(500).json({ message: "Failed to load departments", error: error.message });
  }
});

router.post("/departments", async (req, res) => {
  try {
    const created = await Department.create({
      name: req.body.name,
      code: req.body.code || String(req.body.name || "").slice(0, 3).toUpperCase(),
      hodName: req.body.hodName || "",
      isActive: true,
    });
    await logAction("create_department", "department", String(created._id), `Created ${created.name}`);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to add department", error: error.message });
  }
});

router.patch("/departments/:id", async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Department not found" });
    await logAction("update_department", "department", req.params.id, `Updated ${updated.name}`);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update department", error: error.message });
  }
});

router.delete("/departments/:id", async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ message: "Department not found" });
    await logAction("delete_department", "department", req.params.id, `Deleted ${deleted.name}`);
    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department", error: error.message });
  }
});

router.get("/biometric-settings", async (_req, res) => {
  try {
    let settings = await BiometricSetting.findOne().lean();
    if (!settings) {
      settings = await BiometricSetting.create({
        settingId: "BIO001",
        morningStart: "08:30",
        morningEnd: "08:45",
        afternoonStart: "12:45",
        afternoonEnd: "13:15",
        enabled: true,
        deviceStatus: "online",
      });
      settings = settings.toObject();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to load biometric settings", error: error.message });
  }
});

router.put("/biometric-settings", async (req, res) => {
  try {
    const updated = await BiometricSetting.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();
    await logAction("update_biometric_settings", "settings", "BIO001", "Biometric settings updated");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update biometric settings", error: error.message });
  }
});

router.patch("/manual-attendance", async (req, res) => {
  try {
    const { studentId, date, finalStatus, remarks } = req.body;
    if (!studentId || !date || !finalStatus) {
      return res.status(400).json({ message: "studentId, date and finalStatus are required" });
    }
    const student = await Student.findOne({ studentId }).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const morningStatus = req.body.morningStatus || (finalStatus === "present" ? "present" : finalStatus === "half_day" ? "present" : finalStatus);
    const afternoonStatus = req.body.afternoonStatus || (finalStatus === "half_day" ? "absent" : finalStatus);

    const updated = await AttendanceRecord.findOneAndUpdate(
      { studentId, date },
      {
        studentId,
        mentorId: student.mentorId,
        date,
        morningStatus,
        afternoonStatus,
        finalStatus,
        source: "manual",
        remarks: remarks || "Updated by admin",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    await logAction("manual_attendance_update", "attendance", `${studentId}:${date}`, finalStatus);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update manual attendance", error: error.message });
  }
});

router.get("/attendance-monitor", async (req, res) => {
  try {
    const { department, semester, dateFrom, dateTo, studentName } = req.query;
    const studentFilter = {};
    if (department) studentFilter.department = department;
    if (semester) studentFilter.semester = Number(semester);
    const students = await Student.find(studentFilter).lean();
    const studentMap = new Map(students.map((s) => [s.studentId, s]));
    const studentIds = students.map((s) => s.studentId);

    const rowFilter = {};
    if (studentIds.length > 0) rowFilter.studentId = { $in: studentIds };
    if (dateFrom || dateTo) {
      rowFilter.date = {};
      if (dateFrom) rowFilter.date.$gte = dateFrom;
      if (dateTo) rowFilter.date.$lte = dateTo;
    }

    let rows = await AttendanceRecord.find(rowFilter).sort({ date: -1 }).limit(500).lean();
    if (studentName) {
      const text = String(studentName).toLowerCase();
      rows = rows.filter((r) => (studentMap.get(r.studentId)?.name || "").toLowerCase().includes(text));
    }
    res.json(
      rows.map((r) => ({
        ...r,
        studentName: studentMap.get(r.studentId)?.name || r.studentId,
        department: studentMap.get(r.studentId)?.department || "-",
        semester: studentMap.get(r.studentId)?.semester || null,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to load attendance monitor", error: error.message });
  }
});

router.get("/faculty-attendance", async (req, res) => {
  try {
    const date = req.query.date || todayISO();
    const [faculties, rows] = await Promise.all([
      Faculty.find().sort({ facultyId: 1 }).lean(),
      FacultyAttendance.find({ date }).lean(),
    ]);
    const map = new Map(rows.map((r) => [r.facultyId, r]));
    res.json(
      faculties.map((f) => ({
        facultyId: f.facultyId,
        name: f.name,
        department: f.department,
        date,
        status: map.get(f.facultyId)?.status || "absent",
        remarks: map.get(f.facultyId)?.remarks || "",
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to load faculty attendance", error: error.message });
  }
});

router.patch("/faculty-attendance/:facultyId", async (req, res) => {
  try {
    const date = req.body.date || todayISO();
    const updated = await FacultyAttendance.findOneAndUpdate(
      { facultyId: req.params.facultyId, date },
      {
        facultyId: req.params.facultyId,
        date,
        status: req.body.status || "present",
        remarks: req.body.remarks || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    await logAction("faculty_attendance_update", "faculty", req.params.facultyId, `${date}:${updated.status}`);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update faculty attendance", error: error.message });
  }
});

router.get("/leave-monitoring", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const rows = await LeaveRequest.find(filter).sort({ appliedAt: -1 }).limit(500).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leave monitoring", error: error.message });
  }
});

router.patch("/leave-monitoring/:leaveId", async (req, res) => {
  try {
    const updated = await LeaveRequest.findOneAndUpdate(
      { leaveId: req.params.leaveId },
      { status: req.body.status, mentorComment: req.body.mentorComment || "Updated by admin", reviewedAt: new Date().toISOString() },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: "Leave request not found" });
    await logAction("leave_override", "leave", req.params.leaveId, `Status ${req.body.status}`);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update leave request", error: error.message });
  }
});

router.get("/reports", async (_req, res) => {
  try {
    const rows = await ReportRequest.find().sort({ generatedAt: -1 }).limit(200).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load reports", error: error.message });
  }
});

router.post("/reports", async (req, res) => {
  try {
    const count = await ReportRequest.countDocuments();
    const reportId = `RPT${String(count + 1).padStart(3, "0")}`;
    const created = await ReportRequest.create({
      reportId,
      facultyId: "ADM001",
      type: req.body.type || "institution-summary",
      filters: req.body.filters || {},
      format: req.body.format || "pdf",
      status: "completed",
      generatedAt: new Date().toISOString(),
      downloadUrl: null,
    });
    await logAction("generate_report", "report", reportId, created.type);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate report", error: error.message });
  }
});

router.get("/analytics", async (_req, res) => {
  try {
    const [rows, lowCases, facultyRows] = await Promise.all([
      AttendanceRecord.find().lean(),
      LowAttendanceCase.find().sort({ attendancePercent: 1 }).limit(20).lean(),
      FacultyAttendance.find().lean(),
    ]);

    const monthlyMap = new Map();
    rows.forEach((r) => {
      const month = r.date?.slice(0, 7);
      if (!month) return;
      if (!monthlyMap.has(month)) monthlyMap.set(month, { present: 0, total: 0 });
      const m = monthlyMap.get(month);
      m.total += 1;
      if (r.finalStatus === "present") m.present += 1;
    });
    const monthlyTrend = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, percent: v.total ? Number(((v.present / v.total) * 100).toFixed(2)) : 0 }));

    const deptMap = new Map();
    const students = await Student.find().lean();
    const sMap = new Map(students.map((s) => [s.studentId, s.department]));
    rows.forEach((r) => {
      const dept = sMap.get(r.studentId) || "Unknown";
      if (!deptMap.has(dept)) deptMap.set(dept, { present: 0, total: 0 });
      const d = deptMap.get(dept);
      d.total += 1;
      if (r.finalStatus === "present") d.present += 1;
    });
    const deptComparison = Array.from(deptMap.entries()).map(([department, v]) => ({
      department,
      percent: v.total ? Number(((v.present / v.total) * 100).toFixed(2)) : 0,
    }));

    const facultyStats = {
      present: facultyRows.filter((r) => r.status === "present").length,
      absent: facultyRows.filter((r) => r.status === "absent").length,
      leave: facultyRows.filter((r) => r.status === "leave").length,
      late: facultyRows.filter((r) => r.status === "late").length,
    };

    res.json({ monthlyTrend, deptComparison, lowAttendanceStudents: lowCases, facultyStats });
  } catch (error) {
    res.status(500).json({ message: "Failed to load analytics", error: error.message });
  }
});

router.get("/notifications", async (_req, res) => {
  try {
    const rows = await Notification.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load notifications", error: error.message });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const count = await Notification.countDocuments();
    const notificationId = `NTF${String(count + 1).padStart(3, "0")}`;
    const created = await Notification.create({
      notificationId,
      recipientRole: req.body.recipientRole || "student",
      recipientId: req.body.recipientId || "all",
      senderId: "ADM001",
      type: req.body.type || "announcement",
      title: req.body.title,
      message: req.body.message,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    await logAction("send_notification", "notification", notificationId, created.title || "");
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
});

router.get("/system-settings", async (_req, res) => {
  try {
    let settings = await SystemSetting.findOne().lean();
    if (!settings) {
      settings = await SystemSetting.create({
        settingId: "SYS001",
        minimumAttendancePercent: 75,
        academicYear: "2025-2026",
        semesterStructure: "8 semesters",
        attendanceWindowRule: "Biometric only within configured windows",
      });
      settings = settings.toObject();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to load system settings", error: error.message });
  }
});

router.put("/system-settings", async (req, res) => {
  try {
    const updated = await SystemSetting.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();
    await logAction("update_system_settings", "settings", "SYS001", "System settings updated");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update system settings", error: error.message });
  }
});

router.get("/activity-logs", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 200);
    const rows = await ActivityLog.find().sort({ at: -1, createdAt: -1 }).limit(limit).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load activity logs", error: error.message });
  }
});

router.get("/biometric-logs", async (req, res) => {
  try {
    const { q = "", studentId, department, date } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (department) filter.department = department;
    if (date) filter.date = date;
    let rows = await BiometricLog.find(filter).sort({ date: -1, time: -1 }).limit(500).lean();
    const text = String(q).trim().toLowerCase();
    if (text) {
      rows = rows.filter((r) => `${r.studentId} ${r.date} ${r.time} ${r.device} ${r.status}`.toLowerCase().includes(text));
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load biometric logs", error: error.message });
  }
});

export default router;

