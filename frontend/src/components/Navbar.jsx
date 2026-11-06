import { CheckSquare, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark"><CheckSquare size={19} /></span>
          TaskFlow
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/projects">Projects</NavLink>
            </>
          ) : (
            <NavLink to="/">Home</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip" title={user.name || user.email}>
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </span>
              <button className="btn btn-ghost" onClick={handleLogout} type="button">
                <LogOut size={16} /> <span className="logout-label">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}