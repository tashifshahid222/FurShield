import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { PetCard } from '../../components/PetCard';
import { EmptyState } from '../../components/EmptyState';
import Icon from '../../components/Icon';
import { formatDate, imageUrl } from '../../utils/helpers';

const appointmentBadge = {
  requested: <span className="badge appointment-status-requested">Requested</span>,
  approved: <span className="badge appointment-status-approved">Approved</span>,
  completed: <span className="badge appointment-status-completed">Completed</span>,
  rejected: <span className="badge appointment-status-rejected">Rejected</span>,
  cancelled: <span className="badge appointment-status-cancelled">Cancelled</span>,
  rescheduled: <span className="badge appointment-status-rescheduled">Rescheduled</span>,
};

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.owner()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading your dashboard..." />;
  if (!data) return <EmptyState title="Nothing to show yet" action={<Link className="btn btn-primary" to="/owner/pets/new">Add your first pet</Link>} />;

  return (
    <>
      <div className="greeting">
        <h1>Welcome back, {user?.name?.split(' ')[0]}! <Icon name="paw" size={26} style={{ color: 'var(--primary)', verticalAlign: 'middle' }} /></h1>
        <p>Here's what's happening with your pets.</p>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}><Icon name="paw" size={22} /></div>
          <div>
            <h3>{data.petCount}</h3>
            <p>Pets in your family</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}><Icon name="calendar" size={22} /></div>
          <div>
            <h3>{data.upcomingAppointments?.length || 0}</h3>
            <p>Upcoming appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><Icon name="box" size={22} /></div>
          <div>
            <h3>{data.recentOrders?.length || 0}</h3>
            <p>Recent orders</p>
          </div>
        </div>
      </div>

      <div className="health-timeline-title">
        <h2 style={{ fontSize: '1.2rem' }}>My pets</h2>
        <Link to="/owner/pets" className="btn btn-outline btn-sm">Manage pets</Link>
      </div>
      {data.pets && data.pets.length > 0 ? (
        <div className="grid grid-3 mb-4">
          {data.pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </div>
      ) : (
        <EmptyState
          title="No pets added yet"
          message="Add your first pet profile to get started."
          action={<Link to="/owner/pets/new" className="btn btn-primary mt-2">Add a pet</Link>}
        />
      )}

      <div className="grid grid-2 mt-4" style={{ alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Upcoming appointments</h2>
          {data.upcomingAppointments?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.upcomingAppointments.map((a) => (
                <div className="card card-padded" key={a._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div>
                      <strong>{a.pet?.name || 'Pet'}</strong> with {a.veterinarian?.name}
                      <div className="text-small text-muted">{formatDate(a.date)} at {a.time}</div>
                    </div>
                    {appointmentBadge[a.status] || <span className="badge badge-neutral">{a.status}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No upcoming appointments" message="Book a visit with a veterinarian." action={<Link className="btn btn-secondary btn-sm mt-2" to="/veterinarians">Find a vet</Link>} />
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Health reminders</h2>
          {data.healthReminders?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.healthReminders.map((r) => (
                <div className="card card-padded" key={r._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.3rem' }}>{r.pet?.image ? <img src={imageUrl(r.pet.image)} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} /> : <Icon name="paw" size={20} style={{ color: 'var(--primary)' }} />}</span>
                    <div>
                      <strong>{r.title}</strong>
                      <div className="text-small text-muted">Due {formatDate(r.nextDueDate)} · {r.pet?.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No health reminders" message="Add vaccination or follow-up records to get reminders." icon="medical-cross" />
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;