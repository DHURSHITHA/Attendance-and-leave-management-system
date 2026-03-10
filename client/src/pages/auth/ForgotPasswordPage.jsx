import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive reset instructions.</p>
        <input placeholder="Registered Email" type="email" />
        <button>Send Reset Link</button>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
