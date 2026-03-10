import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actorId: String,
    actorRole: String,
    action: String,
    targetType: String,
    targetId: String,
    details: String,
    at: String,
  },
  { timestamps: true, collection: "activity_logs" }
);

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

