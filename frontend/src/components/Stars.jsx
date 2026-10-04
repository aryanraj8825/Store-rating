// Read-only display (value may be fractional) or interactive picker (onChange given).
export default function Stars({ value, onChange, label = 'Rating' }) {
  if (onChange) {
    return (
      <div className="stars stars-input" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={n <= (value || 0) ? 'on' : ''}
            onClick={() => onChange(n)}
          >★</button>
        ))}
      </div>
    );
  }
  if (value == null) return <span className="muted">No ratings yet</span>;
  const pct = (value / 5) * 100;
  return (
    <span className="stars-static" title={`${value} out of 5`}>
      <span className="stars" aria-hidden="true">
        <span className="stars-bg">★★★★★</span>
        <span className="stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <strong>{value.toFixed(1)}</strong>
    </span>
  );
}
