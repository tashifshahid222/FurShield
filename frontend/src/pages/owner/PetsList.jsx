import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { petApi } from '../../api';
import { PetCard } from '../../components/PetCard';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';

export const PetsList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petApi.getMy()
      .then((res) => setPets(res.data || []))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }, []);

  const removePet = async (pet) => {
    if (!window.confirm(`Delete ${pet.name} and all their health records?`)) return;
    try {
      const res = await petApi.remove(pet._id);
      showToast(res.message || 'Pet deleted');
      setPets((prev) => prev.filter((p) => p._id !== pet._id));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>My Pets</h1>
          <p className="text-muted">Manage your pet profiles and health records</p>
        </div>
        <Link to="/owner/pets/new" className="btn btn-primary btn-sm">+ Add Pet</Link>
      </div>

      {loading ? <Loading /> : pets.length === 0 ? (
        <EmptyState
          title="No pets yet"
          message="Add your first pet to start building their health timeline."
          icon="paw"
          action={<button className="btn btn-primary mt-2" onClick={() => navigate('/owner/pets/new')}>Add a pet</button>}
        />
      ) : (
        <div className="grid grid-3">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} onDelete={removePet} />
          ))}
        </div>
      )}
    </>
  );
};

export default PetsList;