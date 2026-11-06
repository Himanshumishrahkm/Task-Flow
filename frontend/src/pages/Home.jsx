import { ArrowRight, CheckCircle2, ClipboardList, FolderKanban, ChartNoAxesCombined } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container home-hero">
        <section className="hero-copy">
          <span className="eyebrow">A clearer way to work</span>
          <h1>Make progress visible. <span>Keep work moving.</span></h1>
          <p>TaskFlow helps you organize projects, manage everyday tasks, and understand what needs attention — all in one simple workspace.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Create your workspace <ArrowRight size={17} /></Link>
            <Link to="/login" className="btn btn-secondary">Sign in</Link>
          </div>
          <div className="hero-note"><CheckCircle2 size={16} /> Projects, tasks and progress in one place</div>
        </section>

        <section className="hero-preview card">
          <div className="preview-top">
            <div><span className="preview-kicker">WORKSPACE OVERVIEW</span><h2>Your team at a glance</h2></div>
            <span className="live-dot">● Live preview</span>
          </div>
          <div className="preview-stats">
            <div><FolderKanban /><strong>08</strong><span>Projects</span></div>
            <div><ClipboardList /><strong>24</strong><span>Tasks</span></div>
            <div><ChartNoAxesCombined /><strong>67%</strong><span>Progress</span></div>
          </div>
          <div className="preview-task">
            <div className="preview-task-heading"><strong>Recent tasks</strong><span>This week</span></div>
            {["Design the project dashboard", "Review API integration", "Prepare release checklist"].map((item, index) => (
              <div className="preview-row" key={item}>
                <span className={`preview-check ${index === 0 ? "checked" : ""}`}>{index === 0 ? "✓" : ""}</span>
                <span>{item}</span><small>{index === 0 ? "Done" : index === 1 ? "In progress" : "To do"}</small>
              </div>
            ))}
          </div>
        </section>
      </main>
      <section className="page-container feature-row">
        <div><FolderKanban /><strong>Organize projects</strong><span>Keep related work together.</span></div>
        <div><ClipboardList /><strong>Manage tasks</strong><span>Track priorities and due dates.</span></div>
        <div><ChartNoAxesCombined /><strong>Track progress</strong><span>See what is done and what is next.</span></div>
      </section>
    </div>
  );
}