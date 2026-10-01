import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adoptionApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const speciesList = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'fish', 'reptile', 'other'];

export const ListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState({
    petName: '',
    species: 'dog',
    ageYears: '',
    sex: '',
    breed: '',
    color: '',
    weight: '',
    medicalNotes: '',
    behaviouralNotes: '',
    neutralised: false,
    upToDateOnVaccines: false,
    specialNeeds: false,
    adoptionFee: '',
    location: '',
    statusNotes: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adoptionApi.getById(id)
      .then((res) => {
        const l = res.data;
        setForm({
          petName: l.petName || '',
          species: l.species || 'dog',
          ageYears: l.age ?? '',
          sex: l.gender || 'unknown',
          breed: l.breed || '',
          color: l.color || '',
          weight: l.weight ?? '',
          medicalNotes: l.healthStatus || '',
          behaviouralNotes: l.behaviouralNotes || '',
          neutralised: l.neutered ?? false,
          upToDateOnVaccines: l.vaccinated ?? false,
          specialNeeds: l.specialNeeds ?? false,
          adoptionFee: l.adoptionFee ?? '',
          location: l.location || '',
          statusNotes: l.statusNotes || '',
          description: l.description || '',
        });
        setExistingImages(l.images || []);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageFiles = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        petName: form.petName,
        species: form.species,
        breed: form.breed,
        age: form.ageYears === '' ? 0 : Number(form.ageYears),
        gender: form.sex,
        color: form.color,
        weight: form.weight === '' ? 0 : Number(form.weight),
        healthStatus: form.medicalNotes,
        description: form.description,
        behaviouralNotes: form.behaviouralNotes,
        neutered: form.neutralised,
        vaccinated: form.upToDateOnVaccines,
        specialNeeds: form.specialNeeds,
        adoptionFee: form.adoptionFee === '' ? 0 : Number(form.adoptionFee),
        location: form.location,
        statusNotes: form.statusNotes,
      };
      let res;
      if (isEdit) {
        res = await adoptionApi.update(id, { ...payload, existingImages, images });
      } else {
        res = await adoptionApi.create({ ...payload, images });
      }
      showToast(res.message || (isEdit ? 'Listing updated' : 'Listing created'));
      navigate('/shelter/listings');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Loading listing..." />;

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{isEdit ? 'Edit adoption listing' : 'Add adoption listing'}</h1>
      <p className="text-muted mb-4">Provide accurate details to help families find the right match.</p>

      <form onSubmit={submit}>
        <div className="card card-padded mb-3">
          <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Pet details</h3>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Pet name <span className="required">*</span></label>
              <input className="form-control" name="petName" value={form.petName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Species <span className="required">*</span></label>
              <SelectDropdown
                name="species"
                value={form.species}
                onChange={handleChange}
                options={speciesList.map((s) => ({ value: s, label: s }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Breed</label>
              <input className="form-control" name="breed" value={form.breed} onChange={handleChange} placeholder="e.g. Golden Retriever" />
            </div>
            <div className="form-group">
              <label className="form-label">Age (years)</label>
              <input className="form-control" type="number" min="0" step="0.5" name="ageYears" value={form.ageYears} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Sex</label>
              <SelectDropdown
                name="sex"
                value={form.sex}
                onChange={handleChange}
                options={[
                  { value: 'unknown', label: 'Unknown' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <input className="form-control" name="color" value={form.color} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-control" type="number" min="0" step="0.1" name="weight" value={form.weight} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Adoption fee ($)</label>
              <input className="form-control" type="number" min="0" name="adoptionFee" value={form.adoptionFee} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-3" style={{ gap: 16, marginTop: 4 }}>
            <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="neutralised" checked={form.neutralised} onChange={handleChange} /> Neutered / spayed
            </label>
            <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="upToDateOnVaccines" checked={form.upToDateOnVaccines} onChange={handleChange} /> Vaccinated
            </label>
            <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="specialNeeds" checked={form.specialNeeds} onChange={handleChange} /> Special needs
            </label>
          </div>
        </div>

        <div className="card card-padded mb-3">
          <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Description & notes</h3>
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={4} required placeholder="Personality, story, why this pet needs a home..." />
          </div>
          <div className="form-group">
            <label className="form-label">Medical notes</label>
            <textarea className="form-control" name="medicalNotes" value={form.medicalNotes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Behavioural notes</label>
            <textarea className="form-control" name="behaviouralNotes" value={form.behaviouralNotes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Status notes (optional note shown on listing)</label>
            <textarea className="form-control" name="statusNotes" value={form.statusNotes} onChange={handleChange} />
          </div>
        </div>

        <div className="card card-padded mb-3">
          <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Photos</h3>
          {isEdit && existingImages.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {existingImages.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={img} alt="" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover' }} />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ position: 'absolute', top: -6, right: -6, padding: '0 6px' }}
                    onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                  ><Icon name="x" size={12} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Upload photos</label>
            <input className="form-control" type="file" accept="image/*" multiple onChange={handleImageFiles} />
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {images.map((file, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover' }} />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ position: 'absolute', top: -6, right: -6, padding: '0 6px' }}
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    ><Icon name="x" size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-small text-muted mt-1">{isEdit ? 'Photos added here are appended to the existing ones.' : 'You can add more photos later.'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : (isEdit ? 'Update Listing' : 'Create Listing')}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/shelter/listings')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;