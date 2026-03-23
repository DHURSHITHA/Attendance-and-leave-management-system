import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const presentDays = new Set([1, 2, 4, 6, 8, 11, 14, 15, 18, 19]);
  const leaveDays = new Set([9, 13, 20]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(
      result.user.role === "faculty"
        ? "/faculty/dashboard"
        : result.user.role === "admin"
          ? "/admin/dashboard"
          : result.user.role === "parent"
            ? "/parent/dashboard"
            : "/student/dashboard"
    );
  };

  return (
    <div className="auth-page">
      <div className="login-layout">
        <section className="login-showcase" aria-hidden="true">
          <div className="showcase-glow" />
          <div className="gradient-art">
            <div className="calendar-shell">
              <div className="calendar-top">
                <span className="ring-pin pin-1" />
                <span className="ring-pin pin-2" />
              </div>
              <div className="login-calendar-grid">
                {Array.from({ length: 21 }, (_, i) => {
                  const day = i + 1;
                  const cls = presentDays.has(day)
                    ? "day-cell present"
                    : leaveDays.has(day)
                      ? "day-cell leave"
                      : "day-cell";
                  return <span key={day} className={cls} />;
                })}
              </div>
            </div>
            <div className="attendance-chip" />
            <div className="leave-chip" />
            <div className="scan-line" />
          </div>
        </section>

        <form className="auth-card login-card" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p>Login to your attendance portal</p>
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          {error && <div className="error-text">{error}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
          <small>Use credentials from your MongoDB records.</small>
          <small>Admin demo: admin@attendx.com / admin123</small>
          <small>Parent demo (UI only): parent@attendx.com / parent123</small>
          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
