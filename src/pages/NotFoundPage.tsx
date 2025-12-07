import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page page--not-found">
      <div className="content-card">
        <p className="eyebrow">404</p>
        <h1>We could not find that page</h1>
        <p className="muted">Head back to the start and open your personalised link.</p>
        <Link className="primary-link" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

