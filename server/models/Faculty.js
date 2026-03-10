import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    facultyId: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: String,
    password: String,
    phone: String,
    department: String,
    role: { type: String, default: "faculty" },
    designation: String,
  },
  { timestamps: true, collection: "faculties" }
);

export const Faculty = mongoose.model("Faculty", facultySchema);
