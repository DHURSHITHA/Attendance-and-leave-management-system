import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <p>Registration flow can be connected to backend APIs.</p>
        <input placeholder="Full Name" />
        <input placeholder="Email" type="email" />
        <input placeholder="Password" type="password" />
        <button>Register</button>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
