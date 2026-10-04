// Helpers for safe filtering and sorting (column names come from a whitelist, values are parameterized).
const escapeLike = (v) => String(v).replace(/[\\%_]/g, '\\$&');

function buildFilters(query, columnMap, exactKeys = []) {
  const where = [];
  const params = [];
  for (const [key, col] of Object.entries(columnMap)) {
    const val = (query[key] || '').toString().trim();
    if (!val) continue;
    if (exactKeys.includes(key)) {
      params.push(val);
      where.push(`${col} = $${params.length}`);
    } else {
      params.push(`%${escapeLike(val)}%`);
      where.push(`${col} ILIKE $${params.length}`);
    }
  }
  return { where: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

function buildOrder(query, sortMap, fallback) {
  const col = sortMap[query.sortBy] || sortMap[fallback];
  const dir = String(query.order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `ORDER BY ${col} ${dir} NULLS LAST, 1 ASC`;
}

module.exports = { buildFilters, buildOrder };
