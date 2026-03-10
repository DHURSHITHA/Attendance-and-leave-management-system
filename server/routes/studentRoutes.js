import { Router } from "express";
import { Student } from "../models/Student.js";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { BiometricLog } from "../models/BiometricLog.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { AcademicPerformance } from "../models/AcademicPerformance.js";
import { Notification } from "../models/Notification.js";

const router = Router();

router.get("/:studentId/dashboard", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId }).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const [records, notifications] = await Promise.all([
      AttendanceRecord.find({ studentId }).lean(),
      Notification.find({
        recipientRole: { $in: ["student", "Student"] },
        $or: [
          { recipientId: studentId },
          { recipientId: student.email },
          { recipientId: "all" },
          { recipientId: "ALL_STUDENTS" },
          { recipientId: null },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const total = records.length;
    const present = records.filter((r) => r.finalStatus === "present").length;
    const absent = records.filter((r) => r.finalStatus === "absent").length;
    const half = records.filter((r) => r.finalStatus === "half_day").length;
    const leave = records.filter((r) => r.finalStatus === "leave").length;

    const attendancePercent = total ? Number((((present + half * 0.5) / total) * 100).toFixed(2)) : 0;

    res.json({
      profile: student,
      todayStatus: records.at(-1)?.finalStatus || "N/A",
      attendancePercent,
      warning: attendancePercent < 75 ? "Warning: Attendance below 75%" : "Safe zone",
      weeklyInsights: [
        `Present days: ${present}`,
        `Absent days: ${absent}`,
        `Half days: ${half}`,
      ],
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load student dashboard", error: error.message });
  }
});

router.get("/:studentId/attendance-summary", async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await AttendanceRecord.find({ studentId }).lean();
    const totalWorkingDays = records.length;
    const presentDays = records.filter((r) => r.finalStatus === "present").length;
    const absentDays = records.filter((r) => r.finalStatus === "absent").length;
    const leaveDays = records.filter((r) => r.finalStatus === "leave").length;
    const halfDays = records.filter((r) => r.finalStatus === "half_day").length;
    const attendancePercent = totalWorkingDays
      ? Number((((presentDays + halfDays * 0.5) / totalWorkingDays) * 100).toFixed(2))
      : 0;

    res.json({
      totalWorkingDays,
      presentDays,
      absentDays,
      leaveDays,
      halfDays,
      attendancePercent,
      prediction: attendancePercent < 75 ? "At current pace risk remains high" : "At current pace likely above 75%",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load attendance summary", error: error.message });
  }
});

router.get("/:studentId/calendar", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query;
    const filter = { studentId };
    if (month) filter.date = new RegExp(`^${month}`);
    const records = await AttendanceRecord.find(filter).sort({ date: 1 }).lean();

    res.json(
      records.map((r) => ({
        date: r.date,
        status: r.finalStatus === "half_day" ? "half" : r.finalStatus,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to load calendar", error: error.message });
  }
});

router.get("/:studentId/biometric-logs", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, q = "", page = 1, limit = 10 } = req.query;

    const filter = { studentId };
    if (month) filter.date = new RegExp(`^${month}`);

    const text = String(q).trim().toLowerCase();
    let logs = await BiometricLog.find(filter).sort({ date: -1, time: -1 }).lean();
    if (text) {
      logs = logs.filter((l) => `${l.date} ${l.time} ${l.device} ${l.status}`.toLowerCase().includes(text));
    }

    const pg = Number(page);
    const lim = Number(limit);
    const start = (pg - 1) * lim;

    res.json({
      data: logs.slice(start, start + lim),
      page: pg,
      totalPages: Math.max(1, Math.ceil(logs.length / lim)),
      total: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load biometric logs", error: error.message });
  }
});

router.get("/:studentId/leave", async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await LeaveRequest.find({ studentId }).sort({ appliedAt: -1 }).lean();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leave history", error: error.message });
  }
});

router.post("/:studentId/leave", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId }).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const count = await LeaveRequest.countDocuments();
    const leaveId = `LEV${String(count + 1).padStart(3, "0")}`;
    const created = await LeaveRequest.create({
      leaveId,
      studentId,
      mentorId: student.mentorId,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      reason: req.body.reason,
      attachmentUrl: req.body.attachmentUrl || null,
      status: "pending",
      mentorComment: "Awaiting review",
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to apply leave", error: error.message });
  }
});

router.get("/:studentId/performance", async (req, res) => {
  try {
    const { studentId } = req.params;
    const rows = await AcademicPerformance.find({ studentId }).sort({ semester: 1 }).lean();
    const cgpa = rows.length ? rows[rows.length - 1].cgpa : 0;
    const sgpa = rows.map((r) => r.sgpa);
    const semesters = rows.map((r) => ({ sem: `Sem ${r.semester}`, sgpa: r.sgpa }));
    res.json({ cgpa, sgpa, semesters });
  } catch (error) {
    res.status(500).json({ message: "Failed to load performance", error: error.message });
  }
});

router.get("/:studentId/notifications", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId }).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const rows = await Notification.find({
      recipientRole: { $in: ["student", "Student"] },
      $or: [
        { recipientId: studentId },
        { recipientId: student.email },
        { recipientId: "all" },
        { recipientId: "ALL_STUDENTS" },
        { recipientId: null },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to load notifications", error: error.message });
  }
});

router.patch("/:studentId/profile", async (req, res) => {
  try {
    const { studentId } = req.params;
    const payload = {
      phone: req.body.phone,
      email: req.body.email,
      photo: req.body.photo,
    };
    if (req.body.password) payload.password = req.body.password;

    const updated = await Student.findOneAndUpdate({ studentId }, payload, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

export default router;
