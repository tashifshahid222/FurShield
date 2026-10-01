import { useState } from 'react';
import { notificationApi, userApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const AdminNotifications = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ recipient: '', title: '', message: '', link: '' });
  const [recipientType, setRecipientType] = useState('specific');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);

  const searchUsers = async (q) => {
    try {
      const res = await userApi.getAll({ search: q, limit: 10 });
      setUsers(res.data || []);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const send = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      showToast('Title and message are required', 'error');
      return;
    }
    setSending(true);
    try {
      const payload = { title: form.title, message: form.message };
      if (form.link) payload.link = form.link;
      let count = 0;
      if (recipientType === 'specific' && form.recipient) {
        payload.recipient = form.recipient;
        await notificationApi.send(payload);
        count = 1;
      } else if (recipientType === 'role' && form.recipient) {
        const all = await userApi.getAll({ role: form.recipient, limit: 1000 });
        for (const u of all.data || []) {
          if (u.status === 'active') {
            await notificationApi.send({ ...payload, recipient: u._id });
            count += 1;
          }
        }
      } else if (recipientType === 'all') {
        const all = await userApi.getAll({ limit: 1000 });
        for (const u of all.data || []) {
          if (u.status === 'active') {
            await notificationApi.send({ ...payload, recipient: u._id });
            count += 1;
          }
        }
      } else {
        showToast('Pick a recipient', 'error');
        setSending(false);
        return;
      }
      showToast(count === 1 ? 'Notification sent' : `Sent to ${count} users`);
      setForm({ recipient: '', title: '', message: '', link: '' });
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Broadcast notifications</h1>
      <p className="text-muted mb-4">Send a notification to a specific user, a role, or everyone.</p>

      <div className="card card-padded">
        <form onSubmit={send}>
          <div className="form-group">
            <label className="form-label">Recipient</label>
            <div className="filter-tabs mb-2">
              {['specific', 'role', 'all'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`filter-tab ${recipientType === t ? 'active' : ''}`}
                  onClick={() => { setRecipientType(t); setForm({ ...form, recipient: '' }); setSearch(''); }}
                >
                  {t === 'specific' ? 'Specific user' : t === 'role' ? 'By role' : 'All users'}
                </button>
              ))}
            </div>

            {recipientType === 'specific' && (
              <>
                <input
                  className="form-control"
                  placeholder="Type to search users by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); if (e.target.value.length > 1) searchUsers(e.target.value); }}
                />
                {search && users.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {users.map((u) => (
                      <button
                        key={u._id}
                        type="button"
                        className="card card-padded card-hover"
                        style={{ textAlign: 'left', padding: '10px 12px' }}
                        onClick={() => { setForm({ ...form, recipient: u._id }); setSearch(`${u.name} (${u.email})`); setUsers([]); }}
                      >
                        <strong style={{ fontSize: '0.9rem' }}>{u.name}</strong>
                        <span className="text-small text-muted"> · {u.role}</span>
                        <div className="text-small text-muted">{u.email}</div>
                      </button>
                    ))}
                  </div>
                )}
                {search && !form.recipient && users.length === 0 && <p className="text-small text-muted mt-1">No users found.</p>}
              </>
            )}

            {recipientType === 'role' && (
              <SelectDropdown
                value={form.recipient}
                onChange={(v) => setForm({ ...form, recipient: v })}
                placeholder="Select a role..."
                options={[
                  { value: 'owner', label: 'Owners' },
                  { value: 'veterinarian', label: 'Veterinarians' },
                  { value: 'shelter', label: 'Shelters' },
                ]}
              />
            )}

            {recipientType === 'all' && <p className="text-small text-muted">This sends to every active user on the platform.</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Platform maintenance" required />
          </div>
          <div className="form-group">
            <label className="form-label">Message <span className="required">*</span></label>
            <textarea className="form-control" name="message" value={form.message} onChange={handleChange} rows={4} required />
          </div>
          <div className="form-group">
            <label className="form-label">Link (optional)</label>
            <input className="form-control" name="link" value={form.link} onChange={handleChange} placeholder="e.g. /care or /products" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;