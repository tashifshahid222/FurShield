import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import Icon from '../../components/Icon';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.admin()
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading platform analytics..." />;
  if (!data) return <EmptyState title="No data yet" />;

  const stats = [
    { label: 'Total users', value: data.users?.total, icon: 'users', to: '/admin/users', bg: 'var(--primary-light)', color: 'var(--primary-dark)' },
    { label: 'Owners / Vets / Shelters', value: `${data.users?.owners} / ${data.users?.veterinarians} / ${data.users?.shelters}`, icon: 'tag', bg: 'var(--info-light)', color: 'var(--info)' },
    { label: 'Pets', value: data.pets, icon: 'paw', to: '/admin/pets', bg: 'var(--success-light)', color: 'var(--success)' },
    { label: 'Products', value: data.products, icon: 'bag', to: '/admin/products', bg: 'var(--warning-light)', color: 'var(--amber-700)' },
    { label: 'Orders', value: data.orders?.total, icon: 'box', to: '/admin/orders', bg: 'var(--danger-light)', color: 'var(--danger)' },
    { label: 'Pending orders', value: data.orders?.pending, icon: 'clock', to: '/admin/orders', bg: 'var(--warning-light)', color: 'var(--amber-700)' },
    { label: 'Revenue', value: formatCurrency(data.orders?.revenue), icon: 'credit-card', bg: 'var(--success-light)', color: 'var(--success)' },
    { label: 'Appointments', value: data.appointments?.total, icon: 'calendar', to: '/admin/appointments', bg: 'var(--info-light)', color: 'var(--info)' },
    { label: 'Pending appts', value: data.appointments?.pending, icon: 'clock', to: '/admin/appointments', bg: 'var(--warning-light)', color: 'var(--amber-700)' },
    { label: 'Adoption listings', value: data.adoptions, icon: 'heart', to: '/admin/adoptions', bg: 'var(--primary-light)', color: 'var(--primary-dark)' },
    { label: 'Reviews', value: data.reviews, icon: 'star', to: '/admin/reviews', bg: 'var(--warning-light)', color: 'var(--amber-700)' },
    { label: 'Contact messages', value: data.messages, icon: 'mail', to: '/admin/messages', bg: 'var(--danger-light)', color: 'var(--danger)' },
    { label: 'Categories', value: data.categories, icon: 'tag', to: '/admin/categories', bg: 'var(--info-light)', color: 'var(--info)' },
    { label: 'Articles', value: data.articles, icon: 'book', to: '/admin/articles', bg: 'var(--success-light)', color: 'var(--success)' },
    { label: 'FAQs', value: data.faqs, icon: 'question-circle', to: '/admin/faqs', bg: 'var(--warning-light)', color: 'var(--amber-700)' },
    { label: 'Videos', value: data.videos, icon: 'video', to: '/admin/videos', bg: 'var(--danger-light)', color: 'var(--danger)' },
  ];

  return (
    <>
      <div className="greeting">
        <h1>Welcome, {user?.name?.split(' ')[0]}! <Icon name="shield" size={26} style={{ color: 'var(--primary)', verticalAlign: 'middle' }} /></h1>
        <p>FurShield platform overview</p>
      </div>

      <div className="grid grid-4 mb-4">
        {stats.map((s) => {
          const inner = (
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: s.bg, color: s.color }}><Icon name={s.icon} size={22} /></div>
              <div>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          );
          return s.to ? <Link key={s.label} to={s.to} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link> : <div key={s.label}>{inner}</div>;
        })}
      </div>

      <div className="grid dash-grid-3" style={{ alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Recent orders</h2>
          {data.recentOrders?.length === 0 ? <EmptyState title="No orders" /> : (
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {data.recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td><strong>#{o._id.slice(-8)}</strong><div className="text-small text-muted">{o.owner?.name}</div></td>
                      <td className="text-right">{formatCurrency(o.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Recent appointments</h2>
          {data.recentAppointments?.length === 0 ? <EmptyState title="No appointments" /> : (
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {data.recentAppointments.map((a) => (
                    <tr key={a._id}>
                      <td><strong>{a.pet?.name}</strong><div className="text-small text-muted">{a.owner?.name}</div></td>
                      <td className="text-right text-small">{formatDate(a.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Recent users</h2>
          {data.recentUsers?.length === 0 ? <EmptyState title="No users" /> : (
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {data.recentUsers.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong><div className="text-small text-muted">{u.role}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;