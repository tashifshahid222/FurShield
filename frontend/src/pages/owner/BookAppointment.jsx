import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { petApi, userApi, appointmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { getErrorMessage, speciesEmoji } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const BookAppointment = () => {
  const { vetId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [vet, setVet] = useState(null);
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState(searchParams.get('time') || '');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [petId, setPetId] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [petsRes, vetRes] = await Promise.all([
          petApi.getMy(),
          userApi.publicVetById(vetId),
        ]);
        setPets(petsRes.data || []);
        setVet(vetRes.data);
        if (petsRes.data && petsRes.data.length > 0) setPetId(petsRes.data[0]._id);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vetId]);

  const checkSlots = async () => {
    if (!date) return;
    setLoading(true);
    setError('');
    try {
      const res = await appointmentApi.availability({ vetId, date });
      setSlots(res.data.availableSlots || []);
      if (time && !res.data.availableSlots.includes(time)) setTime('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) checkSlots();
  }, [date]);

  const submit = async (e) => {
    e.preventDefault();
    if (!petId || !date || !time || !reason) {
      setError('Please select a pet, date, time and reason.');
      return;
    }
    setBooking(true);
    try {
      const res = await appointmentApi.create({
        petId,
        veterinarianId: vetId,
        date,
        time,
        reason,
        notes,
      });
      showToast(res.message || 'Appointment requested');
      navigate('/owner/appointments');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBooking(false);
    }
  };

  if (loading && !vet) return <Loading text="Loading booking form..." />;
  if (error && !vet) return <div><EmptyState title="Something went wrong" message={error} action={<Link className="btn btn-primary" to="/veterinarians">Back to vets</Link>} /></div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: 720 }}>
      <Link to={`/veterinarians/${vetId}`} className="btn btn-ghost btn-sm mb-2">← Back to vet profile</Link>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Book appointment with {vet?.name}</h1>
      <p className="text-muted mb-4">Choose a convenient date and time for your pet's visit.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {pets.length === 0 ? (
        <EmptyState title="You need a pet to book" message="Add a pet profile first." action={<Link to="/owner/pets/new" className="btn btn-primary mt-2">Add a pet</Link>} />
      ) : (
        <div className="card card-padded">
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Select pet <span className="required">*</span></label>
              <SelectDropdown
                value={petId}
                onChange={setPetId}
                placeholder="Select a pet..."
                options={pets.map((p) => ({ value: p._id, label: `${speciesEmoji[p.species] || ''} ${p.name}` }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date <span className="required">*</span></label>
              <input className="form-control" type="date" min={today} value={date} onChange={(e) => { setDate(e.target.value); setSlots([]); }} required />
            </div>

            <div className="form-group">
              <label className="form-label">Available time slots</label>
              {slots.length > 0 ? (
                <div className="slot-grid">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s}
                      className={`slot-chip ${time === s ? 'selected' : ''}`}
                      onClick={() => setTime(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : date ? (
                <p className="text-muted text-small">No slots available on this date. Pick another day.</p>
              ) : (
                <p className="text-muted text-small">Select a date to see available slots.</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Reason for visit <span className="required">*</span></label>
              <textarea className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Annual checkup, skin issue, vaccination..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Additional notes</label>
              <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit" disabled={booking}>
                {booking ? 'Requesting...' : 'Request Appointment'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            </div>
            <p className="text-small text-muted mt-2">The veterinarian will review and approve or reschedule your request.</p>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;