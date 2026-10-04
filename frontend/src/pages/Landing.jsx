import { Link, Navigate } from 'react-router-dom';
import { useAuth, homeFor } from '../auth.jsx';
import PublicHeader, { Brand } from '../components/PublicHeader.jsx';
import Showcase from '../components/Showcase.jsx';
import Icon from '../components/Icon.jsx';

const ROLES = [
  { icon: 'star', title: 'For shoppers', text: 'Search stores by name or address, give each one a rating from 1 to 5, and change it whenever your opinion changes. See the overall score before you go.' },
  { icon: 'store', title: 'For store owners', text: 'Open your dashboard to see your average rating and exactly who rated your store, so you know where you stand.' },
  { icon: 'shield', title: 'For administrators', text: 'Add stores and users, watch platform totals, and filter every list by name, email, address or role.' },
];

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return <p className="state">Loading…</p>;
  if (user) return <Navigate to={homeFor(user.role)} replace />;

  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <h1>Know which stores are worth the trip.</h1>
              <p className="lead">Rate the places you shop and see what everyone else thinks. Store owners get honest feedback in one place.</p>
              <div className="actions">
                <Link className="btn btn-large" to="/signup">Create free account</Link>
                <Link className="btn btn-large btn-outline" to="/login">Log in</Link>
              </div>
            </div>
            <Showcase />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section-title">One platform, three ways to use it</h2>
            <div className="role-grid">
              {ROLES.map((r) => (
                <article key={r.title} className="role-card">
                  <span className="role-icon"><Icon name={r.icon} size={22} /></span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="band">
          <div className="container band-inner">
            <h2>One person, one rating per store.</h2>
            <p>Every account can rate a store once and edit that rating later, so averages reflect real customers rather than repeat votes.</p>
            <Link className="btn btn-light" to="/signup">Start rating stores</Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <Brand />
          <span className="muted">&copy; {new Date().getFullYear()} Storefront Ratings</span>
        </div>
      </footer>
    </>
  );
}
