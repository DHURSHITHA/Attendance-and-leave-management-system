import { Router } from "express";
import { Faculty } from "../models/Faculty.js";
import { Parent } from "../models/Parent.js";
import { Student } from "../models/Student.js";
import { sanitizeUser, verifyUserPassword } from "../utils/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (email === "admin@attendx.com" && password === "admin123") {
      return res.json({
        user: {
          id: "ADM001",
          name: "System Admin",
          email,
          role: "admin",
          mentorId: null,
          department: "Administration",
          phone: "",
          photo: "https://i.pravatar.cc/100?img=15",
          semester: null,
          section: null,
        },
      });
    }

    if (email === "parent@attendx.com" && password === "parent123") {
      let parent = await Parent.findOne({ email }).lean();
      if (!parent) {
        const count = await Parent.countDocuments();
        const parentId = `PAR${String(count + 1).padStart(3, "0")}`;
        parent = await Parent.create({
          parentId,
          name: "Ravi Sharma",
          email,
          password,
          role: "parent",
          department: "CSE",
          phone: "+91-90012-3344",
          childId: "STU014",
        });
        parent = parent.toObject();
      }
      return res.json({ user: sanitizeUser(parent, "parent") });
    }

    const student = await Student.findOne({ email }).lean();
    if (student && verifyUserPassword(student, password)) {
      return res.json({ user: sanitizeUser(student, "student") });
    }

    const faculty = await Faculty.findOne({ email }).lean();
    if (faculty && verifyUserPassword(faculty, password)) {
      return res.json({ user: sanitizeUser(faculty, "faculty") });
    }

    const parent = await Parent.findOne({ email }).lean();
    if (parent && verifyUserPassword(parent, password)) {
      return res.json({ user: sanitizeUser(parent, "parent") });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { role = "student" } = req.body;
    if (role === "faculty") {
      const count = await Faculty.countDocuments();
      const facultyId = `FAC${String(count + 1).padStart(3, "0")}`;
      const created = await Faculty.create({ ...req.body, facultyId, password: req.body.password, role: "faculty" });
      return res.status(201).json({ user: sanitizeUser(created.toObject(), "faculty") });
    }
    if (role === "parent") {
      const count = await Parent.countDocuments();
      const parentId = `PAR${String(count + 1).padStart(3, "0")}`;
      const created = await Parent.create({ ...req.body, parentId, password: req.body.password, role: "parent" });
      return res.status(201).json({ user: sanitizeUser(created.toObject(), "parent") });
    }

    const count = await Student.countDocuments();
    const studentId = `STU${String(count + 1).padStart(3, "0")}`;
    const created = await Student.create({ ...req.body, studentId, password: req.body.password, role: "student" });
    return res.status(201).json({ user: sanitizeUser(created.toObject(), "student") });
  } catch (error) {
    return res.status(500).json({ message: "Register failed", error: error.message });
  }
});

router.post("/forgot-password", async (_req, res) => {
  return res.json({ message: "Reset link flow placeholder is active" });
});

export default router;
