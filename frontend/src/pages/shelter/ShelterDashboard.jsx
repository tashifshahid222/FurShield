import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import Icon from '../../components/Icon';
import { getErrorMessage } from '../../utils/helpers';

const statusBadge = {
  available: <span className="badge badge-success">Available</span>,
  pending: <span className="badge badge-warning">Pending</span>,
  adopted: <span className="badge badge-info">Adopted</span>,
};

export const ShelterDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.shelter()
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading your shelter dashboard..." />;
  if (!data) return <EmptyState title="No data yet" />;

  const pendingListings = (data.listings || []).filter((l) => l.adoptionInterests.some((i) => i.status === 'pending'));
  const flatPending = (data.listings || []).flatMap((l) =>
    l.adoptionInterests.filter((i) => i.status === 'pending').map((i) => ({ listing: l, interest: i }))
  );

  return (
    <>
      <div className="greeting">
        <h1>Welcome, {user?.shelterProfile?.name || user?.name?.split(' ')[0]}! <Icon name="building" size={26} style={{ color: 'var(--primary)', verticalAlign: 'middle' }} /></h1>
        <p>Manage your adoption listings and applicants here.</p>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><Icon name="paw" size={22} /></div>
          <div>
            <h3>{data.counts?.available}</h3>
            <p>Available for adoption</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-light)', color: 'var(--amber-700)' }}><Icon name="clock" size={22} /></div>
          <div>
            <h3>{data.pendingInterests}</h3>
            <p>Pending applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}><Icon name="heart-filled" size={22} /></div>
          <div>
            <h3>{data.counts?.adopted}</h3>
            <p>Adopted pets</p>
          </div>
        </div>
      </div>

      <div className="grid" style={{ alignItems: 'start' }}>
        <div>
          <div className="health-timeline-title">
            <h2 style={{ fontSize: '1.2rem' }}>Pending applications</h2>
            <Link to="/shelter/listings" className="btn btn-outline btn-sm">View all listings</Link>
          </div>
          {flatPending.length === 0 ? (
            <EmptyState title="No pending applications" message="When families apply to adopt, they'll appear here." icon="clipboard" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {flatPending.slice(0, 6).map(({ listing, interest }) => (
                <div className="card card-padded" key={interest._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                    <div>
                      <strong>{interest.adopter?.name || 'Applicant'} wants {listing.petName}</strong>
                      <div className="text-small text-muted">{interest.message}</div>
                      {interest.contactNumber && <div className="text-small text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="phone" size={13} /> {interest.contactNumber}</div>}
                    </div>
                    <Link to={`/shelter/listings/${listing._id}`} className="btn btn-ghost btn-sm">Review</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="health-timeline-title">
            <h2 style={{ fontSize: '1.2rem' }}>Recent listings</h2>
            <Link to="/shelter/listings/new" className="btn btn-primary btn-sm">+ New listing</Link>
          </div>
          {data.listings.length === 0 ? (
            <EmptyState title="No listings yet" message="Create your first adoption listing." icon="heart" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.listings.slice(0, 8).map((l) => (
                <Link to={`/shelter/listings/${l._id}`} key={l._id} className="card card-padded card-hover" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {l.images && l.images.length > 0 ? (
                      <img src={l.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="nav-avatar"><Icon name="paw" size={16} /></div>
                    )}
                    <div style={{ flex: 1 }}>
                      <strong>{l.petName}</strong>
                      <div className="text-small text-muted">{l.breed || l.species} ·  {(l.adoptionInterests || []).length} application(s)</div>
                    </div>
                    {statusBadge[l.adoptionStatus] || <span className="badge badge-neutral">{l.adoptionStatus}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShelterDashboard;