import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    attendanceId: { type: String, unique: true, sparse: true },
    studentId: String,
    mentorId: String,
    date: String,
    morningStatus: String,
    afternoonStatus: String,
    finalStatus: String,
    source: String,
    remarks: String,
  },
  { timestamps: true, collection: "attendance_records" }
);

export const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceSchema);
