import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userApi, appointmentApi, reviewApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { RatingStars } from '../../components/RatingStars';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

export const VeterinarianDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const vetRes = await userApi.publicVetById(id);
        setVet(vetRes.data);
        const reviewsRes = await reviewApi.getAll({ target: id, targetType: 'veterinarian', limit: 20 }).catch(() => ({ data: [] }));
        setReviews(reviewsRes.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const checkAvailability = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    try {
      const res = await appointmentApi.availability({ vetId: id, date: selectedDate });
      setAvailability(res.data);
      setShowSlots(true);
    } catch (err) {
      setError({ message: `Could not check availability: ${getErrorMessage(err)}` });
    }
  };

  const bookSlot = (slot) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/owner/book/${id}?date=${selectedDate}&time=${slot}`);
  };

  if (loading) return <Loading text="Loading veterinarian profile..." />;
  if (error) return <div className="container page-section"><ErrorState error={error} /></div>;
  if (!vet) return <div className="container page-section"><EmptyState title="Veterinarian not found" /></div>;

  const profile = vet.veterinarianProfile || {};
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container page-section detail-page">
      <Link to="/veterinarians" className="btn btn-ghost btn-sm mb-2">← Back to vets</Link>

      <Reveal className="detail-hero">
        <div>
          {vet.profileImage ? (
            <img src={vet.profileImage} alt={vet.name} className="detail-hero-img" />
          ) : (
            <div className="detail-hero-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
              {vet.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="badge badge-success mb-1">{profile.isAvailable ? '● Available' : '○ Not accepting new patients'}</div>
          <h1>{vet.name}</h1>
          <p style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: 8 }}>
            {profile.specialization || 'General Practice'}
          </p>
          <div className="text-muted mb-2">
            <RatingStars rating={vet.rating || 0} count={vet.ratingCount || 0} />
          </div>
          <p className="text-muted" style={{ marginBottom: 12, whiteSpace: 'pre-wrap' }}>{profile.bio || 'No bio provided yet.'}</p>

          <div className="card card-padded mt-2" style={{ maxWidth: 420 }}>
<div className="text-small text-muted">
  {profile.experienceYears > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="award" size={14} /> {profile.experienceYears} years of experience</div>}
  {profile.qualifications && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="award" size={14} /> {profile.qualifications}</div>}
  {profile.licenseNumber && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="file-text" size={14} /> License: {profile.licenseNumber}</div>}
  {profile.consultationFee > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="credit-card" size={14} /> Consultation fee: {formatCurrency(profile.consultationFee)}</div>}
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="map-pin" size={14} /> {[vet.address?.street, vet.address?.city, vet.address?.state].filter(Boolean).join(', ') || 'Location not provided'}</div>
</div>
          </div>
        </div>
      </Reveal>

      <Reveal className="card card-padded mb-3">
        <h2 className="mb-2" style={{ fontSize: '1.2rem' }}>Check live availability</h2>
        <form onSubmit={checkAvailability} className="search-bar" style={{ marginBottom: 0 }}>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            min={today}
            onChange={(e) => { setSelectedDate(e.target.value); setShowSlots(false); }}
            required
          />
          <button className="btn btn-primary">Check slots</button>
        </form>

        {showSlots && availability && (
          <div className="mt-2">
            <p className="text-muted text-small mb-1">
              Available slots on {availability.day}, {selectedDate}:
            </p>
            {availability.availableSlots.length > 0 ? (
              <div className="slot-grid">
                {availability.availableSlots.map((slot) => (
                  <button key={slot} className="slot-chip" onClick={() => bookSlot(slot)}>
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted">No available slots on this day. Try another date.</p>
            )}
          </div>
        )}
      </Reveal>

      <Reveal>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Ratings & reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet.</p>
      ) : (
        <div className="grid grid-2" style={{ gap: 12 }}>
          {reviews.map((r) => (
            <div className="review-card" key={r._id}>
              <div className="review-header">
                <div className="nav-avatar">{r.author?.name?.[0]?.toUpperCase() || '?'}</div>
                <div>
                  <strong>{r.author?.name || 'Anonymous'}</strong>
                  <div><RatingStars rating={r.rating} size={13} /></div>
                </div>
              </div>
              {r.comment && <p className="text-small">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
      </Reveal>
    </div>
  );
};

export default VeterinarianDetail;