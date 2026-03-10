import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true, sparse: true },
    facultyId: String,
    type: String,
    filters: Object,
    format: String,
    status: String,
    generatedAt: String,
    downloadUrl: String,
  },
  { timestamps: true, collection: "report_requests" }
);

export const ReportRequest = mongoose.model("ReportRequest", reportSchema);
