import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import UserForm from '../components/UserForm.jsx';

export default function AdminAddUser() {
  const navigate = useNavigate();
  return (
    <section className="narrow">
      <h1>Add user</h1>
      <UserForm
        withRole
        submitLabel="Add user"
        onSubmit={(values) => api('/admin/users', { method: 'POST', body: values })}
        onDone={() => navigate('/admin/users')}
      />
    </section>
  );
}
