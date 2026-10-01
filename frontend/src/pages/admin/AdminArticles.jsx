import { useEffect, useState } from 'react';
import { careApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage, imageUrl } from '../../utils/helpers';
import Icon from '../../components/Icon';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const categoriesList = ['feeding', 'hygiene', 'exercise', 'grooming', 'vaccination', 'general'];

const truncateWords = (text = '', n = 5) => {
  const words = String(text).split(/\s+/).filter(Boolean);
  return words.length > n ? `${words.slice(0, n).join(' ')}...` : text;
};

export const AdminArticles = () => {
  const { showToast } = useToast();
  const { tableVisible, handleModeChange, registerExitMode } = useSidebarTable();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'general', summary: '', content: '', image: null, featured: false, status: 'published' });

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

  const load = (page = 1) => {
    setLoading(true);
    careApi.manageArticles({ page, limit: 20 })
      .then((res) => {
        setArticles(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const openCreate = () => {
    setForm({ title: '', category: 'general', summary: '', content: '', image: null, featured: false, status: 'published' });
    setCreating(true);
  };

  const openEdit = (a) => {
    setForm({ title: a.title, category: a.category || 'general', summary: a.summary || '', content: a.content || '', image: null, featured: !!a.featured, status: a.status || 'published' });
    setEditing(a);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { image, ...rest } = form;
      const payload = { ...rest };
      if (image) payload.coverImage = image;
      if (editing) {
        const res = await careApi.updateArticle(editing._id, payload);
        showToast(res.message || 'Article updated');
      } else {
        const res = await careApi.createArticle(payload);
        showToast(res.message || 'Article created');
      }
      setCreating(false);
      setEditing(null);
      load(pagination.page || 1);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await careApi.deleteArticle(id);
      showToast(res.message || 'Article deleted');
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {creating || editing ? (
        <>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{editing ? 'Edit article' : 'New article'}</h1>
          <p className="text-muted mb-4">Educational content shown in the Care hub</p>
        </>
      ) : (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Care articles</h1>
            <p className="text-muted">Educational content shown in the Care hub</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New article</button>
        </div>
      )}

      {(creating || editing) && (
        <div className="card card-padded mb-3">
          <div className="health-timeline-title" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem' }}>{editing ? 'Edit article' : 'New article'}</h2>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Title <span className="required">*</span></label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <SelectDropdown
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  options={categoriesList.map((c) => ({ value: c, label: c }))}
                />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Cover image</label>
                <input className="form-control" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Summary</label>
              <input className="form-control" name="summary" value={form.summary} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Content <span className="required">*</span></label>
              <textarea className="form-control" name="content" value={form.content} onChange={handleChange} rows={10} required placeholder="Write the article body here..." />
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
            <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.status === 'published'} onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })} /> Published (visible to the public)
            </label>
            <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Show on homepage
            </label>
          </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Publish')}</button>
            </div>
          </form>
        </div>
      )}

      {!(creating || editing) && (loading ? <Loading /> : articles.length === 0 ? (
        <EmptyState title="No articles" action={<button className="btn btn-primary btn-sm mt-2" onClick={openCreate}>+ New article</button>} />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table articles-table">
              <thead>
                <tr>
                  <th className="cell-title">Article</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {a.coverImage ? <img src={imageUrl(a.coverImage)} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} /> : <span style={{ fontSize: '1.2rem' }}><Icon name="book" size={18} /></span>}
                        <div className="cell-title">
                          <strong>{truncateWords(a.title)}</strong>
                          <div className="text-small text-muted">{truncateWords(a.summary)}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{a.category}</span></td>
                    <td>{a.author?.name || '—'}</td>
                    <td>{a.viewCount || 0}</td>
                    <td><span className={`badge ${a.status === 'published' ? 'badge-success' : 'badge-neutral'}`}>{a.status === 'published' ? 'Published' : 'Draft'}</span></td>
                    <td className="text-small">{formatDate(a.updatedAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => removeArticle(a._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-outline'}`} onClick={() => load(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      ))}
    </>
  );
};

export default AdminArticles;