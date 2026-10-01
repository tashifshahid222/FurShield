import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { petApi, healthApi, appointmentApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import Icon from '../../components/Icon';
import { formatDate, getErrorMessage, speciesEmoji, recordTypeInfo, recordTypeFallback } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const truncate = (s, n = 35) => (s && s.length > n ? `${s.slice(0, n).replace(/\s+$/, '')}...` : s);

export const VetPetRecords = () => {
  const { petId } = useParams();
  const { showToast } = useToast();
  const { handleModeChange, registerExitMode } = useSidebarTable();
  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ recordType: 'diagnosis', title: '', description: '', date: '', nextDueDate: '', symptoms: [], labResults: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    handleModeChange(showAdd);
  }, [showAdd, handleModeChange]);

  // Register exit mode callback
  useEffect(() => {
    return registerExitMode(() => {
      setShowAdd(false);
    });
  }, [registerExitMode]);

  const load = async () => {
    setLoading(true);
    try {
      const [petRes, recordsRes, apptsRes] = await Promise.all([
        petApi.getById(petId),
        healthApi.getVetRecords(petId),
        appointmentApi.getAll({ pet: petId, limit: 100 }),
      ]);
      setPet(petRes.data);
      setRecords(recordsRes.data || []);
      setAppointments((apptsRes.data || []).filter((a) => a.pet?._id === petId));
      setSymptoms((recordsRes.data || []).filter((r) => r.recordType === 'illness' || r.title.toLowerCase().includes('symptom')));
      setLabResults((recordsRes.data || []).filter((r) => r.recordType === 'lab_result'));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [petId]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        recordType: form.recordType,
        title: form.title,
        description: form.description,
        date: form.date || undefined,
        nextDueDate: form.nextDueDate || undefined,
        documents: undefined,
      };
      // append symptoms/lab results into the description for traceability
      const extra = [];
      if (form.symptoms.length) extra.push(`Symptoms: ${form.symptoms.join(', ')}`);
      if (form.labResults.length) extra.push(`Lab results: ${form.labResults.join(', ')}`);
      payload.description = [form.description, ...extra].filter(Boolean).join('\n');

      const res = await healthApi.create(petId, payload);
      showToast(res.message || 'Record added');
      setShowAdd(false);
      setForm({ recordType: 'diagnosis', title: '', description: '', date: '', nextDueDate: '', symptoms: [], labResults: [] });
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Loading patient records..." />;
  if (!pet) return <EmptyState title="Pet not found" />;

  return (
    <>
      <Link to="/veterinarian/patients" className="btn btn-ghost btn-sm mb-2">← Back to patients</Link>

      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>{speciesEmoji[pet.species] || '🐾'}</span>
            {pet.name}
          </h1>
          <p className="text-muted">
            {pet.breed || pet.species} · Owner: {pet.owner?.name || '—'}
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add clinical record</button>
      </div>

      {pet.medicalSummary && (
        <div className="alert alert-info mb-3"><strong>Medical summary:</strong> {pet.medicalSummary}</div>
      )}

      <div className="grid grid-2 mb-3" style={{ alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="stethoscope" size={17} style={{ color: 'var(--primary)' }} /> Past consultations</h2>
          {appointments.filter((a) => a.status === 'completed').length === 0 ? (
            <p className="text-muted text-small">No completed consultations yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {appointments.filter((a) => a.status === 'completed').map((a) => (
                <div className="card card-padded" key={a._id}>
                  <strong>{formatDate(a.date)} at {a.time}</strong>
                  <div className="text-small text-muted" title={a.reason}>{truncate(a.reason)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="flask" size={17} style={{ color: 'var(--info)' }} /> Lab results</h2>
          {labResults.length === 0 ? <p className="text-muted text-small">No lab results recorded.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {labResults.map((r) => (
                <div className="card card-padded" key={r._id}>
                  <strong>{r.title}</strong>
                  <div className="text-small text-muted">{r.description}</div>
                  <div className="text-small text-muted">{formatDate(r.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="clipboard" size={17} style={{ color: 'var(--primary)' }} /> Symptoms observed</h2>
      {symptoms.length === 0 ? (
        <p className="text-muted text-small mb-3">No symptom records yet.</p>
      ) : (
        <div className="mb-3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {symptoms.map((s) => <span key={s._id} className="badge badge-warning">{s.title}</span>)}
        </div>
      )}

      <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Medical history</h2>
      {records.length === 0 ? (
        <EmptyState title="No clinical records yet" message="Add a diagnosis, treatment or prescription." />
      ) : (
        <div className="timeline">
          {records.map((r) => {
            const info = recordTypeInfo[r.recordType] || { label: r.recordType, icon: 'clipboard', color: 'badge-neutral' };
            return (
              <div className="timeline-item" key={r._id}>
                <span className="timeline-dot" />
                <div className="timeline-card">
                  <span className={`badge ${info.color}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Icon name={info.icon} size={13} />
                        {info.label}
                      </span>
                  <h3 style={{ fontSize: '1.02rem', marginTop: 6 }}>{r.title}</h3>
                  <p className="timeline-date">{formatDate(r.date)}{r.vet?.name ? ` · By ${r.vet.name}` : ''}</p>
                  {r.description && <p className="text-small mt-2" style={{ whiteSpace: 'pre-wrap' }}>{r.description}</p>}
                  {r.medicines && r.medicines.length > 0 && (
                    <div className="mt-1">
                      <strong className="text-small">Medications:</strong>
                      {r.medicines.map((m, i) => (
                        <span key={i} className="badge badge-info" style={{ marginLeft: 6 }}>{typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`}</span>
                      ))}
                    </div>
                  )}
                  {r.followUpInstructions && <p className="text-small mt-1"><strong>Follow-up:</strong> {r.followUpInstructions}</p>}
                  {r.nextDueDate && <p className="text-small mt-1" style={{ color: 'var(--warning)' }}><strong>Next due:</strong> {formatDate(r.nextDueDate)}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title={`Add clinical record for ${pet.name}`} onClose={() => setShowAdd(false)}>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Record type</label>
              <SelectDropdown
                value={form.recordType}
                onChange={(v) => setForm({ ...form, recordType: v })}
                options={Object.entries(recordTypeInfo).map(([k, v]) => ({ value: k, label: v.label }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Title <span className="required">*</span></label>
              <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Canine dermatitis diagnosis" />
            </div>
            <div className="form-group">
              <label className="form-label">Description / Findings</label>
              <textarea className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Symptoms observed</label>
              <input
                className="form-control"
                placeholder="Type symptom and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    setForm({ ...form, symptoms: [...form.symptoms, e.target.value.trim()] });
                    e.target.value = '';
                  }
                }}
              />
              {form.symptoms.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {form.symptoms.map((s, i) => (
                    <span key={i} className="badge badge-warning">
                      {s} <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setForm({ ...form, symptoms: form.symptoms.filter((_, idx) => idx !== i) })} aria-label="Remove"><Icon name="x" size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Lab results</label>
              <input
                className="form-control"
                placeholder="Type result and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    setForm({ ...form, labResults: [...form.labResults, e.target.value.trim()] });
                    e.target.value = '';
                  }
                }}
              />
              {form.labResults.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {form.labResults.map((s, i) => (
                    <span key={i} className="badge badge-info">
                      {s} <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setForm({ ...form, labResults: form.labResults.filter((_, idx) => idx !== i) })} aria-label="Remove"><Icon name="x" size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-control" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Follow-up date</label>
                <input className="form-control" type="date" value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Record'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default VetPetRecords;