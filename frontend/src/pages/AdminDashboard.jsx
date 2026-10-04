import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import Icon from '../components/Icon.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/admin/dashboard').then(setStats).catch((e) => setError(e.message)); }, []);

  const items = stats && [
    ['Total users', stats.users, 'users', '/admin/users'],
    ['Total stores', stats.stores, 'store', '/admin/stores'],
    ['Ratings submitted', stats.ratings, 'star', null],
  ];

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">A snapshot of the platform.</p>
        </div>
        <div className="actions">
          <Link className="btn" to="/admin/users/new"><Icon name="plus" size={16} /> Add user</Link>
          <Link className="btn btn-outline" to="/admin/stores/new"><Icon name="plus" size={16} /> Add store</Link>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {!stats && !error && <p className="state">Loading…</p>}
      {items && (
        <div className="stats">
          {items.map(([label, n, icon, to]) => {
            const body = (<><span className="stat-icon"><Icon name={icon} size={22} /></span><span className="stat-label">{label}</span><span className="stat-value">{n.toLocaleString()}</span></>);
            return to ? <Link key={label} to={to} className="stat">{body}</Link> : <div key={label} className="stat">{body}</div>;
          })}
        </div>
      )}
    </section>
  );
}
