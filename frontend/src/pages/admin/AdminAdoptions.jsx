import { useEffect, useState } from 'react';
import { adoptionApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage, imageUrl, speciesEmoji } from '../../utils/helpers';

const statusBadge = {
  available: <span className="badge badge-success">Available</span>,
  pending: <span className="badge badge-warning">Pending</span>,
  adopted: <span className="badge badge-info">Adopted</span>,
};

export const AdminAdoptions = () => {
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');

  const load = (page = 1, status = statusFilter) => {
    setLoading(true);
    adoptionApi.getAll({ adoptionStatus: status || undefined, page, limit: 20 })
      .then((res) => {
        setListings(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const removeListing = async (id) => {
    if (!window.confirm('Delete this adoption listing?')) return;
    try {
      const res = await adoptionApi.remove(id);
      showToast(res.message || 'Listing deleted');
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Adoption listings</h1>
          <p className="text-muted">All pets currently listed for adoption</p>
        </div>
      </div>

      <div className="filter-tabs mb-3">
        {['', 'available', 'pending', 'adopted'].map((s) => (
          <button
            key={s || 'all'}
            className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => { setStatusFilter(s); load(1, s); }}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : listings.length === 0 ? (
        <EmptyState title="No adoption listings" />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Shelter</th>
                  <th>Species</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Listed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {l.images?.length ? <img src={imageUrl(l.images[0])} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} /> : <div className="nav-avatar">{speciesEmoji[l.species]}</div>}
                        <strong>{l.petName}</strong>
                      </div>
                    </td>
                    <td>{l.shelter?.shelterProfile?.name || l.shelter?.name || '—'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{l.species} {l.breed ? `· ${l.breed}` : ''}</td>
                    <td>{(l.adoptionInterests || []).length}</td>
                    <td>{statusBadge[l.adoptionStatus] || <span className="badge badge-neutral">{l.adoptionStatus}</span>}</td>
                    <td className="text-small">{formatDate(l.createdAt)}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => removeListing(l._id)}>Delete</button></td>
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

export default AdminAdoptions;