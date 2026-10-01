import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { Pagination } from '../../components/Pagination';
import { timeAgo } from '../../utils/helpers';
import Icon from '../../components/Icon';

const typeIcon = {
  vaccination_reminder: 'syringe',
  appointment_confirmation: 'check',
  appointment_change: 'calendar',
  adoption_update: 'heart-filled',
  product_notification: 'bag',
  system: 'settings',
  general: 'sparkles',
};

export const Notifications = () => {
  const { refreshUnread } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = async (pg) => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll({ page: pg, limit: 15 });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
  }, [page]);

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      refreshUnread();
      load(page);
    } catch {
      // ignore
    }
  };

  const markAll = async () => {
    try {
      await notificationApi.markAllRead();
      refreshUnread();
      load(page);
    } catch {
      // ignore
    }
  };

  return (
    <div className="container page-section" style={{ maxWidth: 820 }}>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Notifications</h1>
          <p className="text-muted">Stay up to date with appointments, adoptions and more</p>
        </div>
        {data?.unreadCount > 0 && <button className="btn btn-outline btn-sm" onClick={markAll}>Mark all read</button>}
      </div>

      {loading ? <Loading /> : !data || data.data.length === 0 ? (
        <EmptyState title="No notifications yet" message="New updates about your pets, appointments and orders will appear here." icon="bell" />
      ) : (
        <>
          {data.data.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${n.isRead ? '' : 'unread'}`}
              onClick={() => !n.isRead && markRead(n._id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}><Icon name={typeIcon[n.type] || 'bell'} size={22} /></span>
                <div style={{ flex: 1 }}>
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-message">{n.message}</div>
                  <div className="notif-time">{timeAgo(n.createdAt)}</div>
                </div>
                {!n.isRead && <span className="badge badge-primary">New</span>}
              </div>
            </div>
          ))}
          <Pagination page={page} pages={data.pagination.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Notifications;