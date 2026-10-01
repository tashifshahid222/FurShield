import { useEffect, useState } from 'react';
import { reviewApi, productApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import { RatingStars } from '../../components/RatingStars';

const statusBadge = {
  pending: <span className="badge badge-warning">Pending</span>,
  approved: <span className="badge badge-success">Approved</span>,
  rejected: <span className="badge badge-danger">Rejected</span>,
};

export const AdminReviews = () => {
  const { showToast } = useToast();
  const { tableVisible, handleModeChange, registerExitMode } = useSidebarTable();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [target, setTarget] = useState(null);

  useEffect(() => {
    handleModeChange(!!target);
  }, [target, handleModeChange]);

  // Register exit mode callback to clear target when sidebar link is clicked
  useEffect(() => {
    return registerExitMode(() => {
      setTarget(null);
    });
  }, [registerExitMode]);

  const load = (page = 1, status = statusFilter) => {
    setLoading(true);
    reviewApi.manageAll({ status: status || undefined, page, limit: 20 })
      .then((res) => {
        setReviews(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await reviewApi.updateStatus(id, status);
      showToast(res.message || 'Review status updated');
      if (status === 'approved') {
        try { await productApi.getAll({ limit: 1 }); } catch { /* noop */ }
      }
      setTarget(null);
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const removeReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await reviewApi.remove(id);
      showToast(res.message || 'Review deleted');
      setTarget(null);
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {!target && tableVisible && (
        <>
          <div className="health-timeline-title">
            <div>
              <h1 style={{ fontSize: '1.5rem' }}>Reviews</h1>
              <p className="text-muted">Moderate user reviews and ratings</p>
            </div>
          </div>

          <div className="filter-tabs mb-3">
            {['', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s || 'all'}
                className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
                onClick={() => { setStatusFilter(s); load(1, s); }}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

        {loading ? <Loading /> : reviews.length === 0 ? (
          <EmptyState title="No reviews" />
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table reviews-table">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Target</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r._id}>
                      <td>{r.author?.name || '—'}</td>
                      <td>
                        <span className="badge badge-info">{r.targetType}</span>
                        <div className="text-small text-muted">
                          {r.targetName || (typeof r.target === 'object' ? r.target?.name || r.target?.petName : '') || String(r.target).slice(-8)}
                        </div>
                      </td>
                      <td><RatingStars rating={r.rating} size={14} /></td>
                      <td style={{ maxWidth: 240 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setTarget(r)}>Read</button>
                      </td>
                      <td>{statusBadge[r.status] || <span className="badge badge-neutral">{r.status}</span>}</td>
                      <td className="text-small">{formatDate(r.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          {r.status !== 'approved' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(r._id, 'approved')}>Approve</button>}
                          {r.status !== 'rejected' && <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r._id, 'rejected')}>Reject</button>}
                          <button className="btn btn-ghost btn-sm" onClick={() => removeReview(r._id)}>Delete</button>
                        </div>
                      </td>
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
      )}

      {target && (
        <>
          <div className="health-timeline-title" style={{ marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Review detail</h1>
              <p className="text-muted mb-4">Review by {target.author?.name || 'Unknown'}</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTarget(null)}>Back to reviews</button>
          </div>
          <div className="card card-padded mb-3">
            <div className="review-card" style={{ border: 'none', boxShadow: 'none', padding: 0, background: 'transparent' }}>
              <div className="review-header">
                <div className="nav-avatar">{target.author?.name?.[0]?.toUpperCase() || '?'}</div>
                <div>
                  <strong>{target.author?.name || 'Anonymous'}</strong>
                  <div className="text-small text-muted">{formatDate(target.createdAt)}</div>
                  <RatingStars rating={target.rating} />
                </div>
              </div>
              <p className="text-small text-muted mb-2">On {target.targetType}{target.targetName ? ` - ${target.targetName}` : ''}</p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{target.comment}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              {target.status !== 'approved' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(target._id, 'approved')}>Approve</button>}
              {target.status !== 'rejected' && <button className="btn btn-danger btn-sm" onClick={() => updateStatus(target._id, 'rejected')}>Reject</button>}
              <button className="btn btn-ghost btn-sm" onClick={() => removeReview(target._id)}>Delete</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminReviews;