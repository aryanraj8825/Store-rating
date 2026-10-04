import { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable.jsx';
import { useList } from '../hooks.js';

const ROLE_LABEL = { ADMIN: 'Administrator', USER: 'Normal user', OWNER: 'Store owner' };

export default function AdminUsers() {
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ by: 'name', order: 'asc' });
  const { rows, loading, error } = useList('/admin/users', filters, sort);
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <Link to={`/admin/users/${r.id}`}>{r.name}</Link> },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role', render: (r) => ROLE_LABEL[r.role] },
  ];

  return (
    <section>
      <div className="page-head">
        <h1>Users</h1>
        <Link className="btn" to="/admin/users/new">Add user</Link>
      </div>
      <div className="filters">
        <input placeholder="Filter by name" aria-label="Filter by name" value={filters.name} onChange={set('name')} />
        <input placeholder="Filter by email" aria-label="Filter by email" value={filters.email} onChange={set('email')} />
        <input placeholder="Filter by address" aria-label="Filter by address" value={filters.address} onChange={set('address')} />
        <select aria-label="Filter by role" value={filters.role} onChange={set('role')}>
          <option value="">All roles</option>
          <option value="USER">Normal user</option>
          <option value="OWNER">Store owner</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <DataTable columns={columns} rows={rows} sort={sort} onSort={setSort} loading={loading} empty="No users match these filters." />
    </section>
  );
}
