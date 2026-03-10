import mongoose from "mongoose";

const biometricSchema = new mongoose.Schema(
  {
    logId: { type: String, unique: true, sparse: true },
    studentId: String,
    mentorId: String,
    department: String,
    date: String,
    time: String,
    device: String,
    status: String,
    verification: String,
  },
  { timestamps: true, collection: "biometric_logs" }
);

export const BiometricLog = mongoose.model("BiometricLog", biometricSchema);
