
import { CalendarDays, Trash2 } from "lucide-react";
import { formatDate, isOverdue } from "../utils/formatDate";
import { TASK_STATUS } from "../utils/constants";

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const id = task._id || task.id;
  const status = task.status || "todo";
  const priority = task.priority || "medium";
  const overdue = isOverdue(task.dueDate, status);

  return (
    <article className="task-card card">
      <div className="task-card-main">
        <div className="task-card-heading">
          <h4>{task.title}</h4>

          <span className={`badge badge-${status}`}>
            {status.replace("-", " ")}
          </span>

          <span className={`badge badge-${priority}`}>
            {priority}
          </span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {task.dueDate && (
          <p
            className="task-due-date"
            style={{ color: overdue ? "#dc2626" : undefined }}
          >
            <CalendarDays size={14} />
            {overdue ? "Overdue · " : "Due · "}
            {formatDate(task.dueDate)}
          </p>
        )}
      </div>

      <div className="task-card-actions">
        <select
          className="task-select"
          value={status}
          onChange={(event) =>
            onStatusChange(id, event.target.value)
          }
          aria-label={`Change status for ${task.title}`}
        >
          {TASK_STATUS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          className="icon-btn"
          type="button"
          title="Delete task"
          aria-label={`Delete ${task.title}`}
          onClick={() => onDelete(task)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
