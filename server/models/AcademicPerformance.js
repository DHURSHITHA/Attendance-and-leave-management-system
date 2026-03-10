import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    recordId: { type: String, unique: true, sparse: true },
    studentId: String,
    mentorId: String,
    department: String,
    semester: Number,
    sgpa: Number,
    cgpa: Number,
    backlogs: Number,
    updatedAt: String,
  },
  { timestamps: true, collection: "academic_performance" }
);

export const AcademicPerformance = mongoose.model("AcademicPerformance", performanceSchema);
