import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    settingId: { type: String, unique: true, sparse: true },
    minimumAttendancePercent: { type: Number, default: 75 },
    academicYear: { type: String, default: "2025-2026" },
    semesterStructure: { type: String, default: "8 semesters" },
    attendanceWindowRule: { type: String, default: "Biometric only within configured windows" },
  },
  { timestamps: true, collection: "system_settings" }
);

export const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);

