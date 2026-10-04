import { useState } from 'react';
import { api, ApiError } from '../api.js';
import Field from '../components/Field.jsx';
import { rules } from '../validators.js';

export default function ChangePassword() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setDone(false);
    const errs = {};
    if (!values.currentPassword) errs.currentPassword = 'Current password is required';
    const pw = rules.password(values.newPassword);
    if (pw) errs.newPassword = pw;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api('/auth/password', { method: 'PUT', body: values });
      setValues({ currentPassword: '', newPassword: '' });
      setDone(true);
    } catch (err) {
      setErrors(err instanceof ApiError ? err.errors : { currentPassword: 'Could not reach the server' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="narrow">
      <h1>Change password</h1>
      <form onSubmit={submit} className="form" noValidate>
        <Field label="Current password" error={errors.currentPassword}>
          <input type="password" value={values.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" />
        </Field>
        <Field label="New password" error={errors.newPassword} hint="8 to 16 characters, one uppercase letter, one special character">
          <input type="password" value={values.newPassword} onChange={set('newPassword')} autoComplete="new-password" />
        </Field>
        {done && <p className="success" role="status">Password updated.</p>}
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
      </form>
    </section>
  );
}
