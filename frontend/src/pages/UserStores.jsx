import { useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import Stars from '../components/Stars.jsx';
import { useList } from '../hooks.js';
import { api } from '../api.js';

function RatingCell({ store, onSaved }) {
  const [draft, setDraft] = useState(store.my_rating);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const changed = draft && draft !== store.my_rating;

  async function save() {
    setBusy(true);
    setError('');
    try {
      const res = await api(`/stores/${store.id}/rating`, { method: 'PUT', body: { rating: draft } });
      onSaved(store.id, res);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rate">
      <Stars value={draft} onChange={setDraft} label={`Your rating for ${store.name}`} />
      <button className="btn btn-small" disabled={!changed || busy} onClick={save}>
        {busy ? 'Saving…' : store.my_rating ? 'Update rating' : 'Submit rating'}
      </button>
      {error && <span className="error" role="alert">{error}</span>}
    </div>
  );
}

export default function UserStores() {
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ by: 'name', order: 'asc' });
  const { rows, setRows, loading, error } = useList('/stores', filters, sort);
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const onSaved = (id, res) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, my_rating: res.myRating, rating: res.rating } : r)));

  const columns = [
    { key: 'name', label: 'Store', render: (r) => <span className="name-cell"><span className="avatar">{r.name[0]}</span>{r.name}</span> },
    { key: 'address', label: 'Address' },
    { key: 'rating', label: 'Overall rating', render: (r) => <Stars value={r.rating} /> },
    { key: 'myRating', label: 'Your rating', render: (r) => (r.my_rating ? <strong>{r.my_rating} / 5</strong> : <span className="muted">Not rated</span>) },
    { key: 'action', label: 'Rate this store', sortable: false, render: (r) => <RatingCell key={`${r.id}-${r.my_rating}`} store={r} onSaved={onSaved} /> },
  ];

  return (
    <section>
      <h1>Stores</h1>
      <div className="filters">
        <input placeholder="Search by name" aria-label="Search by name" value={filters.name} onChange={set('name')} />
        <input placeholder="Search by address" aria-label="Search by address" value={filters.address} onChange={set('address')} />
      </div>
      {error && <p className="error">{error}</p>}
      <DataTable columns={columns} rows={rows} sort={sort} onSort={setSort} loading={loading} empty="No stores match your search." />
    </section>
  );
}
