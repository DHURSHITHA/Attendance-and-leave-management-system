import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    settingId: { type: String, unique: true, sparse: true },
    minimumAttendancePercent: { type: Number, default: 75 },
    academicYear: { type: String, default: "2025-2026" },
    semesterStructure: { type: String, default: "8 semesters" },
    attendanceWindowRule: { type: String, default: "Biometric only within configured windows" },
    attendanceGraceMinutes: { type: Number, default: 10 },
    lateArrivalThresholdMinutes: { type: Number, default: 20 },
    maxLeaveDaysPerSemester: { type: Number, default: 6 },
    autoLowAttendanceAlertPercent: { type: Number, default: 75 },
    manualOverrideAllowed: { type: Boolean, default: true },
    biometricRequired: { type: Boolean, default: true },
    reportAutoEmail: { type: Boolean, default: false },
    notificationChannel: { type: String, default: "both" },
    timezone: { type: String, default: "Asia/Calcutta" },
    dataRetentionDays: { type: Number, default: 365 },
    holidayCalendarUrl: { type: String, default: "" },
    maxBackdateDays: { type: Number, default: 3 },
  },
  { timestamps: true, collection: "system_settings" }
);

export const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);
