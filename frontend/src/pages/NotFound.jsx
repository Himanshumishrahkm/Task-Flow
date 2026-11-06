import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page-container empty-state">
      <h1>404</h1>
      <h3>We couldn't find that page.</h3>
      <p>It may have moved or the address may be incorrect.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 15 }}>Back to home</Link>
    </main>
  );
}