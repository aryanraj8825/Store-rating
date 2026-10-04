import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Stars from '../components/Stars.jsx';

const cmp = { name: (a, b) => a.name.localeCompare(b.name), email: (a, b) => a.email.localeCompare(b.email), rating: (a, b) => a.rating - b.rating, updated_at: (a, b) => new Date(a.updated_at) - new Date(b.updated_at) };

function Raters({ raters }) {
  const [sort, setSort] = useState({ by: 'updated_at', order: 'desc' });
  const sorted = [...raters].sort((a, b) => cmp[sort.by](a, b) * (sort.order === 'asc' ? 1 : -1));
  const head = (key, label) => (
    <th aria-sort={sort.by === key ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}>
      <button className="th-btn" onClick={() => setSort({ by: key, order: sort.by === key && sort.order === 'asc' ? 'desc' : 'asc' })}>
        {label}<span className={`caret ${sort.by === key ? 'active' : ''}`}>{sort.by === key ? (sort.order === 'asc' ? '▲' : '▼') : '↕'}</span>
      </button>
    </th>
  );
  if (!raters.length) return <p className="state">No one has rated this store yet.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{head('name', 'Name')}{head('email', 'Email')}{head('rating', 'Rating')}{head('updated_at', 'Rated on')}</tr></thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id}>
              <td data-label="Name">{r.name}</td>
              <td data-label="Email">{r.email}</td>
              <td data-label="Rating"><Stars value={r.rating} /></td>
              <td data-label="Rated on">{new Date(r.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OwnerDashboard() {
  const [stores, setStores] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/owner/dashboard').then((d) => setStores(d.stores)).catch((e) => setError(e.message)); }, []);

  return (
    <section>
      <h1>My stores</h1>
      {error && <p className="error">{error}</p>}
      {!stores && !error && <p className="state">Loading…</p>}
      {stores && !stores.length && <p className="state">No store is assigned to your account yet. Ask an administrator to link one.</p>}
      {stores?.map((s) => (
        <article key={s.id} className="store-block">
          <header>
            <div>
              <h2>{s.name}</h2>
              <p className="muted">{s.address}</p>
            </div>
            <div className="avg">
              <span className="muted">Average rating</span>
              <Stars value={s.average} />
              <span className="muted">{s.count} {s.count === 1 ? 'rating' : 'ratings'}</span>
            </div>
          </header>
          <h3>People who rated this store</h3>
          <Raters raters={s.raters} />
        </article>
      ))}
    </section>
  );
}
