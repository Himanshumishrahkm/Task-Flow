import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";
import "../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link to="/" className="auth-brand"><CheckSquare size={25} /> TaskFlow</Link>
        <div className="auth-aside-copy">
          <h1>Good work starts with a clear plan.</h1>
          <p>Bring your projects and daily tasks together. Focus on the next step and keep your momentum.</p>
        </div>
        <div className="auth-aside-foot">Your work, organized.</div>
      </aside>
      <main className="auth-main">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue to your workspace.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input id="email" className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" required />
          </div>
          <button className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
        </form>
      </main>
    </div>
  );
}