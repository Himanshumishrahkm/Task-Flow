import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { Plus, FolderKanban, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";
import { createProject, deleteProject, getProjects } from "../services/projectService";
import { getErrorMessage } from "../services/api";

function normalizeProjects(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.projects || payload?.data?.projects || payload?.data || [];
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await getProjects();
      setProjects(normalizeProjects(result));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createProject(form);
      setForm({ title: "", description: "" });
      setShowModal(false);
      await loadProjects();
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
      await loadProjects();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const filtered = projects.filter((project) =>
    `${project.title} ${project.description || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container dashboard-layout">
        <Sidebar />
        <main>
          <div className="page-heading">
            <div><h1>Projects</h1><p>Keep your work organized by project.</p></div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={17} /> New project</button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="toolbar">
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#8993a4" }} />
              <input className="form-control" style={{ paddingLeft: 37, width: "100%" }} placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <span className="muted" style={{ fontSize: 13 }}>{filtered.length} project(s)</span>
          </div>
          {loading ? <Loading label="Loading projects..." /> : filtered.length ? (
            <section className="project-grid">
              {filtered.map((project) => <ProjectCard key={project._id || project.id} project={project} onDelete={handleDelete} />)}
            </section>
          ) : (
            <div className="card empty-state"><FolderKanban size={30} /><h3>{search ? "No matching projects" : "No projects yet"}</h3><p>{search ? "Try another search term." : "Create a project to get started."}</p></div>
          )}
        </main>
      </div>
      {showModal && (
        <Modal title="Create a project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate}>
            <div className="form-field"><label htmlFor="title">Project title</label><input id="title" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={100} /></div>
            <div className="form-field"><label htmlFor="description">Description</label><textarea id="description" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} /></div>
            <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? "Creating..." : "Create project"}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}