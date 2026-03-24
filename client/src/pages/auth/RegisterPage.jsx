import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    phone: "",
    mentorId: "",
    childId: "",
    semester: "",
    section: "",
  });

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async () => {
    setStatus({ type: "", message: "" });
    if (!form.name || !form.email || !form.password) {
      setStatus({ type: "error", message: "Name, email, and password are required." });
      return;
    }
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department || undefined,
        phone: form.phone || undefined,
      };
      if (form.role === "student") {
        payload.mentorId = form.mentorId || undefined;
        payload.semester = form.semester ? Number(form.semester) : undefined;
        payload.section = form.section || undefined;
      }
      if (form.role === "parent") {
        payload.childId = form.childId || undefined;
      }
      await authApi.register(payload);
      setStatus({ type: "success", message: "Registration successful. Please log in." });
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Registration failed." });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <p>Create your account based on your role.</p>
        {status.message && (
          <p className={status.type === "error" ? "error-text" : "hint"}>{status.message}</p>
        )}
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => updateForm({ password: e.target.value })}
        />
        <select value={form.role} onChange={(e) => updateForm({ role: e.target.value })}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="parent">Parent</option>
        </select>
        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => updateForm({ department: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => updateForm({ phone: e.target.value })}
        />
        {form.role === "student" && (
          <>
            <input
              placeholder="Mentor ID (FACxxx)"
              value={form.mentorId}
              onChange={(e) => updateForm({ mentorId: e.target.value })}
            />
            <input
              placeholder="Semester"
              type="number"
              value={form.semester}
              onChange={(e) => updateForm({ semester: e.target.value })}
            />
            <input
              placeholder="Section"
              value={form.section}
              onChange={(e) => updateForm({ section: e.target.value })}
            />
          </>
        )}
        {form.role === "parent" && (
          <input
            placeholder="Child Student ID (STUxxx)"
            value={form.childId}
            onChange={(e) => updateForm({ childId: e.target.value })}
          />
        )}
        <button onClick={handleSubmit}>Register</button>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
