import { useState } from 'react';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';

export const ShelterProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const sp = user?.shelterProfile || {};
  const [form, setForm] = useState({
    name: sp.name || '',
    description: sp.description || '',
    establishedYear: sp.establishedYear || '',
    capacity: sp.capacity || '',
    website: sp.website || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateShelterProfile({
        ...form,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      });
      updateUser(res.data);
      showToast('Shelter profile saved');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Shelter Profile</h1>
      <p className="text-muted mb-4">Public information shown to families browsing adoptions.</p>

      <form onSubmit={save}>
        <div className="card card-padded mb-3">
          <div className="form-group">
            <label className="form-label">Shelter name <span className="required">*</span></label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">About your shelter</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Established year</label>
              <input className="form-control" type="number" min="1900" max={new Date().getFullYear()} name="establishedYear" value={form.establishedYear} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity (animals)</label>
              <input className="form-control" type="number" min="1" name="capacity" value={form.capacity} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <div className="card card-padded mb-3">
          <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Contact information</h3>
          <p className="text-muted text-small mb-3">This comes from your account profile. Update it under Profile settings.</p>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Contact person</label>
              <div className="form-control" style={{ background: 'var(--surface)' }}>{user?.name || '—'}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <div className="form-control" style={{ background: 'var(--surface)' }}>{user?.phone || '—'}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <div className="form-control" style={{ background: 'var(--surface)' }}>{[user?.address?.street, user?.address?.city, user?.address?.state, user?.address?.zip].filter(Boolean).join(', ') || '—'}</div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Shelter Profile'}
        </button>
      </form>
    </div>
  );
};

export default ShelterProfile;