import { useEffect, useState } from 'react';
import { careApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';

export const AdminFaqs = () => {
  const { showToast } = useToast();
  const { tableVisible, handleModeChange, registerExitMode } = useSidebarTable();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: '' });

  useEffect(() => {
    handleModeChange(creating || editing);
  }, [creating, editing, handleModeChange]);

  // Register exit mode callback
  useEffect(() => {
    return registerExitMode(() => {
      setCreating(false);
      setEditing(null);
    });
  }, [registerExitMode]);

  const load = () => {
    setLoading(true);
    careApi.manageFaqs()
      .then((res) => setFaqs(res.data || []))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ question: '', answer: '', category: '' });
    setCreating(true);
  };

  const openEdit = (f) => {
    setForm({ question: f.question, answer: f.answer, category: f.category || '' });
    setEditing(f);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const res = await careApi.updateFaq(editing._id, form);
        showToast(res.message || 'FAQ updated');
      } else {
        const res = await careApi.createFaq(form);
        showToast(res.message || 'FAQ created');
      }
      setCreating(false);
      setEditing(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      const res = await careApi.deleteFaq(id);
      showToast(res.message || 'FAQ deleted');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {creating || editing ? (
        <>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{editing ? 'Edit FAQ' : 'Add FAQ'}</h1>
          <p className="text-muted mb-4">Public frequently asked questions</p>
        </>
      ) : (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>FAQs</h1>
            <p className="text-muted">Public frequently asked questions</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add FAQ</button>
        </div>
      )}

      {(creating || editing) && (
        <div className="card card-padded mb-3">
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Question <span className="required">*</span></label>
              <input className="form-control" name="question" value={form.question} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Answer <span className="required">*</span></label>
              <textarea className="form-control" name="answer" value={form.answer} onChange={handleChange} rows={4} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="form-control" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Adoption, Health, Marketplace" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
            </div>
          </form>
        </div>
      )}

      {!(creating || editing) && (loading ? <Loading /> : faqs.length === 0 ? (
        <EmptyState title="No FAQs" action={<button className="btn btn-primary btn-sm mt-2" onClick={openCreate}>+ Add FAQ</button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f) => (
            <div className="card card-padded" key={f._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{f.question}</h3>
                  <p className="text-small text-muted">{f.answer}</p>
                  {f.category && <span className="badge badge-info mt-1">{f.category}</span>}
                  <div className="text-small text-muted mt-1">{formatDate(f.updatedAt)}</div>
                </div>
                <div className="table-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(f)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFaq(f._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default AdminFaqs;