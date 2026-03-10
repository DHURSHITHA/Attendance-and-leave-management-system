import mongoose from "mongoose";

const biometricSettingSchema = new mongoose.Schema(
  {
    settingId: { type: String, unique: true, sparse: true },
    morningStart: String,
    morningEnd: String,
    afternoonStart: String,
    afternoonEnd: String,
    enabled: { type: Boolean, default: true },
    deviceStatus: { type: String, default: "online" },
  },
  { timestamps: true, collection: "biometric_settings" }
);

export const BiometricSetting = mongoose.model("BiometricSetting", biometricSettingSchema);

