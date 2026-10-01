import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { petApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const emptyForm = {
  name: '',
  species: 'dog',
  breed: '',
  age: 0,
  gender: 'unknown',
  weight: 0,
  color: '',
  microchipped: false,
  microchipNumber: '',
  description: '',
  medicalSummary: '',
  dateOfBirth: '',
  image: null,
};

export const PetForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      petApi.getById(id)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name,
            species: p.species,
            breed: p.breed || '',
            age: p.age || 0,
            gender: p.gender || 'unknown',
            weight: p.weight || 0,
            color: p.color || '',
            microchipped: p.microchipped || false,
            microchipNumber: p.microchipNumber || '',
            description: p.description || '',
            medicalSummary: p.medicalSummary || '',
            dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
            image: null,
          });
        })
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '' || payload[k] === null) delete payload[k];
      });
      if (payload.weight === 0) delete payload.weight;
      if (payload.age === 0) delete payload.age;

      if (isEdit) {
        await petApi.update(id, payload);
        showToast('Pet updated successfully');
      } else {
        await petApi.create(payload);
        showToast('Pet added successfully');
      }
      navigate('/owner/pets');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <Link to="/owner/pets" className="btn btn-ghost btn-sm mb-2">← Back to pets</Link>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{isEdit ? 'Edit Pet' : 'Add a New Pet'}</h1>
      <p className="text-muted mb-4">Tell us about your furry (or not-so-furry) friend</p>

      {error && <div className="alert alert-error">{error}</div>}

      {fetching ? <p className="text-muted">Loading pet...</p> : (
        <div className="card card-padded">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Pet name <span className="required">*</span></label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Species <span className="required">*</span></label>
                <SelectDropdown
                  name="species"
                  value={form.species}
                  onChange={handleChange}
                  options={[
                    { value: 'dog', label: 'Dog' },
                    { value: 'cat', label: 'Cat' },
                    { value: 'bird', label: 'Bird' },
                    { value: 'rabbit', label: 'Rabbit' },
                    { value: 'fish', label: 'Fish' },
                    { value: 'reptile', label: 'Reptile' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Breed</label>
                <input className="form-control" name="breed" value={form.breed} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <SelectDropdown
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={[
                    { value: 'unknown', label: 'Unknown' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input className="form-control" type="number" min="0" name="age" value={form.age} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input className="form-control" type="number" min="0" step="0.1" name="weight" value={form.weight} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input className="form-control" name="color" value={form.color} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of birth</label>
                <input className="form-control" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Photo</label>
              <input className="form-control file-input" type="file" accept="image/*" name="image" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="microchipped" checked={form.microchipped} onChange={(e) => setForm({ ...form, microchipped: e.target.checked })} />
              <label htmlFor="microchipped" className="form-label" style={{ marginBottom: 0 }}>Microchipped</label>
            </div>
            {form.microchipped && (
              <div className="form-group">
                <label className="form-label">Microchip number</label>
                <input className="form-control" name="microchipNumber" value={form.microchipNumber} onChange={handleChange} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Personality, likes, quirks..." />
            </div>
            <div className="form-group">
              <label className="form-label">Medical summary</label>
              <textarea className="form-control" name="medicalSummary" value={form.medicalSummary} onChange={handleChange} placeholder="Existing conditions, allergies, current medications..." />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Pet'}
              </button>
              <Link to="/owner/pets" className="btn btn-ghost">Cancel</Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PetForm;