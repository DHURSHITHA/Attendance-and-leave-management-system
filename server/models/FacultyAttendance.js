import mongoose from "mongoose";

const facultyAttendanceSchema = new mongoose.Schema(
  {
    attendanceId: { type: String, unique: true, sparse: true },
    facultyId: String,
    date: String,
    status: String,
    remarks: String,
  },
  { timestamps: true, collection: "faculty_attendance" }
);

export const FacultyAttendance = mongoose.model("FacultyAttendance", facultyAttendanceSchema);

