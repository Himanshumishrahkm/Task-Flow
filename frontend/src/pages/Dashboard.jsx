import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { FolderKanban, ClipboardList, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";
import { getDashboardStats } from "../services/dashboardService";
import { createProject, deleteProject, getProjects } from "../services/projectService";
import { getErrorMessage } from "../services/api";

function pickArray(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}
function pickStats(payload) {
  const data = payload?.stats || payload?.data?.stats || payload?.data || payload || {};
  return {
    totalProjects: data.totalProjects ?? data.projectCount ?? 0,
    totalTasks: data.totalTasks ?? data.taskCount ?? 0,
    completedTasks: data.tasksByStatus?.done ?? data.completedTasks ?? data.doneTasks ?? 0,
    overdueTasks: data.overdueTasks ?? data.overdueCount ?? 0,
    todoTasks: data.tasksByStatus?.todo ?? data.todoTasks ?? data.pendingTasks ?? 0,
    inProgressTasks: data.tasksByStatus?.inProgress ?? data.inProgressTasks ?? 0,
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectResult, statsResult] = await Promise.all([getProjects(), getDashboardStats()]);
      setProjects(pickArray(projectResult, "projects"));
      setStats(pickStats(statsResult));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createProject(form);
      setForm({ title: "", description: "" });
      setShowModal(false);
      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}" and all its tasks?`)) return;
    try {
      await deleteProject(project._id || project.id);
      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container dashboard-layout">
        <Sidebar />
        <main>
          <div className="page-heading">
            <div><h1>Dashboard</h1><p>Here's what's happening in your workspace.</p></div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={17} /> New project</button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {loading ? <Loading label="Loading your dashboard..." /> : (
            <>
              <section className="stats-grid">
                <Stat icon={<FolderKanban size={18} />} label="Total projects" value={stats?.totalProjects ?? projects.length} />
                <Stat icon={<ClipboardList size={18} />} label="Total tasks" value={stats?.totalTasks ?? 0} />
                <Stat icon={<CheckCircle2 size={18} />} label="Completed tasks" value={stats?.completedTasks ?? 0} />
                <Stat icon={<AlertCircle size={18} />} label="Overdue tasks" value={stats?.overdueTasks ?? 0} />
              </section>
              <div className="page-heading" style={{ marginTop: 30 }}>
                <div><h2 style={{ font: "800 20px Manrope", margin: 0 }}>Your projects</h2><p>Pick up where you left off.</p></div>
                <Link className="btn btn-secondary" to="/projects">View all</Link>
              </div>
              {projects.length ? (
                <section className="project-grid">
                  {projects.slice(0, 4).map((project) => <ProjectCard key={project._id || project.id} project={project} onDelete={handleDelete} />)}
                </section>
              ) : (
                <div className="card empty-state"><FolderKanban size={30} /><h3>No projects yet</h3><p>Create your first project to start organizing tasks.</p><button className="btn btn-primary" onClick={() => setShowModal(true)}>Create project</button></div>
              )}
            </>
          )}
        </main>
      </div>
      {showModal && (
        <Modal title="Create a project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate}>
            <div className="form-field"><label htmlFor="project-title">Project title</label><input id="project-title" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={100} required /></div>
            <div className="form-field"><label htmlFor="project-description">Description</label><textarea id="project-description" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} /></div>
            <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? "Creating..." : "Create project"}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return <div className="stat-card card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value">{value}</div><div className="stat-foot">Across your workspace</div></div>;
}