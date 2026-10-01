import { useEffect, useState } from 'react';
import { productApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useSidebarTable } from '../../context/SidebarTableContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatCurrency, formatDate, getErrorMessage, imageUrl } from '../../utils/helpers';
import Icon from '../../components/Icon';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const AdminProducts = () => {
  const { showToast } = useToast();
  const { tableVisible, handleModeChange, registerExitMode } = useSidebarTable();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', stock: '', status: 'active', featured: false });
  const [imageFile, setImageFile] = useState(null);

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
    Promise.all([
      productApi.getAll({ page, limit: 20, includeInactive: true }),
      productApi.getCategories(),
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data || []);
        if (prodRes.pagination) setPagination(prodRes.pagination);
        setCategories(catRes.data || []);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const openCreate = () => {
    setForm({ name: '', description: '', category: '', price: '', stock: '', status: 'active', featured: false });
    setImageFile(null);
    setCreating(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category?._id || p.category || '',
      price: p.price,
      stock: p.stock,
      status: p.status || 'active',
      featured: !!p.featured,
    });
    setImageFile(null);
    setEditing(p);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (imageFile) payload.image = imageFile;
      if (editing) {
        const res = await productApi.update(editing._id, payload);
        showToast(res.message || 'Product updated');
      } else {
        const res = await productApi.create(payload);
        showToast(res.message || 'Product created');
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

  const removeProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await productApi.remove(id);
      showToast(res.message || 'Product deleted');
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const getSelectableCategories = () => {
    const list = categories.filter((c) => c.status === 'active');
    if (form.category && !list.some((c) => c._id === form.category)) {
      const current = categories.find((c) => c._id === form.category);
      if (current && !list.some((c) => c._id === current._id)) list.push(current);
    }
    return list;
  };

  return (
    <>
      {creating || editing ? (
        <>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{editing ? 'Edit product' : 'Add product'}</h1>
          <p className="text-muted mb-4">Manage the marketplace catalog</p>
        </>
      ) : (
        <div className="health-timeline-title">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Products</h1>
            <p className="text-muted">Manage the marketplace catalog</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add product</button>
        </div>
      )}

      {(creating || editing) && (
        <div className="card card-padded mb-3">
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{editing ? 'Edit product' : 'Add product'}</h2>
          <form onSubmit={submit}>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Name <span className="required">*</span></label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-end' }}>
                <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.status === 'active'} onChange={(e) => setForm({ ...form, status: e.target.checked ? 'active' : 'inactive' })} /> Active (visible in store)
                </label>
                <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Show on homepage
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={4} />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <SelectDropdown
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  options={getSelectableCategories().map((c) => ({ value: c._id, label: c.name }))}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Price ($) <span className="required">*</span></label>
                <input className="form-control" type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Stock <span className="required">*</span></label>
                <input className="form-control" type="number" min="0" name="stock" value={form.stock} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Image</label>
              <input className="form-control" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
            </div>
          </form>
        </div>
      )}

      {!(creating || editing) && (loading ? <Loading /> : products.length === 0 ? (
        <EmptyState title="No products" action={<button className="btn btn-primary btn-sm mt-2" onClick={openCreate}>+ Add product</button>} />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.image ? <img src={imageUrl(p.image)} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bag" size={18} /></div>}
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.category?.name || '—'}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td>{p.stock}</td>
                    <td><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{p.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                    <td className="text-small">{formatDate(p.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => removeProduct(p._id)}>Delete</button>
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

export default AdminProducts;