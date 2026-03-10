import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: String,
    hodName: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "departments" }
);

export const Department = mongoose.model("Department", departmentSchema);

