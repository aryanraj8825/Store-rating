// Static preview of the rating experience, used on the landing and sign-in pages.
const ROWS = [
  { name: 'Corner Cafe', area: 'Main Street', score: 4.8, count: 126 },
  { name: 'Green Basket Grocers', area: 'Station Road', score: 4.3, count: 89 },
  { name: 'Paper & Pine Books', area: 'Library Lane', score: 4.6, count: 54 },
];

export default function Showcase() {
  return (
    <div className="showcase" aria-hidden="true">
      {ROWS.map((r, i) => (
        <div key={r.name} className="showcase-row" style={{ marginLeft: i === 1 ? '2.5rem' : 0 }}>
          <span className="avatar">{r.name[0]}</span>
          <div className="showcase-text">
            <strong>{r.name}</strong>
            <span>{r.area} · {r.count} ratings</span>
          </div>
          <span className="score"><span className="star-on">★</span> {r.score.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}
