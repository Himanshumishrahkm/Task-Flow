import { LayoutDashboard, FolderKanban } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar card">
      <div className="sidebar-label">Workspace</div>
      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
        <LayoutDashboard size={17} /> Overview
      </NavLink>
      <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
        <FolderKanban size={17} /> Projects
      </NavLink>
    </aside>
  );
}