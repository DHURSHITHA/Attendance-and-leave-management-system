import mongoose from "mongoose";

const lowAttendanceSchema = new mongoose.Schema(
  {
    caseId: { type: String, unique: true, sparse: true },
    studentId: String,
    mentorId: String,
    month: String,
    attendancePercent: Number,
    warningCount: Number,
    lastWarningDate: String,
    status: String,
  },
  { timestamps: true, collection: "low_attendance_cases" }
);

export const LowAttendanceCase = mongoose.model("LowAttendanceCase", lowAttendanceSchema);
