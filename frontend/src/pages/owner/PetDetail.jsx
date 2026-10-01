import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { petApi, healthApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import Icon from '../../components/Icon';
import { formatDate, getErrorMessage, speciesEmoji, recordTypeInfo, recordTypeFallback } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const emptyRecord = {
  recordType: 'vaccination',
  title: '',
  description: '',
  date: '',
  nextDueDate: '',
  followUpInstructions: '',
  medicines: [],
  document: null,
};

export const PetDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [recordForm, setRecordForm] = useState(emptyRecord);
  const [medicineInput, setMedicineInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [galleryFile, setGalleryFile] = useState(null);
  const [addingGallery, setAddingGallery] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [petRes, recordsRes] = await Promise.all([
          petApi.getById(id),
          healthApi.getForPet(id).catch(() => ({ data: [] })),
        ]);
        setPet(petRes.data);
        setRecords(recordsRes.data || []);
      } catch (err) {
        showToast(getErrorMessage(err), 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addRecord = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        recordType: recordForm.recordType,
        title: recordForm.title,
        description: recordForm.description,
        date: recordForm.date || undefined,
        nextDueDate: recordForm.nextDueDate || undefined,
        followUpInstructions: recordForm.followUpInstructions || undefined,
        medicines: recordForm.medicines,
        document: recordForm.document,
      };
      const res = await healthApi.create(id, payload);
      showToast(res.message || 'Record added');
      setShowAdd(false);
      setRecordForm(emptyRecord);
      const recordsRes = await healthApi.getForPet(id);
      setRecords(recordsRes.data || []);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (record) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await healthApi.remove(record._id);
      showToast('Record deleted');
      setRecords((prev) => prev.filter((r) => r._id !== record._id));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const addMedicine = () => {
    if (!medicineInput.trim()) return;
    setRecordForm({ ...recordForm, medicines: [...recordForm.medicines, medicineInput.trim()] });
    setMedicineInput('');
  };

  const addToGallery = async () => {
    if (!galleryFile) return;
    setAddingGallery(true);
    try {
      const res = await petApi.addToGallery(id, galleryFile);
      setPet(res.data);
      setGalleryFile(null);
      showToast('Photo added to gallery');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setAddingGallery(false);
    }
  };

  if (loading) return <Loading text="Loading pet profile..." />;
  if (!pet) return <EmptyState title="Pet not found" />;

  const isOwner = user?.role === 'owner';

  return (
    <>
      <Link to="/owner/pets" className="btn btn-ghost btn-sm mb-2">← Back to pets</Link>

      <div className="detail-hero">
        <div>
          {pet.image ? (
            <img src={pet.image} alt={pet.name} className="detail-hero-img" />
          ) : (
            <div className="detail-hero-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: 'var(--primary-light)' }}>
              {speciesEmoji[pet.species] || '🐾'}
            </div>
          )}
          {pet.gallery && pet.gallery.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {pet.gallery.map((img, i) => (
                <img key={i} src={img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </div>
          )}
          {isOwner && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files[0])} className="form-control file-input" style={{ flex: 1, minWidth: 180, padding: 6 }} />
              <button className="btn btn-outline-teal btn-sm" onClick={addToGallery} disabled={addingGallery || !galleryFile}>
                {addingGallery ? 'Adding...' : 'Add to gallery'}
              </button>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h1 style={{ fontSize: '2rem' }}>{pet.name}</h1>
              <p className="text-muted" style={{ textTransform: 'capitalize' }}>
                {speciesEmoji[pet.species]} {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
                {pet.gender !== 'unknown' ? ` · ${pet.gender}` : ''}
              </p>
            </div>
            {isOwner && (
              <Link to={`/owner/pets/${pet._id}/edit`} className="btn btn-outline btn-sm">Edit pet</Link>
            )}
          </div>

          <div className="card card-padded mt-2">
            <div className="grid grid-2 text-small" style={{ rowGap: 8 }}>
              {pet.age > 0 && <div><strong>Age:</strong> {pet.age} year(s)</div>}
              {pet.weight > 0 && <div><strong>Weight:</strong> {pet.weight} kg</div>}
              {pet.color && <div><strong>Color:</strong> {pet.color}</div>}
              {pet.dateOfBirth && <div><strong>Born:</strong> {formatDate(pet.dateOfBirth)}</div>}
              {pet.microchipped && <div><strong>Microchip:</strong> {pet.microchipNumber || 'Yes'}</div>}
              {!pet.microchipped && <div><strong>Microchip:</strong> No</div>}
            </div>
            {pet.description && (
              <p className="text-muted mt-2" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>{pet.description}</p>
            )}
            {pet.medicalSummary && (
              <div className="alert alert-info mt-2" style={{ marginBottom: 0 }}>
                <strong>Medical summary:</strong> {pet.medicalSummary}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="health-timeline-title">
        <h2 style={{ fontSize: '1.3rem' }}>Health timeline</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add record</button>
      </div>

      {records.length === 0 ? (
        <EmptyState title="No health records yet" message="Add vaccinations, treatments, medications and more." icon="stethoscope" />
      ) : (
        <div className="timeline">
          {records.map((r) => {
            const info = recordTypeInfo[r.recordType] || { ...recordTypeFallback, label: r.recordType };
            return (
              <div className="timeline-item" key={r._id}>
                <span className="timeline-dot" />
                <div className="timeline-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <span className={`badge ${info.color}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Icon name={info.icon} size={13} />
                        {info.label}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', marginTop: 6 }}>{r.title}</h3>
                      <p className="timeline-date">{formatDate(r.date)} {r.vet?.name ? `· By ${r.vet.name}` : '· Owner'}</p>
                    </div>
                    {isOwner && (
                      <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(r)} aria-label="Delete record">
                        <Icon name="x" size={14} />
                      </button>
                    )}
                  </div>
                  {r.description && <p className="text-small mt-2">{r.description}</p>}
                  {r.medicines && r.medicines.length > 0 && (
                    <div className="mt-1">
                      <strong className="text-small">Medications:</strong>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        {r.medicines.map((m, i) => (
                          <span key={i} className="badge badge-info">{typeof m === 'string' ? m : `${m.name}${m.dosage ? ` · ${m.dosage}` : ''}`}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {r.followUpInstructions && (
                    <p className="text-small mt-1"><strong>Follow-up:</strong> {r.followUpInstructions}</p>
                  )}
                  {r.nextDueDate && (
                    <p className="text-small mt-1" style={{ color: 'var(--warning)' }}>
                      <strong>Next due:</strong> {formatDate(r.nextDueDate)}
                    </p>
                  )}
                  {r.documents && r.documents.length > 0 && (
                    <div className="mt-1">
                      {r.documents.map((doc, i) => (
                        <a key={i} href={doc} target="_blank" rel="noreferrer" className="badge badge-neutral" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <Icon name="file-text" size={13} /> Document
                        </a>
                      ))}
                    </div>
                  )}
                  {r.insurer && (
                    <p className="text-small mt-1"><strong>Insurer:</strong> {r.insurer} {r.policyNumber ? `(Policy: ${r.policyNumber})` : ''}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title={`Add health record for ${pet.name}`} onClose={() => setShowAdd(false)}>
          <form onSubmit={addRecord}>
            <div className="form-group">
              <label className="form-label">Record type</label>
              <SelectDropdown
                value={recordForm.recordType}
                onChange={(v) => setRecordForm({ ...recordForm, recordType: v })}
                options={Object.entries(recordTypeInfo).map(([key, v]) => ({ value: key, label: v.label }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Title <span className="required">*</span></label>
              <input className="form-control" value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} required placeholder="e.g. Rabies booster" />
            </div>
            <div className="form-group">
              <label className="form-label">Description / Notes</label>
              <textarea className="form-control" value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-control" type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Next due date (reminder)</label>
                <input className="form-control" type="date" value={recordForm.nextDueDate} onChange={(e) => setRecordForm({ ...recordForm, nextDueDate: e.target.value })} />
              </div>
            </div>
            {['medication', 'treatment', 'prescription'].includes(recordForm.recordType) && (
              <div className="form-group">
                <label className="form-label">Medications</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="form-control" value={medicineInput} onChange={(e) => setMedicineInput(e.target.value)} placeholder="e.g. Amoxicillin 25mg, twice daily" />
                  <button type="button" className="btn btn-outline-teal btn-sm" onClick={addMedicine}>Add</button>
                </div>
                {recordForm.medicines.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {recordForm.medicines.map((m, i) => (
                      <span key={i} className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {m} <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 2, display: 'inline-flex', color: 'inherit' }} aria-label="Remove medicine" onClick={() => setRecordForm({ ...recordForm, medicines: recordForm.medicines.filter((_, idx) => idx !== i) })}><Icon name="x" size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {recordForm.recordType === 'follow_up' && (
              <div className="form-group">
                <label className="form-label">Follow-up instructions</label>
                <textarea className="form-control" value={recordForm.followUpInstructions} onChange={(e) => setRecordForm({ ...recordForm, followUpInstructions: e.target.value })} />
              </div>
            )}
            {recordForm.recordType === 'insurance' && (
              <div className="form-group">
                <label className="form-label">Insurer name</label>
                <input className="form-control" value={recordForm.insurer || recordForm.title} disabled />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Document / file (optional)</label>
              <input className="form-control file-input" type="file" onChange={(e) => setRecordForm({ ...recordForm, document: e.target.files[0] })} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default PetDetail;