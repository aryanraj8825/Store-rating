// Mirrors the backend rules so users get instant feedback.
export const rules = {
  name: (v) => (v.trim().length < 20 ? 'Name must be at least 20 characters' : v.trim().length > 60 ? 'Name must be at most 60 characters' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address'),
  address: (v) => (!v.trim() ? 'Address is required' : v.trim().length > 400 ? 'Address must be at most 400 characters' : ''),
  password: (v) =>
    v.length < 8 || v.length > 16
      ? 'Password must be 8-16 characters'
      : !/[A-Z]/.test(v)
      ? 'Password needs at least one uppercase letter'
      : !/[^A-Za-z0-9]/.test(v)
      ? 'Password needs at least one special character'
      : '',
  required: (label) => (v) => (v ? '' : `${label} is required`),
};

export function validate(values, schema) {
  const errors = {};
  for (const [key, rule] of Object.entries(schema)) {
    const msg = rule(values[key] ?? '');
    if (msg) errors[key] = msg;
  }
  return errors;
}
