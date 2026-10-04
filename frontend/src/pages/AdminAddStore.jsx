import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api.js';
import Field from '../components/Field.jsx';
import { rules, validate } from '../validators.js';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  useEffect(() => { api('/admin/owners').then(setOwners).catch(() => {}); }, []);

  async function submit(e) {
    e.preventDefault();
    const errs = validate(values, { name: rules.required('Store name'), email: rules.email, address: rules.address });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api('/admin/stores', { method: 'POST', body: { ...values, ownerId: values.ownerId || null } });
      navigate('/admin/stores');
    } catch (err) {
      setErrors(err instanceof ApiError ? { ...err.errors, form: err.message } : { form: 'Could not reach the server' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="narrow">
      <h1>Add store</h1>
      <form onSubmit={submit} className="form" noValidate>
        <Field label="Store name" error={errors.name}><input value={values.name} onChange={set('name')} maxLength={100} /></Field>
        <Field label="Store email" error={errors.email}><input type="email" value={values.email} onChange={set('email')} /></Field>
        <Field label="Address" error={errors.address} hint={`${values.address.length}/400`}>
          <textarea rows={3} value={values.address} onChange={set('address')} />
        </Field>
        <Field label="Store owner" error={errors.ownerId} hint="Optional. Create a store owner user first if none are listed.">
          <select value={values.ownerId} onChange={set('ownerId')}>
            <option value="">No owner assigned</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
          </select>
        </Field>
        {errors.form && !errors.email && <p className="error" role="alert">{errors.form}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Add store'}</button>
      </form>
    </section>
  );
}
