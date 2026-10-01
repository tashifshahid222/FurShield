import { useState, useEffect } from 'react';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

export const VetProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const vet = user?.veterinarianProfile || {};
  const [form, setForm] = useState({
    specialization: vet.specialization || '',
    experienceYears: vet.experienceYears || 0,
    bio: vet.bio || '',
    qualifications: vet.qualifications || '',
    licenseNumber: vet.licenseNumber || '',
    consultationFee: vet.consultationFee || 0,
    isAvailable: vet.isAvailable ?? true,
  });
  const [availability, setAvailability] = useState(vet.availability || []);
  const [saving, setSaving] = useState(false);

  const toggleDay = (day) => {
    if (availability.find((d) => d.day === day)) {
      setAvailability(availability.filter((d) => d.day !== day));
    } else {
      setAvailability([...availability, { day, slots: [] }]);
    }
  };

  const toggleSlot = (day, slot) => {
    setAvailability(availability.map((d) => {
      if (d.day !== day) return d;
      if (d.slots.includes(slot)) return { ...d, slots: d.slots.filter((s) => s !== slot) };
      return { ...d, slots: [...d.slots, slot].sort() };
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateVetProfile({
        ...form,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee),
        availability,
      });
      updateUser(res.data);
      showToast('Practice profile saved');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>My Practice Profile</h1>
      <p className="text-muted mb-4">Specialization, experience, address and availability slots</p>

      <form onSubmit={save}>
        <div className="card card-padded mb-3">
          <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Professional details</h3>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input className="form-control" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Small Animal Medicine" />
            </div>
            <div className="form-group">
              <label className="form-label">Years of experience</label>
              <input className="form-control" type="number" min="0" name="experienceYears" value={form.experienceYears} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Qualifications</label>
              <input className="form-control" name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="e.g. DVM, University of..." />
            </div>
            <div className="form-group">
              <label className="form-label">License number</label>
              <input className="form-control" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation fee ($)</label>
              <input className="form-control" type="number" min="0" name="consultationFee" value={form.consultationFee} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Available for bookings</label>
              <SelectDropdown
                name="isAvailable"
                value={form.isAvailable}
                onChange={handleChange}
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                ]}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell pet owners about your experience and approach..." />
          </div>
        </div>

        <div className="card card-padded mb-3">
          <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Weekly availability</h3>
          <p className="text-muted text-small mb-3">Enable days you consult and pick your time slots.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {days.map((day) => {
              const item = availability.find((d) => d.day === day);
              const enabled = !!item;
              return (
                <div key={day} className="card card-padded" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleDay(day)}
                      id={`day-${day}`}
                    />
                    <label htmlFor={`day-${day}`} style={{ fontWeight: 700, minWidth: 110 }}>{day}</label>
                    {enabled && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {defaultSlots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            className={`slot-chip ${item.slots.includes(slot) ? 'selected' : ''}`}
                            onClick={() => toggleSlot(day, slot)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Practice Profile'}
        </button>
      </form>
    </div>
  );
};

export default VetProfile;