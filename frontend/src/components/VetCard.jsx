import { Link } from 'react-router-dom';
import { imageUrl, formatCurrency } from '../utils/helpers';
import { RatingStars } from './RatingStars';
import Icon from './Icon';

export const VetCard = ({ vet }) => {
  const profile = vet.veterinarianProfile || {};
  return (
    <div className="card card-hover card-padded" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            color: 'var(--primary-dark)',
            fontWeight: 800,
            overflow: 'hidden',
          }}
        >
          {vet.profileImage ? (
            <img src={imageUrl(vet.profileImage)} alt={vet.name} style={{ width: 56, height: 56, objectFit: 'cover' }} />
          ) : (
            vet.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
          )}
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem' }}>{vet.name}</h3>
          <p className="text-small" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>
            {profile.specialization || 'General Practice'}
          </p>
        </div>
      </div>

      <div className="text-small text-muted" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="map-pin" size={14} style={{ color: 'var(--primary-soft)', flexShrink: 0 }} />
          <span>
            {vet.address?.city || 'Location TBD'}
            {vet.address?.state ? `, ${vet.address.state}` : ''}
          </span>
        </div>
        {profile.experienceYears > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="award" size={14} style={{ color: 'var(--amber-600)', flexShrink: 0 }} />
            <span>{profile.experienceYears} years experience</span>
          </div>
        )}
        {profile.consultationFee > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="credit-card" size={14} style={{ color: 'var(--primary-soft)', flexShrink: 0 }} />
            <span>Fee: {formatCurrency(profile.consultationFee)}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <RatingStars rating={vet.rating || 0} count={vet.ratingCount || 0} />
        <span className={`badge ${profile.isAvailable ? 'badge-success' : 'badge-neutral'}`}>
          {profile.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <Link to={`/veterinarians/${vet._id}`} className="btn btn-outline btn-sm btn-block">
        View Profile
        <Icon name="arrow-right" size={14} />
      </Link>
    </div>
  );
};

export default VetCard;