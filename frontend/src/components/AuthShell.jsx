import { Brand } from './PublicHeader.jsx';
import Showcase from './Showcase.jsx';

export default function AuthShell({ children }) {
  return (
    <div className="auth-split">
      <aside className="auth-aside">
        <Brand light />
        <div>
          <h2>Honest ratings, one store at a time.</h2>
          <p>Shoppers rate. Owners listen. Everyone sees the same score.</p>
          <Showcase />
        </div>
        <small>&copy; {new Date().getFullYear()} Storefront Ratings</small>
      </aside>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}
