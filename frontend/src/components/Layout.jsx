import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Icon from './Icon.jsx';
import { Brand } from './PublicHeader.jsx';

const NAV = {
  ADMIN: [['/admin', 'Dashboard', 'dashboard', true], ['/admin/users', 'Users', 'users'], ['/admin/stores', 'Stores', 'store']],
  USER: [['/stores', 'Stores', 'store']],
  OWNER: [['/owner', 'My stores', 'store']],
};
const ROLE_LABEL = { ADMIN: 'Administrator', USER: 'Shopper', OWNER: 'Store owner' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [...(NAV[user.role] || []), ['/password', 'Password', 'key']];
  const initials = user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand light />
        <nav aria-label="Main" className="side-nav">
          {links.map(([to, label, icon, end]) => (
            <NavLink key={to} to={to} end={end}><Icon name={icon} size={18} />{label}</NavLink>
          ))}
        </nav>
        <div className="side-user">
          <span className="avatar avatar-light">{initials}</span>
          <div className="side-user-text">
            <strong title={user.name}>{user.name}</strong>
            <span>{ROLE_LABEL[user.role]}</span>
          </div>
          <button className="icon-btn" aria-label="Log out" title="Log out" onClick={() => { logout(); navigate('/login'); }}>
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
      <main className="page"><Outlet /></main>
    </div>
  );
}
