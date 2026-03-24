import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    parentId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "parent" },
    phone: { type: String, default: "" },
    department: { type: String, default: "CSE" },
    photo: { type: String, default: "" },
    childId: { type: String, default: "" },
  },
  { timestamps: true, collection: "parents" }
);

export const Parent = mongoose.model("Parent", parentSchema);
