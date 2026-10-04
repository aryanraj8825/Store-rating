import { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable.jsx';
import Stars from '../components/Stars.jsx';
import { useList } from '../hooks.js';

export default function AdminStores() {
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ by: 'name', order: 'asc' });
  const { rows, loading, error } = useList('/admin/stores', filters, sort);
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <span className="name-cell"><span className="avatar">{r.name[0]}</span>{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'rating', label: 'Rating', render: (r) => <Stars value={r.rating} /> },
  ];

  return (
    <section>
      <div className="page-head">
        <h1>Stores</h1>
        <Link className="btn" to="/admin/stores/new">Add store</Link>
      </div>
      <div className="filters">
        <input placeholder="Filter by name" aria-label="Filter by name" value={filters.name} onChange={set('name')} />
        <input placeholder="Filter by email" aria-label="Filter by email" value={filters.email} onChange={set('email')} />
        <input placeholder="Filter by address" aria-label="Filter by address" value={filters.address} onChange={set('address')} />
      </div>
      {error && <p className="error">{error}</p>}
      <DataTable columns={columns} rows={rows} sort={sort} onSort={setSort} loading={loading} empty="No stores match these filters." />
    </section>
  );
}
