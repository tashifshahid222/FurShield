import { Link } from 'react-router-dom';
import { imageUrl, speciesEmoji } from '../utils/helpers';
import Icon from './Icon';

const statusBadge = {
  available: <span className="badge badge-success">Available</span>,
  pending: <span className="badge badge-warning">Pending</span>,
  adopted: <span className="badge badge-neutral">Adopted</span>,
};

export const AdoptionCard = ({ listing }) => (
  <Link to={`/adoption/${listing._id}`} className="card card-hover" style={{ display: 'block' }}>
    {listing.images && listing.images.length > 0 ? (
      <img src={imageUrl(listing.images[0])} alt={listing.petName} className="adoption-card-img" />
    ) : (
      <div className="adoption-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--teal-50)' }}>
        <span style={{ fontSize: '3rem' }}>{speciesEmoji[listing.species] || '🐾'}</span>
      </div>
    )}
    <div className="card-padded">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ fontSize: '1.1rem' }}>{listing.petName}</h3>
        {statusBadge[listing.adoptionStatus] || null}
      </div>
      <p className="text-small text-muted mt-1" style={{ textTransform: 'capitalize' }}>
        {listing.species} {listing.breed ? `· ${listing.breed}` : ''} {listing.age > 0 ? `· ${listing.age} yr` : ''} {listing.gender !== 'unknown' ? `· ${listing.gender}` : ''}
      </p>
      <p className="text-small mt-1" style={{ color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {listing.description}
      </p>
      <p className="text-small mt-1 text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="building" size={14} style={{ color: 'var(--primary-soft)' }} />
        {listing.shelter?.name || 'FurShield Shelter'}
      </p>
    </div>
  </Link>
);

export default AdoptionCard;