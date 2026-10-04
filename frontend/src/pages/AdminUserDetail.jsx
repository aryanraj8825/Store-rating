import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import Stars from '../components/Stars.jsx';

const ROLE_LABEL = { ADMIN: 'Administrator', USER: 'Normal user', OWNER: 'Store owner' };

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api(`/admin/users/${id}`).then(setUser).catch((e) => setError(e.message)); }, [id]);

  return (
    <section className="narrow">
      <p><Link to="/admin/users">Back to users</Link></p>
      {error && <p className="error">{error}</p>}
      {user && (
        <>
          <h1>{user.name}</h1>
          <dl className="details">
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Address</dt><dd>{user.address}</dd>
            <dt>Role</dt><dd>{ROLE_LABEL[user.role]}</dd>
            {user.role === 'OWNER' && (<><dt>Store rating</dt><dd><Stars value={user.rating} /></dd></>)}
          </dl>
        </>
      )}
    </section>
  );
}
