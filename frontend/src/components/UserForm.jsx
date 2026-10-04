import { useState } from 'react';
import Field from './Field.jsx';
import { rules, validate } from '../validators.js';
import { ApiError } from '../api.js';

// Shared by sign up (no role picker) and the admin "Add user" page (with role picker).
export default function UserForm({ onSubmit, submitLabel, withRole = false, onDone }) {
  const [values, setValues] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const errs = validate(values, { name: rules.name, email: rules.email, address: rules.address, password: rules.password });
    setErrors(errs);
    setFormError('');
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await onSubmit(values);
      onDone?.();
    } catch (err) {
      if (err instanceof ApiError) { setErrors(err.errors); setFormError(err.message); } else setFormError('Could not reach the server');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="form">
      <Field label="Full name" error={errors.name} hint="20 to 60 characters">
        <input value={values.name} onChange={set('name')} autoComplete="name" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" value={values.email} onChange={set('email')} autoComplete="email" />
      </Field>
      <Field label="Address" error={errors.address} hint={`${values.address.length}/400`}>
        <textarea rows={3} value={values.address} onChange={set('address')} />
      </Field>
      <Field label="Password" error={errors.password} hint="8 to 16 characters, one uppercase letter, one special character">
        <input type="password" value={values.password} onChange={set('password')} autoComplete="new-password" />
      </Field>
      {withRole && (
        <Field label="Role" error={errors.role}>
          <select value={values.role} onChange={set('role')}>
            <option value="USER">Normal user</option>
            <option value="OWNER">Store owner</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </Field>
      )}
      {formError && !Object.keys(errors).length && <p className="error" role="alert">{formError}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
    </form>
  );
}
