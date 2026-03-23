import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    leaveId: { type: String, unique: true, sparse: true },
    studentId: String,
    mentorId: String,
    fromDate: String,
    toDate: String,
    leaveType: String,
    reason: String,
    status: String,
    mentorComment: String,
    appliedAt: String,
    reviewedAt: String,
  },
  { timestamps: true, collection: "leave_requests" }
);

export const LeaveRequest = mongoose.model("LeaveRequest", leaveSchema);
