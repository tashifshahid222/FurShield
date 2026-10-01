import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adoptionApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage, imageUrl } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const statusBadge = {
  pending: <span className="badge badge-warning">Pending</span>,
  approved: <span className="badge badge-success">Approved</span>,
  rejected: <span className="badge badge-danger">Rejected</span>,
  withdrawn: <span className="badge badge-neutral">Withdrawn</span>,
};

export const ListingManage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [careModal, setCareModal] = useState(false);
  const [careForm, setCareForm] = useState({ careType: 'feeding', description: '', date: '' });

  const load = () => {
    setLoading(true);
    adoptionApi.getById(id)
      .then((res) => setListing(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const setInterestStatus = async (interestId, status) => {
    try {
      const res = await adoptionApi.updateInterest(id, { interestId, status });
      showToast(res.message || `Application ${status}`);
      setListing(res.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const markAdopted = async () => {
    if (!window.confirm(`Mark ${listing.petName} as adopted? This ends the listing.`)) return;
    try {
      const res = await adoptionApi.markAdopted(id);
      showToast(res.message || 'Marked as adopted');
      setListing(res.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const submitCare = async (e) => {
    e.preventDefault();
    try {
      const res = await adoptionApi.addCare(id, { type: careForm.careType, description: careForm.description, date: careForm.date || undefined });
      showToast(res.message || 'Care record added');
      setCareModal(false);
      setCareForm({ careType: 'feeding', description: '', date: '' });
      setListing(res.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  if (loading) return <Loading text="Loading listing..." />;
  if (!listing) return <div className="alert alert-error">Listing not found</div>;

  return (
    <>
      <Link to="/shelter/listings" className="btn btn-ghost btn-sm mb-2">← Back to listings</Link>

      <div className="health-timeline-title mb-3">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{listing.petName}</h1>
          <p className="text-muted">{listing.breed || listing.species} · {listing.age ? `${listing.age} y/o` : ''} · {listing.location || ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {listing.adoptionStatus !== 'adopted' && (
            <button className="btn btn-success btn-sm" onClick={markAdopted}>Mark as adopted</button>
          )}
          <Link to={`/shelter/listings/${id}/edit`} className="btn btn-outline btn-sm">Edit listing</Link>
        </div>
      </div>

      {listing.adoptionStatus === 'adopted' && (
        <div className="alert alert-success mb-3"><strong>Adopted!</strong> This pet found a loving home.</div>
      )}

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="card card-padded mb-3">
            <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>Applicants</h2>
            {listing.adoptionInterests.length === 0 ? (
              <EmptyState title="No applications yet" message="Interested families will appear here." icon="clipboard" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {listing.adoptionInterests.map((i) => (
                  <div className="card card-padded" key={i._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <div>
                        <strong>{i.adopter?.name || 'Applicant'}</strong>
                        <div className="text-small text-muted">{i.adopter?.email}{i.adopter?.phone ? ` · ${i.adopter.phone}` : ''}</div>
                        {i.message && <p className="text-small mt-1" style={{ whiteSpace: 'pre-wrap' }}>{i.message}</p>}
                      </div>
                      {statusBadge[i.status] || <span className="badge badge-neutral">{i.status}</span>}
                    </div>
                    {i.status === 'pending' && (
                      <div className="table-actions mt-2">
                        <button className="btn btn-success btn-sm" onClick={() => setInterestStatus(i._id, 'approved')}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setInterestStatus(i._id, 'rejected')}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card card-padded">
            <div className="health-timeline-title">
              <h2 style={{ fontSize: '1.1rem' }}>Care records</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setCareModal(true)}>+ Add record</button>
            </div>
            {!listing.careRecord || listing.careRecord.length === 0 ? (
              <EmptyState title="No care records yet" message="Track feeding, vet visits, training and milestones here." icon="file-text" />
            ) : (
              <div className="timeline">
                {[...listing.careRecord].reverse().map((c) => (
                  <div className="timeline-item" key={c._id}>
                    <span className="timeline-dot" />
                    <div className="timeline-card">
                      <span className="badge badge-info">{c.type || c.careType}</span>
                      <p className="timeline-date">{formatDate(c.date)}</p>
                      <p className="text-small mt-1">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {listing.images && listing.images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {listing.images.map((img, i) => (
                <img key={i} src={imageUrl(img)} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </div>
          )}
          <div className="card card-padded">
            <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>Listing details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div><strong>Status:</strong> {listing.adoptionStatus}</div>
              <div><strong>Sex:</strong> {listing.gender || 'Unknown'} · <strong>Color:</strong> {listing.color || '—'}</div>
              <div><strong>Neutered/Spayed:</strong> {listing.neutered ? 'Yes' : 'No'}</div>
              <div><strong>Vaccinated:</strong> {listing.vaccinated ? 'Yes' : 'No'}</div>
              {listing.specialNeeds && <div><strong>Special needs:</strong> Yes</div>}
              {listing.adoptionFee > 0 && <div><strong>Fee:</strong> ${listing.adoptionFee}</div>}
              {listing.healthStatus && <div><strong>Medical notes:</strong> <p className="text-small">{listing.healthStatus}</p></div>}
              {listing.description && <div><strong>Description:</strong> <p className="text-small" style={{ whiteSpace: 'pre-wrap' }}>{listing.description}</p></div>}
              {listing.behaviouralNotes && <div><strong>Behavioural notes:</strong> <p className="text-small">{listing.behaviouralNotes}</p></div>}
              {listing.statusNotes && <div><strong>Status notes:</strong> <p className="text-small">{listing.statusNotes}</p></div>}
            </div>
          </div>
        </div>
      </div>

      {careModal && (
        <Modal title={`Add care record for ${listing.petName}`} onClose={() => setCareModal(false)}>
          <form onSubmit={submitCare}>
            <div className="form-group">
              <label className="form-label">Care type</label>
              <SelectDropdown
                value={careForm.careType}
                onChange={(v) => setCareForm({ ...careForm, careType: v })}
                options={['feeding', 'grooming', 'medical'].map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description <span className="required">*</span></label>
              <textarea className="form-control" value={careForm.description} onChange={(e) => setCareForm({ ...careForm, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-control" type="date" value={careForm.date} onChange={(e) => setCareForm({ ...careForm, date: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setCareModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save record</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ListingManage;