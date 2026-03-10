import { Router } from "express";
import { Faculty } from "../models/Faculty.js";
import { Student } from "../models/Student.js";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { BiometricLog } from "../models/BiometricLog.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { LowAttendanceCase } from "../models/LowAttendanceCase.js";
import { ReportRequest } from "../models/ReportRequest.js";
import { Notification } from "../models/Notification.js";

const router = Router();

async function mentorStudents(facultyId) {
  return Student.find({ mentorId: facultyId }).lean();
}

router.get("/:facultyId/dashboard", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findOne({ facultyId }).lean();
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    const students = await mentorStudents(facultyId);
    const ids = students.map((s) => s.studentId);
    const today = new Date().toISOString().slice(0, 10);
    const todayRows = await AttendanceRecord.find({ mentorId: facultyId, date: today, studentId: { $in: ids } }).lean();

    const presentToday = todayRows.filter((r) => r.finalStatus === "present").length;
    const absentToday = todayRows.filter((r) => r.finalStatus === "absent").length;

    const allRows = await AttendanceRecord.find({ mentorId: facultyId, studentId: { $in: ids } }).lean();
    const avg = allRows.length
      ? Number(
          (
            (allRows.filter((r) => r.finalStatus === "present").length /
              allRows.length) *
            100
          ).toFixed(2)
        )
      : 0;

    res.json({
      totalMentees: students.length,
      presentToday,
      absentToday,
      averageAttendance: avg,
      recentActivity: [
        "Leave requests pending review",
        "Low attendance alerts generated",
        "Biometric sync completed",
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load faculty dashboard", error: error.message });
  }
});

router.get("/:facultyId/students", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const students = await mentorStudents(facultyId);
    const result = await Promise.all(
      students.map(async (s) => {
        const records = await AttendanceRecord.find({ studentId: s.studentId }).lean();
        const percent = records.length
          ? Number(
              ((records.filter((r) => r.finalStatus === "present").length / records.length) * 100).toFixed(2)
            )
          : 0;
        return {
          ...s,
          attendancePercent: percent,
          status: percent < 75 ? "Warning" : "Safe",
        };
      })
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load mentee list", error: error.message });
  }
});

router.get("/:facultyId/attendance-monitor", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const rows = await AttendanceRecord.find({ mentorId: facultyId }).lean();
    res.json({
      morningPresent: rows.filter((r) => r.morningStatus === "present").length,
      afternoonPresent: rows.filter((r) => r.afternoonStatus === "present").length,
      fullDay: rows.filter((r) => r.finalStatus === "present").length,
      halfDay: rows.filter((r) => r.finalStatus === "half_day").length,
      absent: rows.filter((r) => r.finalStatus === "absent").length,
      windowStatus: "Open",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load attendance monitor", error: error.message });
  }
});

router.get("/:facultyId/biometric-logs", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { date, studentId, department } = req.query;
    const filter = { mentorId: facultyId };
    if (date) filter.date = date;
    if (studentId) filter.studentId = studentId;
    if (department) filter.department = department;

    const rows = await BiometricLog.find(filter).sort({ date: -1, time: -1 }).limit(300).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load faculty biometric logs", error: error.message });
  }
});

router.get("/:facultyId/low-attendance", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const rows = await LowAttendanceCase.find({ mentorId: facultyId }).sort({ attendancePercent: 1 }).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load low attendance", error: error.message });
  }
});

router.get("/:facultyId/leave-requests", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const rows = await LeaveRequest.find({ mentorId: facultyId }).sort({ appliedAt: -1 }).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leave requests", error: error.message });
  }
});

router.patch("/:facultyId/leave-requests/:leaveId", async (req, res) => {
  try {
    const { facultyId, leaveId } = req.params;
    const { status, mentorComment } = req.body;
    const updated = await LeaveRequest.findOneAndUpdate(
      { mentorId: facultyId, leaveId },
      { status, mentorComment, reviewedAt: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Leave request not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update leave request", error: error.message });
  }
});

router.get("/:facultyId/analytics", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const rows = await AttendanceRecord.find({ mentorId: facultyId }).lean();

    const dailyMap = new Map();
    rows.forEach((r) => {
      if (!dailyMap.has(r.date)) {
        dailyMap.set(r.date, { present: 0, total: 0 });
      }
      const d = dailyMap.get(r.date);
      d.total += 1;
      if (r.finalStatus === "present") d.present += 1;
    });

    const dailyTrend = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, v]) => ({ date, percent: Number(((v.present / v.total) * 100).toFixed(2)) }));

    const monthlyMap = new Map();
    rows.forEach((r) => {
      const month = r.date.slice(0, 7);
      if (!monthlyMap.has(month)) monthlyMap.set(month, { present: 0, total: 0 });
      const m = monthlyMap.get(month);
      m.total += 1;
      if (r.finalStatus === "present") m.present += 1;
    });

    const monthlyAttendance = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, percent: Number(((v.present / v.total) * 100).toFixed(2)) }));

    const distribution = {
      present: rows.filter((r) => r.finalStatus === "present").length,
      halfDay: rows.filter((r) => r.finalStatus === "half_day").length,
      absent: rows.filter((r) => r.finalStatus === "absent").length,
      leave: rows.filter((r) => r.finalStatus === "leave").length,
    };

    res.json({ dailyTrend, monthlyAttendance, distribution });
  } catch (error) {
    res.status(500).json({ message: "Failed to load analytics", error: error.message });
  }
});

router.get("/:facultyId/reports", async (req, res) => {
  try {
    const rows = await ReportRequest.find({ facultyId: req.params.facultyId }).sort({ generatedAt: -1 }).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load reports", error: error.message });
  }
});

router.post("/:facultyId/reports", async (req, res) => {
  try {
    const count = await ReportRequest.countDocuments();
    const reportId = `RPT${String(count + 1).padStart(3, "0")}`;
    const created = await ReportRequest.create({
      reportId,
      facultyId: req.params.facultyId,
      type: req.body.type,
      filters: req.body.filters || {},
      format: "pdf",
      status: "completed",
      generatedAt: new Date().toISOString(),
      downloadUrl: null,
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to create report", error: error.message });
  }
});

router.post("/:facultyId/students", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const count = await Student.countDocuments();
    const studentId = `STU${String(count + 1).padStart(3, "0")}`;
    const created = await Student.create({
      ...req.body,
      studentId,
      mentorId: facultyId,
      role: "student",
      status: "active",
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to add student", error: error.message });
  }
});

router.patch("/:facultyId/students/:studentId", async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { mentorId: req.params.facultyId, studentId: req.params.studentId },
      req.body,
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: "Student not found in mentor scope" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
});

router.delete("/:facultyId/students/:studentId", async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({ mentorId: req.params.facultyId, studentId: req.params.studentId }).lean();
    if (!deleted) return res.status(404).json({ message: "Student not found in mentor scope" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
});

router.get("/:facultyId/notifications", async (req, res) => {
  try {
    const rows = await Notification.find({ recipientRole: "faculty", recipientId: req.params.facultyId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load faculty notifications", error: error.message });
  }
});

router.post("/:facultyId/notifications", async (req, res) => {
  try {
    const count = await Notification.countDocuments();
    const notificationId = `NTF${String(count + 1).padStart(3, "0")}`;
    const created = await Notification.create({
      notificationId,
      recipientRole: req.body.recipientRole || "student",
      recipientId: req.body.recipientId,
      senderId: req.params.facultyId,
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
});

export default router;
