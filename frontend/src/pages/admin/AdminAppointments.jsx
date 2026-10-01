import { useEffect, useState } from 'react';
import { appointmentApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const statusBadge = {
  requested: <span className="badge badge-warning">Requested</span>,
  approved: <span className="badge badge-info">Approved</span>,
  completed: <span className="badge badge-success">Completed</span>,
  rejected: <span className="badge badge-danger">Rejected</span>,
  cancelled: <span className="badge badge-neutral">Cancelled</span>,
  rescheduled: <span className="badge badge-teal">Rescheduled</span>,
};

const truncate = (s, n = 35) => (s && s.length > n ? `${s.slice(0, n).replace(/\s+$/, '')}...` : s);

export const AdminAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');

  const load = (page = 1, status = statusFilter) => {
    setLoading(true);
    appointmentApi.getAll({ status: status || undefined, page, limit: 20 })
      .then((res) => {
        setAppointments(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Appointments</h1>
          <p className="text-muted">All consultations across the platform</p>
        </div>
      </div>

      <div className="filter-tabs mb-3">
        {['', 'requested', 'approved', 'completed', 'rejected', 'cancelled', 'rescheduled'].map((s) => (
          <button
            key={s || 'all'}
            className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => { setStatusFilter(s); load(1, s); }}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : appointments.length === 0 ? (
        <EmptyState title="No appointments" />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Owner</th>
                  <th>Veterinarian</th>
                  <th>Date & time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <strong>{a.pet?.name || '—'}</strong>
                      <div className="text-small text-muted">{a.pet?.species}</div>
                    </td>
                    <td>{a.owner?.name || '—'}</td>
                    <td>{a.veterinarian?.name || '—'}</td>
                    <td>{formatDate(a.date)}<div className="text-small text-muted">{a.time}</div></td>
                    <td style={{ maxWidth: 180 }} title={a.reason}><div className="text-truncate" style={{ maxWidth: 180 }}>{truncate(a.reason, 35)}</div></td>
                    <td>{statusBadge[a.status] || <span className="badge badge-neutral">{a.status}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-outline'}`} onClick={() => load(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminAppointments;