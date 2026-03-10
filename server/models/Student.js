import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    rollNumber: String,
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: String,
    password: String,
    phone: String,
    department: String,
    semester: Number,
    section: String,
    mentorId: String,
    role: { type: String, default: "student" },
    status: String,
  },
  { timestamps: true, collection: "students" }
);

export const Student = mongoose.model("Student", studentSchema);
