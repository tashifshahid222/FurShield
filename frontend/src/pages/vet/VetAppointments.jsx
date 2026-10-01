import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const truncate = (s, n = 35) => (s && s.length > n ? `${s.slice(0, n).replace(/\s+$/, '')}...` : s);

const statusBadge = {
  requested: <span className="badge badge-warning">Requested</span>,
  approved: <span className="badge badge-info">Approved</span>,
  completed: <span className="badge badge-success">Completed</span>,
  rejected: <span className="badge badge-danger">Rejected</span>,
  cancelled: <span className="badge badge-neutral">Cancelled</span>,
  rescheduled: <span className="badge badge-teal">Rescheduled</span>,
};

export const VetAppointments = () => {
  const { refreshUnread } = useAuth();
  const { showToast } = useToast();
  const { handleModeChange, registerExitMode } = useSidebarTable();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reschedule, setReschedule] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    handleModeChange(!!detail || !!reschedule);
  }, [detail, reschedule, handleModeChange]);

  // Register exit mode callback
  useEffect(() => {
    return registerExitMode(() => {
      setDetail(null);
      setReschedule(null);
    });
  }, [registerExitMode]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getAll({ limit: 100 });
      setAppointments(res.data || []);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await appointmentApi.updateStatus(id, { newStatus });
      showToast(res.message || 'Updated');
      refreshUnread();
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const submitReschedule = async () => {
    if (!reschedule || !rescheduleData.date || !rescheduleData.time) {
      showToast('Please pick a new date and time', 'error');
      return;
    }
    try {
      const res = await appointmentApi.updateStatus(reschedule._id, {
        newStatus: 'rescheduled',
        rescheduleDate: rescheduleData.date,
        rescheduleTime: rescheduleData.time,
      });
      showToast(res.message || 'Appointment rescheduled');
      setReschedule(null);
      refreshUnread();
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {!detail && (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Appointments</h1>
            <p className="text-muted">Approve, complete, reschedule or reject requests</p>
          </div>
          <Link to="/veterinarian/profile" className="btn btn-outline btn-sm">Manage availability</Link>
        </div>
      )}

      {!detail && (loading ? <Loading /> : appointments.length === 0 ? (
        <EmptyState title="No appointments yet" message="New booking requests will appear here." />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Owner</th>
                <th>Date & time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>
                    <Link to={`/veterinarian/patients/${a.pet?._id}`} style={{ fontWeight: 600 }}>
                      {a.pet?.name || '—'}
                    </Link>
                    <div className="text-small text-muted">{a.pet?.species}</div>
                  </td>
                  <td>{a.owner?.name}<div className="text-small text-muted">{a.owner?.phone}</div></td>
                  <td>{formatDate(a.date)}<div className="text-small text-muted">{a.time}</div></td>
                  <td className="reason-cell" title={a.reason}>{truncate(a.reason)}</td>
                  <td>{statusBadge[a.status] || <span className="badge badge-neutral">{a.status}</span>}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setDetail(a)}>Detail</button>
                      {a.status === 'requested' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(a._id, 'approved')}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a._id, 'rejected')}>Reject</button>
                        </>
                      )}
                      {a.status === 'approved' && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(a._id, 'completed')}>Complete</button>
                          <button className="btn btn-outline-teal btn-sm" onClick={() => setReschedule(a)}>Reschedule</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {detail && (
        <>
          <div className="health-timeline-title" style={{ marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Appointment detail</h1>
              <p className="text-muted mb-4">{detail.pet?.name || 'Pet'} · {detail.owner?.name || 'Owner'}</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}>Back to appointments</button>
          </div>
          <div className="card card-padded mb-3">
            <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <div className="form-label">Pet</div>
              <div><strong>{detail.pet?.name || '—'}</strong></div>
              <div className="text-small text-muted">{detail.pet?.species}{detail.pet?.breed ? ` · ${detail.pet.breed}` : ''}{detail.pet?.age ? ` · ${detail.pet.age} yr` : ''}</div>
            </div>
            <div className="form-group">
              <div className="form-label">Owner</div>
              <div><strong>{detail.owner?.name || '—'}</strong></div>
              {detail.owner?.phone && <div className="text-small text-muted">{detail.owner.phone}</div>}
            </div>
            <div className="form-group">
              <div className="form-label">Date & time</div>
              <span>{formatDate(detail.date)} at {detail.time}</span>
            </div>
            <div className="form-group">
              <div className="form-label">Requested on</div>
              <span>{formatDate(detail.createdAt)}</span>
            </div>
            <div className="form-group">
              <div className="form-label">Status</div>
              {statusBadge[detail.status] || <span className="badge badge-neutral">{detail.status}</span>}
            </div>
          </div>
          {detail.reason && (
            <div className="form-group">
              <div className="form-label">Reason</div>
              <p className="text-muted mt-1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{detail.reason}</p>
            </div>
          )}
          {detail.notes && (
            <div className="form-group">
              <div className="form-label">Notes</div>
              <p className="text-muted mt-1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{detail.notes}</p>
            </div>
          )}
          </div>
        </>
      )}

      {reschedule && (
        <Modal title={`Reschedule appointment for ${reschedule.pet?.name}`} onClose={() => setReschedule(null)}>
          <p className="text-muted text-small mb-2">Current: {formatDate(reschedule.date)} at {reschedule.time}</p>
          <div className="form-group">
            <label className="form-label">New date</label>
            <input className="form-control" type="date" min={new Date().toISOString().split('T')[0]} value={rescheduleData.date} onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">New time</label>
            <SelectDropdown
              value={rescheduleData.time}
              onChange={(v) => setRescheduleData({ ...rescheduleData, time: v })}
              placeholder="Select time..."
              options={['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map((t) => ({ value: t, label: t }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setReschedule(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitReschedule}>Reschedule</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default VetAppointments;