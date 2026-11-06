import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      if (!localStorage.getItem("token")) {
        await login({ email: form.email, password: form.password });
      }
      navigate(localStorage.getItem("token") ? "/dashboard" : "/login", { replace: true });
    } catch (err) {
      // Some APIs create the account but do not issue a token; allow the user to sign in.
      if (err.response?.status >= 400) setError(getErrorMessage(err));
      else setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link to="/" className="auth-brand"><CheckSquare size={25} /> TaskFlow</Link>
        <div className="auth-aside-copy">
          <h1>Turn busy work into steady progress.</h1>
          <p>Create a workspace, group tasks into projects, and get a better view of what your team is working on.</p>
        </div>
        <div className="auth-aside-foot">Simple planning. Better follow-through.</div>
      </aside>
      <main className="auth-main">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <p className="auth-subtitle">Start organizing your work with TaskFlow.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-field">
            <label htmlFor="name">Full name</label>
            <input id="name" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" minLength={2} required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input id="email" className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
          </div>
          <button className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </main>
    </div>
  );
}