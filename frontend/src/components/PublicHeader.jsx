import { Link } from 'react-router-dom';

export function Brand({ light }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`}>
      <span className="brand-mark">★</span> Storefront Ratings
    </Link>
  );
}

export default function PublicHeader() {
  return (
    <header className="public-header">
      <div className="container public-header-inner">
        <Brand />
        <nav aria-label="Account" className="public-nav">
          <Link to="/login">Log in</Link>
          <Link className="btn btn-small" to="/signup">Create account</Link>
        </nav>
      </div>
    </header>
  );
}
