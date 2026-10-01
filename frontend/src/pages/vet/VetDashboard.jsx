import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, appointmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import Icon from '../../components/Icon';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const truncate = (s, n = 35) => (s && s.length > n ? `${s.slice(0, n).replace(/\s+$/, '')}...` : s);

const statusBadge = {
  requested: <span className="badge badge-warning">Requested</span>,
  approved: <span className="badge badge-info">Approved</span>,
  completed: <span className="badge badge-success">Completed</span>,
  rejected: <span className="badge badge-danger">Rejected</span>,
  cancelled: <span className="badge badge-neutral">Cancelled</span>,
  rescheduled: <span className="badge badge-teal">Rescheduled</span>,
};

export const VetDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.vet()
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await appointmentApi.updateStatus(id, { newStatus });
      showToast(res.message || 'Updated');
      const dash = await dashboardApi.vet();
      setData(dash.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  if (loading) return <Loading text="Loading your practice dashboard..." />;
  if (!data) return <EmptyState title="No data yet" />;

  const pending = (data.appointments || []).filter((a) => a.status === 'requested');

  return (
    <>
      <div className="greeting">
        <h1>Welcome, {user?.name?.split(' ')[0]}! <Icon name="stethoscope" size={26} style={{ color: 'var(--primary)', verticalAlign: 'middle' }} /></h1>
        <p>Here's what needs your attention today.</p>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-light)', color: 'var(--amber-700)' }}><Icon name="clock" size={22} /></div>
          <div>
            <h3>{data.pendingRequests}</h3>
            <p>Pending requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}><Icon name="check-circle" size={22} /></div>
          <div>
            <h3>{data.counts?.approved || 0}</h3>
            <p>Approved appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><Icon name="award" size={22} /></div>
          <div>
            <h3>{data.counts?.completed || 0}</h3>
            <p>Completed visits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="health-timeline-title">
            <h2 style={{ fontSize: '1.2rem' }}>Pending approvals</h2>
            <Link to="/veterinarian/appointments" className="btn btn-outline btn-sm">All appointments</Link>
          </div>
          {pending.length === 0 ? (
            <EmptyState title="All caught up!" message="No pending appointment requests." icon="check-circle" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map((a) => (
                <div className="card card-padded" key={a._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <strong>{a.pet?.name} · {a.owner?.name}</strong>
                      <div className="text-small text-muted">{formatDate(a.date)} at {a.time}</div>
                      <div className="text-small text-muted" title={a.reason}>{truncate(a.reason)}</div>
                    </div>
                  </div>
                  <div className="table-actions mt-2">
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(a._id, 'approved')}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a._id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Recent patients</h2>
          {data.patientPets && data.patientPets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.patientPets.slice(0, 8).map((p) => (
                <Link to={`/veterinarian/patients/${p._id}`} key={p._id} className="card card-padded card-hover" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {p.image ? (
                      <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="nav-avatar">{p.name?.[0]}</div>
                    )}
                    <div>
                      <strong>{p.name}</strong>
                      <div className="text-small text-muted">{p.species} · owner: {p.owner?.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No patients yet" message="Patients appear after approved appointments." icon="paw" />
          )}
        </div>
      </div>
    </>
  );
};

export default VetDashboard;