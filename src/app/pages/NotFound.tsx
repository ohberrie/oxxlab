import { Link } from 'react-router';

export function NotFound() {
  return (
    <section className="page">
      <span className="eyebrow">404</span>
      <h1 style={{ marginTop: 18 }}>Nothing here.</h1>
      <p style={{ marginTop: 20 }}><Link className="blue" to="/">Back to OXX OS ↗</Link></p>
    </section>
  );
}
