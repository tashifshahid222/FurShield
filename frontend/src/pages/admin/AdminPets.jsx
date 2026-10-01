import { useEffect, useState } from 'react';
import { petApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, imageUrl, speciesEmoji } from '../../utils/helpers';

export const AdminPets = () => {
  const { showToast } = useToast();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');

  const load = (page = 1) => {
    setLoading(true);
    petApi.getAll({ search: search || undefined, page, limit: 20 })
      .then((res) => {
        setPets(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(err.response?.data?.message || 'Failed to load pets', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const removePet = async (id) => {
    if (!window.confirm('Delete this pet profile?')) return;
    try {
      const res = await petApi.remove(id);
      showToast(res.message || 'Pet deleted');
      load(pagination.page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Pets</h1>
          <p className="text-muted">All pet profiles registered on the platform</p>
        </div>
      </div>

      <div className="filter-row mb-3">
        <input className="form-control" style={{ maxWidth: 260 }} placeholder="Search pets..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(1)} />
        <button className="btn btn-outline btn-sm" onClick={() => load(1)}>Search</button>
      </div>

      {loading ? <Loading /> : pets.length === 0 ? (
        <EmptyState title="No pets found" />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Species</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.image ? <img src={imageUrl(p.image)} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div className="nav-avatar">{speciesEmoji[p.species]}</div>}
                        <div>
                          <strong>{p.name}</strong>
                          {p.breed && <div className="text-small text-muted">{p.breed}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{p.species}</td>
                    <td>{p.owner?.name || '—'}</td>
                    <td><span className="badge badge-info">{p.status || 'active'}</span></td>
                    <td className="text-small">{formatDate(p.createdAt)}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => removePet(p._id)}>Delete</button></td>
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

export default AdminPets;