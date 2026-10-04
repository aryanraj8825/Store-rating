import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, homeFor } from './auth.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminUserDetail from './pages/AdminUserDetail.jsx';
import AdminAddUser from './pages/AdminAddUser.jsx';
import AdminStores from './pages/AdminStores.jsx';
import AdminAddStore from './pages/AdminAddStore.jsx';
import UserStores from './pages/UserStores.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="state">Loading…</p>;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/new" element={<AdminAddUser />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/stores/new" element={<AdminAddStore />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['USER']} />}>
        <Route element={<Layout />}>
          <Route path="/stores" element={<UserStores />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['OWNER']} />}>
        <Route element={<Layout />}>
          <Route path="/owner" element={<OwnerDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={user ? homeFor(user.role) : '/login'} replace />} />
    </Routes>
  );
}
