import { useEffect, useState } from 'react';
import { careApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';

export const AdminVideos = () => {
  const { showToast } = useToast();
  const { tableVisible, handleModeChange, registerExitMode } = useSidebarTable();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '' });

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
    careApi.getVideos({ page, limit: 20 })
      .then((res) => {
        setVideos(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const openCreate = () => {
    setForm({ title: '', url: '', description: '' });
    setCreating(true);
  };

  const openEdit = (v) => {
    setForm({ title: v.title, url: v.url, description: v.description || '' });
    setEditing(v);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescription = (e) => {
    if (e.target.value.replace(/\r?\n/g, '').length > 200) return;
    setForm({ ...form, description: e.target.value });
  };

  const truncate = (text = '', max) => (text.length > max ? text.slice(0, max) + '...' : text);

  const youtubeId = (url = '') => {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    return m ? m[1] : null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: form.title, url: form.url, description: form.description };
      if (editing) {
        const res = await careApi.updateVideo(editing._id, payload);
        showToast(res.message || 'Video updated');
      } else {
        const res = await careApi.createVideo(payload);
        showToast(res.message || 'Video added');
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

  const removeVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      const res = await careApi.deleteVideo(id);
      showToast(res.message || 'Video deleted');
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      {creating || editing ? (
        <>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{editing ? 'Edit video' : 'Add video'}</h1>
          <p className="text-muted mb-4">Instructional videos shown in the Care hub</p>
        </>
      ) : (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Care videos</h1>
            <p className="text-muted">Instructional videos shown in the Care hub</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add video</button>
        </div>
      )}

      {(creating || editing) && (
        <div className="card card-padded mb-3">
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{editing ? 'Edit video' : 'Add video'}</h2>
          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Title <span className="required">*</span></label>
                <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">YouTube URL <span className="required">*</span></label>
                <input className="form-control" name="url" value={form.url} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleDescription} rows={3} />
              <p className="text-small text-muted mt-1">{form.description.replace(/\r?\n/g, '').length} / 200 characters</p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Add')}</button>
            </div>
          </form>
        </div>
      )}

      {!(creating || editing) && (loading ? <Loading /> : videos.length === 0 ? (
        <EmptyState title="No videos" action={<button className="btn btn-primary btn-sm mt-2" onClick={openCreate}>+ Add video</button>} />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="video-col">Video</th>
                  <th>URL</th>
                  <th>Description</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => {
                  const yid = youtubeId(v.url);
                  return (
                    <tr key={v._id}>
                      <td className="video-col">
                        <div style={{ alignItems: 'center', gap: 10 }}>
                          {yid ? (
                            <img src={`https://img.youtube.com/vi/${yid}/mqdefault.jpg`} alt="" style={{ width: 64, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '1.2rem' }}><Icon name="video" size={18} /></span>
                          )}
                          <div>
                            <strong>{truncate(v.title, 30)}</strong>
                            <div className="text-small text-muted">{v.viewCount || 0} views</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-small">{truncate(v.url, 30)}</td>
                      <td className="text-small" style={{ maxWidth: 220 }} title={v.description}>{truncate(v.description, 20)}</td>
                      <td className="text-small">{formatDate(v.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => removeVideo(v._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

export default AdminVideos;