import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { imageUrl, speciesEmoji } from '../../utils/helpers';
import Icon from '../../components/Icon';

export const VetPatients = () => {
  const { showToast } = useToast();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petApi.getVetPets()
      .then((res) => setPets(res.data || []))
      .catch((err) => showToast(err.response?.data?.message || 'Failed to load patients', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Patients & Pets</h1>
          <p className="text-muted">Pets you have consulted or are currently treating</p>
        </div>
      </div>

      {loading ? <Loading /> : pets.length === 0 ? (
        <EmptyState title="No patients yet" message="Once owners book and you approve appointments, their pets will appear here." icon="paw" />
      ) : (
        <div className="grid grid-3">
          {pets.map((p) => (
            <Link to={`/veterinarian/patients/${p._id}`} key={p._id} className="card card-hover" style={{ display: 'block' }}>
              {p.image ? (
                <img src={imageUrl(p.image)} alt={p.name} className="pet-card-img" />
              ) : (
                <div className="pet-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'var(--primary-light)' }}>
                  {speciesEmoji[p.species] || '🐾'}
                </div>
              )}
              <div className="card-padded">
                <h3 style={{ fontSize: '1.1rem' }}>{p.name}</h3>
                <p className="text-small text-muted" style={{ textTransform: 'capitalize' }}>
                  {p.species} {p.breed ? `· ${p.breed}` : ''}
                </p>
                <p className="text-small text-muted mt-1">Owner: {p.owner?.name || '—'}</p>
                {p.medicalSummary && <p className="text-small mt-1" style={{ color: 'var(--text-light)' }}><Icon name="stethoscope" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {p.medicalSummary}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default VetPatients;