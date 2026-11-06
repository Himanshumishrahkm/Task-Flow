import "../styles/dashboard.css";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { getProjects } from "../services/projectService";
import { createTask, deleteTask, getProjectTasks, updateTaskStatus } from "../services/taskService";
import { getErrorMessage } from "../services/api";
import { TASK_PRIORITY, TASK_STATUS } from "../utils/constants";

function normalizeArray(payload, key) {
  if (Array.isArray(payload)) return payload;
  return payload?.[key] || payload?.data?.[key] || payload?.data || [];
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "todo", priority: "medium", dueDate: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [projectResult, taskResult] = await Promise.all([
        getProjects(),
        getProjectTasks(id, { status: status || undefined, priority: priority || undefined, search: search || undefined }),
      ]);
      const allProjects = normalizeArray(projectResult, "projects");
      setProject(allProjects.find((item) => String(item._id || item.id) === id) || null);
      setTasks(normalizeArray(taskResult, "tasks"));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, status, priority, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      await createTask(id, payload);
      setShowModal(false);
      setForm({ title: "", description: "", status: "todo", priority: "medium", dueDate: "" });
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      await updateTaskStatus(taskId, nextStatus);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(task._id || task.id);
      await load();
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
          <Link to="/projects" className="btn btn-ghost" style={{ paddingLeft: 0 }}><ArrowLeft size={16} /> Back to projects</Link>
          {loading ? <Loading label="Loading project..." /> : (
            <>
              <div className="page-heading">
                <div><h1>{project?.title || "Project tasks"}</h1><p>{project?.description || "Manage tasks in this project."}</p></div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={17} /> Add task</button>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="toolbar">
                <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                  <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#8993a4" }} />
                  <input className="form-control" style={{ width: "100%", paddingLeft: 37 }} placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
                  <option value="">All statuses</option>{TASK_STATUS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
                  <option value="">All priorities</option>{TASK_PRIORITY.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div className="task-list">
                {tasks.length ? tasks.map((task) => (
                  <TaskCard key={task._id || task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
                )) : <div className="card empty-state"><h3>No tasks found</h3><p>Add a task or change your filters.</p></div>}
              </div>
            </>
          )}
        </main>
      </div>
      {showModal && (
        <Modal title="Create a task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreateTask}>
            <div className="form-field"><label htmlFor="task-title">Task title</label><input id="task-title" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={120} /></div>
            <div className="form-field"><label htmlFor="task-description">Description</label><textarea id="task-description" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} /></div>
            <div className="form-field"><label htmlFor="task-status">Status</label><select id="task-status" className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{TASK_STATUS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div className="form-field"><label htmlFor="task-priority">Priority</label><select id="task-priority" className="form-control" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{TASK_PRIORITY.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div className="form-field"><label htmlFor="due-date">Due date</label><input id="due-date" type="date" className="form-control" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Create task"}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}