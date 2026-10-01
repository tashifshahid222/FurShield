import { useEffect, useState } from 'react';
import { productApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { getErrorMessage, imageUrl } from '../../utils/helpers';
import Icon from '../../components/Icon';

export const AdminCategories = () => {
  const { showToast } = useToast();
  const { tableVisible, handleModeChange, registerExitMode } = useSidebarTable();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: null });

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
    productApi.getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ name: '', description: '', image: null });
    setCreating(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description || '', image: null });
    setEditing(c);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDescription = (e) => {
    if (e.target.value.replace(/\r?\n/g, '').length > 50) return;
    setForm({ ...form, description: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description };
      if (form.image) payload.image = form.image;
      if (editing) {
        const res = await productApi.updateCategory(editing._id, payload);
        showToast(res.message || 'Category updated');
      } else {
        const res = await productApi.createCategory(payload);
        showToast(res.message || 'Category created');
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

  const toggleStatus = async (c) => {
    try {
      const res = await productApi.toggleCategory(c._id);
      showToast(res.message || 'Category status updated');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm('Delete this category? Categories with products cannot be deleted.')) return;
    try {
      const res = await productApi.deleteCategory(id);
      showToast(res.message || 'Category deleted');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {creating || editing ? (
        <>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{editing ? 'Edit category' : 'Add category'}</h1>
          <p className="text-muted mb-4">Organize the marketplace catalog</p>
        </>
      ) : (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Categories</h1>
            <p className="text-muted">Organize the marketplace catalog</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add category</button>
        </div>
      )}

      {(creating || editing) && (
        <div className="card card-padded mb-3">
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{editing ? 'Edit category' : 'Add category'}</h2>
          <form onSubmit={submit}>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Name <span className="required">*</span></label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleDescription} rows={3} />
              <p className="text-small text-muted mt-1">{form.description.replace(/\r?\n/g, '').length} / 50 characters</p>
            </div>
            <div className="form-group">
              <label className="form-label">Image</label>
              <input className="form-control" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
            </div>
          </form>
        </div>
      )}

      {!(creating || editing) && (loading ? <Loading /> : categories.length === 0 ? (
        <EmptyState title="No categories" action={<button className="btn btn-primary btn-sm mt-2" onClick={openCreate}>+ Add category</button>} />
      ) : (
        <div className="grid grid-3">
          {categories.map((c) => (
            <div className="card card-padded" key={c._id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                {c.image ? <img src={imageUrl(c.image)} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ fontSize: '2rem' }}><Icon name="tag" size={28} /></div>}
                <div>
                  <strong>{c.name}</strong>
                  <div className="text-small text-muted">{(c.productCount ?? '?')} products</div>
                </div>
              </div>
              <p className="text-small text-muted mb-2">{c.description}</p>
              <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{c.status === 'active' ? 'Active' : 'Inactive'}</span>
              <div className="table-actions mt-2">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(c)}>{c.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                <button className="btn btn-danger btn-sm" onClick={() => removeCategory(c._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default AdminCategories;