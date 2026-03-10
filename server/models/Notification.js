import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, unique: true, sparse: true },
    recipientRole: String,
    recipientId: String,
    senderId: String,
    type: String,
    title: String,
    message: String,
    isRead: Boolean,
    createdAt: String,
  },
  { timestamps: true, collection: "notifications" }
);

export const Notification = mongoose.model("Notification", notificationSchema);
