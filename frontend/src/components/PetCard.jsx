import { Link } from 'react-router-dom';
import { speciesEmoji } from '../utils/helpers';
import Icon from './Icon';

export const PetCard = ({ pet, onDelete }) => (
  <div className="card card-hover" style={{ display: 'block' }}>
    <Link to={`/owner/pets/${pet._id}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div style={{ position: 'relative' }}>
        {pet.image ? (
          <img src={pet.image} alt={pet.name} className="pet-card-img" />
        ) : (
          <div className="pet-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--teal-50)' }}>
            <span style={{ fontSize: '3rem' }}>{speciesEmoji[pet.species] || '🐾'}</span>
          </div>
        )}
      </div>
      <div className="pet-card-body">
        <h3 style={{ marginBottom: 4 }}>{pet.name}</h3>
        <p className="text-muted text-small" style={{ textTransform: 'capitalize' }}>
          {pet.species} {pet.breed ? '· ' + pet.breed : ''} {pet.age !== undefined && pet.age > 0 ? `· ${pet.age} yr` : ''}
        </p>
        {pet.medicalSummary && (
          <p className="text-small mt-1" style={{ color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="medical-cross" size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pet.medicalSummary}</span>
          </p>
        )}
      </div>
    </Link>
    {onDelete && (
      <div className="card-padded" style={{ padding: '10px 16px', background: 'var(--surface)', borderRadius: '0 0 12px 12px', display: 'flex', gap: 8 }}>
        <Link to={`/owner/pets/${pet._id}/edit`} className="btn btn-outline-teal btn-sm" style={{ flex: 1 }}>Edit</Link>
        <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => onDelete(pet)}>Delete</button>
      </div>
    )}
  </div>
);

export default PetCard;