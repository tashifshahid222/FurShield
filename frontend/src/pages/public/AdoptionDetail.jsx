import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adoptionApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

export const AdoptionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interest, setInterest] = useState({ message: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    adoptionApi.getById(id)
      .then((res) => setListing(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  const hasInterested = user && listing?.adoptionInterests?.some((i) => i.adopter?._id === user._id);

  const submitInterest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const res = await adoptionApi.submitInterest(id, { message: interest.message, phone: interest.phone || user.phone || '' });
      showToast(res.message || 'Adoption interest submitted');
      const updated = await adoptionApi.getById(id);
      setListing(updated.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading listing..." />;
  if (error) return <div className="container page-section"><ErrorState error={error} /></div>;
  if (!listing) return <div className="container page-section"><EmptyState title="Listing not found" /></div>;

  const images = listing.images && listing.images.length > 0 ? listing.images : null;

  return (
    <div className="container page-section detail-page">
      <Link to="/adoption" className="btn btn-ghost btn-sm mb-2">← Back to adoptions</Link>

      <Reveal>
      <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>
        {listing.petName}
      </h1>
      <p className="text-muted mb-3">
        Listed by {listing.shelter?.name || 'a shelter'}
        {listing.shelter?.shelterProfile?.isVerified && <span className="badge badge-teal ml-1">✓ Verified</span>}
      </p>
      </Reveal>

      <Reveal className="detail-hero">
        <div>
          {images ? (
            <>
              <img src={images[activeImage]} alt={listing.petName} className="detail-hero-img" />
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} style={{ border: i === activeImage ? '2px solid var(--primary)' : '2px solid var(--border)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0 }}>
                      <img src={img} alt="" style={{ width: 64, height: 64, objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="detail-hero-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-light)' }}>
              <Icon name="paw" size={48} style={{ color: 'var(--primary)' }} />
            </div>
          )}
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{listing.adoptionStatus}</span>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{listing.species}</span>
            {listing.breed && <span className="badge badge-neutral">{listing.breed}</span>}
            {listing.gender !== 'unknown' && <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{listing.gender}</span>}
            {listing.age > 0 && <span className="badge badge-neutral">{listing.age} year(s) old</span>}
          </div>

          {listing.healthStatus && (
            <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}><Icon name="stethoscope" size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> <strong>Health:</strong> {listing.healthStatus}</p>
          )}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {listing.vaccinated && <span className="badge badge-success">Vaccinated</span>}
            {listing.neutered && <span className="badge badge-success">Neutered/Spayed</span>}
          </div>

          <p className="text-muted" style={{ marginBottom: 16, whiteSpace: 'pre-wrap' }}>{listing.description}</p>

          <div className="card card-padded">
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>Interested in adopting {listing.petName}?</h3>
            {listing.adoptionStatus === 'adopted' ? (
              <div className="alert alert-info" style={{ marginBottom: 0 }}>This pet has found their forever home. <Icon name="sparkles" size={16} style={{ verticalAlign: 'middle' }} /></div>
            ) : hasInterested ? (
              <div className="alert alert-success" style={{ marginBottom: 0 }}>You've submitted your interest. The shelter will contact you soon.</div>
            ) : (
              <form onSubmit={submitInterest} style={{ width: '100%' }}>
                <div className="form-group">
                  <label className="form-label">Why would {listing.petName} be a good fit?</label>
                  <textarea className="form-control" placeholder="Tell the shelter about your home, family and experience..." value={interest.message} onChange={(e) => setInterest({ ...interest, message: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Best phone number</label>
                  <input className="form-control" value={interest.phone} onChange={(e) => setInterest({ ...interest, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                </div>
                <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Adoption Interest'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal>
      {listing.careRecord && listing.careRecord.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Care history</h2>
          <div className="timeline" style={{ marginBottom: 24 }}>
            {listing.careRecord.slice().reverse().map((rec, i) => (
              <div className="timeline-item" key={i}>
                <span className="timeline-dot" />
                <div className="timeline-card">
                  <span className={`badge ${rec.type === 'feeding' ? 'badge-primary' : rec.type === 'grooming' ? 'badge-teal' : 'badge-info'}`} style={{ textTransform: 'capitalize' }}>
                    {rec.type === 'medical' ? 'Medical attention' : rec.type}
                  </span>
                  <p className="timeline-date mt-1">{new Date(rec.date).toLocaleDateString()}</p>
                  <p className="text-small mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      </Reveal>
    </div>
  );
};

export default AdoptionDetail;