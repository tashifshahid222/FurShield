import { useEffect, useState } from 'react';
import { contactApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const statusBadge = {
  new: <span className="badge badge-warning">New</span>,
  read: <span className="badge badge-info">Read</span>,
  replied: <span className="badge badge-success">Replied</span>,
};

export const AdminMessages = () => {
  const { showToast } = useToast();
  const { handleModeChange, registerExitMode } = useSidebarTable();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    handleModeChange(!!selected);
  }, [selected, handleModeChange]);

  // Register exit mode callback to clear selected message when sidebar link is clicked
  useEffect(() => {
    return registerExitMode(() => {
      setSelected(null);
    });
  }, [registerExitMode]);

  const load = () => {
    setLoading(true);
    contactApi.getAll()
      .then((res) => setMessages(res.data || []))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openMessage = async (m) => {
    setSelected(m);
    if (m.status === 'new') {
      try {
        await contactApi.updateStatus(m._id, 'read');
        setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, status: 'read' } : x)));
      } catch { /* noop */ }
    }
  };

  const markReplied = async (id) => {
    try {
      const res = await contactApi.updateStatus(id, 'replied');
      showToast(res.message || 'Marked as replied');
      setMessages((prev) => prev.map((x) => (x._id === id ? res.data : x)));
      setSelected((s) => (s && s._id === id ? res.data : s));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const deleteMessage = async (m) => {
    if (!window.confirm(`Delete message from ${m.name}? This cannot be undone.`)) return;
    try {
      const res = await contactApi.remove(m._id);
      showToast(res.message || 'Message deleted');
      setMessages((prev) => prev.filter((x) => x._id !== m._id));
      setSelected((s) => (s && s._id === m._id ? null : s));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {!selected && (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Contact messages</h1>
            <p className="text-muted">Messages sent from the Contact page</p>
          </div>
        </div>
      )}

      {selected && (
        <>
          <div className="health-timeline-title" style={{ marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Message detail</h1>
              <p className="text-muted mb-4">View message from {selected.name}</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Back to messages</button>
          </div>
          <div className="card card-padded mb-3">
            <div className="health-timeline-title" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.1rem' }}>{selected.subject || 'Message'}</h2>
            </div>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <div className="form-label">From</div>
              <div><strong>{selected.name}</strong></div>
            </div>
            <div className="form-group">
              <div className="form-label">Email</div>
              <a href={`mailto:${selected.email}`}>{selected.email}</a>
            </div>
            {selected.phone && (
              <div className="form-group">
                <div className="form-label">Phone</div>
                <span>{selected.phone}</span>
              </div>
            )}
            <div className="form-group">
              <div className="form-label">Date</div>
              <span>{formatDate(selected.createdAt)}</span>
            </div>
            <div className="form-group">
              <div className="form-label">Status</div>
              {statusBadge[selected.status] || <span className="badge badge-neutral">{selected.status}</span>}
            </div>
            <div className="form-group">
              <div className="form-label">Subject</div>
              <span>{selected.subject || '—'}</span>
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">Message</div>
            <p style={{ whiteSpace: 'pre-wrap', margin: '8px 0 16px' }}>{selected.message}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <a className="btn btn-primary btn-sm" href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'FurShield enquiry'}`}>
              Reply via email
            </a>
            {selected.status !== 'replied' && (
              <button className="btn btn-outline btn-sm" onClick={() => markReplied(selected._id)}>Mark as replied</button>
            )}
          </div>
          <p className="text-small text-muted mt-3">Replying opens your email client. FurShield does not send email automatically.</p>
          </div>
        </>
      )}

      {!selected && (loading ? <Loading /> : messages.length === 0 ? (
        <EmptyState title="No messages yet" icon="mail" />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td>
                    <strong>{m.name}</strong>
                    <div className="text-small text-muted">{m.email}</div>
                  </td>
                  <td>{m.subject || '—'}</td>
                  <td>{statusBadge[m.status] || <span className="badge badge-neutral">{m.status}</span>}</td>
                  <td className="text-small">{formatDate(m.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => openMessage(m)}>Detail</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(m)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default AdminMessages;