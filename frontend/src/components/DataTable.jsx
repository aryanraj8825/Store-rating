// Sortable table. Sorting happens on the server; this component only reports clicks.
export default function DataTable({ columns, rows, sort, onSort, loading, empty = 'Nothing to show yet.', rowKey = 'id' }) {
  const next = (key) => onSort({ by: key, order: sort.by === key && sort.order === 'asc' ? 'desc' : 'asc' });

  return (
    <div className="table-wrap" aria-busy={loading}>
      <table>
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort.by === c.key;
              return (
                <th key={c.key} aria-sort={active ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {c.sortable === false ? c.label : (
                    <button className="th-btn" onClick={() => next(c.key)}>
                      {c.label}
                      <span className={`caret ${active ? 'active' : ''}`}>{active ? (sort.order === 'asc' ? '▲' : '▼') : '↕'}</span>
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[rowKey]}>
              {columns.map((c) => <td key={c.key} data-label={c.label}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={columns.length} className="state">{loading ? 'Loading…' : empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
