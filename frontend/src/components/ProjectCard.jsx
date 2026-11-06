import { Folder, MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, onDelete }) {
  const id = project._id || project.id;
  return (
    <article className="project-card card">
      <div className="project-card-head">
        <div className="stat-icon"><Folder size={18} /></div>
        <button className="icon-btn" type="button" title="Delete project" onClick={() => onDelete(project)}>
          <Trash2 size={16} />
        </button>
      </div>
      <Link to={`/projects/${id}`}>
        <h3 style={{ marginTop: 15 }}>{project.title}</h3>
        <p>{project.description || "No description added."}</p>
      </Link>
      <div className="project-meta">
        <span>Project</span>
        <Link to={`/projects/${id}`} className="text-link">Open project <MoreHorizontal size={14} /></Link>
      </div>
    </article>
  );
}