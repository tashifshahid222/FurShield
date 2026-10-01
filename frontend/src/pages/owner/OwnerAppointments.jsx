import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';

const statusBadge = {
  requested: <span className="badge badge-warning">Requested</span>,
  approved: <span className="badge badge-info">Approved</span>,
  completed: <span className="badge badge-success">Completed</span>,
  rejected: <span className="badge badge-danger">Rejected</span>,
  cancelled: <span className="badge badge-neutral">Cancelled</span>,
  rescheduled: <span className="badge badge-teal">Rescheduled</span>,
};

const tabs = ['all', 'upcoming', 'past'];

const truncate = (s, n = 35) => (s && s.length > n ? `${s.slice(0, n).replace(/\s+$/, '')}...` : s);

export const OwnerAppointments = () => {
  const { refreshUnread } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getAll({ limit: 100 });
      const all = res.data || [];
      const now = new Date();
      if (activeTab === 'upcoming') {
        setAppointments(all.filter((a) => new Date(a.date) >= now && ['requested', 'approved'].includes(a.status)));
      } else if (activeTab === 'past') {
        setAppointments(all.filter((a) => new Date(a.date) < now || ['completed', 'rejected', 'cancelled'].includes(a.status)));
      } else {
        setAppointments(all);
      }
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [activeTab]);

  const cancelAppointment = async (appointment) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const res = await appointmentApi.updateStatus(appointment._id, { newStatus: 'cancelled' });
      showToast(res.message || 'Appointment cancelled');
      refreshUnread();
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>My Appointments</h1>
          <p className="text-muted">Track and manage your vet visits</p>
        </div>
        <Link to="/veterinarians" className="btn btn-primary btn-sm"><Icon name="plus" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Book appointment</Link>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>
            {t === 'upcoming' ? 'Upcoming' : t === 'past' ? 'Past' : 'All'}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : appointments.length === 0 ? (
        <EmptyState title="No appointments here" message="Book a visit with a veterinarian to see it here." action={<Link className="btn btn-primary btn-sm mt-2" to="/veterinarians">Find a vet</Link>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {appointments.map((a) => (
            <div className="card card-padded" key={a._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem' }}>
                      {a.pet?.name || 'Pet'} · {a.veterinarian?.name || 'Vet'}
                    </h3>
                    {statusBadge[a.status] || <span className="badge badge-neutral">{a.status}</span>}
                  </div>
                  <p className="text-muted text-small mt-1">
                    <Icon name="calendar" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {formatDate(a.date)} at {a.time}
                  </p>
                  {a.reason && (
                    <p className="text-muted mt-1" title={a.reason}>
                      <Icon name="file-text" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> <strong>Reason:</strong> {truncate(a.reason)}
                    </p>
                  )}
                  {a.notes && (
                    <p className="text-small text-muted mt-1" title={a.notes}>
                      <Icon name="clipboard" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {truncate(a.notes)}
                    </p>
                  )}
                </div>
                <div className="table-actions">
                  {['requested', 'approved'].includes(a.status) && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(a)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OwnerAppointments;