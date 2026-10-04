import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, homeFor } from '../auth.jsx';
import UserForm from '../components/UserForm.jsx';
import AuthShell from '../components/AuthShell.jsx';

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to={homeFor(user.role)} replace />;

  return (
    <AuthShell>
      <h1>Create your account</h1>
      <p className="muted">It takes a minute, and you can start rating right away.</p>
      <UserForm
        submitLabel="Create account"
        onSubmit={async ({ name, email, address, password }) => { await signup({ name, email, address, password }); }}
        onDone={() => navigate('/stores', { replace: true })}
      />
      <p className="switch">Already registered? <Link to="/login">Log in</Link></p>
    </AuthShell>
  );
}
