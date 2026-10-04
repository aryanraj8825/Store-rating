import { useEffect, useState } from 'react';
import { api } from './api.js';

export function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// Fetches a list whenever filters or sorting change.
export function useList(path, filters, sort) {
  const debounced = useDebounced(filters);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api(path, { params: { ...debounced, sortBy: sort.by, order: sort.order } })
      .then((d) => !cancelled && (setRows(d), setError('')))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [path, debounced, sort.by, sort.order, version]);

  return { rows, setRows, loading, error, reload: () => setVersion((n) => n + 1) };
}
