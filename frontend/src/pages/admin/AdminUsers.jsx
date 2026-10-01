import { useEffect, useState } from 'react';
import { userApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const roleBadge = {
  owner: <span className="badge badge-info">Owner</span>,
  veterinarian: <span className="badge badge-teal">Veterinarian</span>,
  shelter: <span className="badge badge-primary">Shelter</span>,
  admin: <span className="badge badge-danger">Admin</span>,
};

export const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = (page = 1, role = roleFilter, q = search) => {
    setLoading(true);
    userApi.getAll({
      role: role || undefined,
      search: q || undefined,
      page,
      limit: 20,
      includeVetDetails: true,
    })
      .then((res) => {
        setUsers(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(err.response?.data?.message || 'Failed to load users', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const changeRole = (id, role) => {
    userApi.update(id, { role })
      .then((res) => showToast('Role updated'))
      .catch((err) => showToast(err.response?.data?.message || 'Update failed', 'error'))
      .then(() => load(pagination.page));
  };

  const toggleStatus = (id, current) => {
    const fn = current === 'active' ? userApi.deactivate : userApi.activate;
    fn(id)
      .then((res) => showToast(res.message || 'User status updated'))
      .catch((err) => showToast(err.response?.data?.message || 'Update failed', 'error'))
      .then(() => load(pagination.page));
  };

  const removeUser = async (id) => {
    if (!window.confirm('Delete this user and all their records? This cannot be undone.')) return;
    try {
      const res = await userApi.remove(id);
      showToast(res.message || 'User deleted');
      load(pagination.page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Users</h1>
          <p className="text-muted">Manage all accounts on the platform</p>
        </div>
      </div>

      <div className="filter-row mb-3">
        <input className="form-control" style={{ maxWidth: 260 }} placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(1)} />
        <SelectDropdown
          value={roleFilter}
          onChange={(v) => { setRoleFilter(v); load(1, v, search); }}
          placeholder="All roles"
          style={{ maxWidth: 180 }}
          options={[
            { value: 'owner', label: 'Owners' },
            { value: 'veterinarian', label: 'Veterinarians' },
            { value: 'shelter', label: 'Shelters' },
            { value: 'admin', label: 'Admins' },
          ]}
        />
        <button className="btn btn-outline btn-sm" onClick={() => load(1)}>Search</button>
      </div>

      {loading ? <Loading /> : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {u.profileImage ? <img src={u.profileImage} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div className="nav-avatar">{u.name?.[0]}</div>}
                        <div>
                          <strong>{u.name}</strong>
                          <div className="text-small text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{roleBadge[u.role] || u.role}</td>
                    <td><div className="text-small">{u.phone}</div><div className="text-small text-muted text-truncate" style={{ maxWidth: 200 }}>{[u.address?.street, u.address?.city, u.address?.state, u.address?.zip].filter(Boolean).join(', ') || '—'}</div></td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span>
                    </td>
                    <td className="text-small">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="table-actions">
{u.role !== 'admin' && (
  <SelectDropdown
    value={u.role}
    onChange={(v) => changeRole(u._id, v)}
    style={{ width: 130 }}
    options={[
      { value: 'owner', label: 'Owner' },
      { value: 'veterinarian', label: 'Veterinarian' },
      { value: 'shelter', label: 'Shelter' },
    ]}
  />
)}
                        {u.status === 'active' ? (
                          <button className="btn btn-warning btn-sm" onClick={() => toggleStatus(u._id, u.status)}>Deactivate</button>
                        ) : (
                          <button className="btn btn-success btn-sm" onClick={() => toggleStatus(u._id, u.status)}>Activate</button>
                        )}
                        {u.role !== 'admin' && <button className="btn btn-danger btn-sm" onClick={() => removeUser(u._id)}>Delete</button>}
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
      )}
    </>
  );
};

export default AdminUsers;