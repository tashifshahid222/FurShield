import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adoptionApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, imageUrl } from '../../utils/helpers';
import Icon from '../../components/Icon';

const statusBadge = {
  available: <span className="badge badge-success">Available</span>,
  pending: <span className="badge badge-warning">Pending</span>,
  adopted: <span className="badge badge-info">Adopted</span>,
};

export const ShelterListings = () => {
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    adoptionApi.getMine()
      .then((res) => {
        const list = res.data || [];
        setListings(filter === 'all' ? list : list.filter((l) => l.adoptionStatus === filter));
      })
      .catch((err) => showToast(err.response?.data?.message || 'Failed to load listings', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const removeListing = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      const res = await adoptionApi.remove(id);
      showToast(res.message || 'Listing deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete listing', 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Adoption Listings</h1>
          <p className="text-muted">Pets you have listed for adoption</p>
        </div>
        <Link to="/shelter/listings/new" className="btn btn-primary btn-sm">+ Add listing</Link>
      </div>

      <div className="filter-tabs mb-3">
        {['all', 'available', 'pending', 'adopted'].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : listings.length === 0 ? (
        <EmptyState title="No listings here" message="Add a new adoption listing to get started." action={<Link className="btn btn-primary btn-sm mt-2" to="/shelter/listings/new">+ Add listing</Link>} />
      ) : (
        <div className="grid grid-3">
          {listings.map((l) => (
            <div className="card" key={l._id}>
              {l.images && l.images.length > 0 ? (
                <img src={imageUrl(l.images[0])} alt={l.petName} className="pet-card-img" />
              ) : (
                <div className="pet-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-light)' }}>
                  <Icon name="paw" size={40} style={{ color: 'var(--primary)' }} />
                </div>
              )}
              <div className="card-padded">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{l.petName}</h3>
                  {statusBadge[l.adoptionStatus] || <span className="badge badge-neutral">{l.adoptionStatus}</span>}
                </div>
                <p className="text-small text-muted">
                  {l.species} {l.breed ? `· ${l.breed}` : ''} · Listed {formatDate(l.createdAt)}
                </p>
                <p className="text-small text-muted">{(l.adoptionInterests || []).length} application(s)</p>
                <div className="table-actions mt-2">
                  <Link to={`/shelter/listings/${l._id}`} className="btn btn-outline btn-sm">Manage</Link>
                  <Link to={`/shelter/listings/${l._id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => removeListing(l._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ShelterListings;