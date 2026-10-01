import { useEffect, useState } from 'react';
import { storeApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

const statusBadge = {
  pending: <span className="badge badge-warning">Pending</span>,
  confirmed: <span className="badge badge-info">Confirmed</span>,
  processing: <span className="badge badge-primary">Processing</span>,
  completed: <span className="badge badge-success">Completed</span>,
  cancelled: <span className="badge badge-danger">Cancelled</span>,
};

export const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');

  const load = (page = 1, status = statusFilter) => {
    setLoading(true);
    storeApi.getOrders({ status: status || undefined, page, limit: 20 })
      .then((res) => {
        setOrders(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await storeApi.updateOrderStatus(orderId, status);
      showToast(res.message || 'Order status updated');
      load(pagination.page);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Orders</h1>
          <p className="text-muted">All marketplace orders across the platform</p>
        </div>
      </div>

      <div className="filter-tabs mb-3">
        {['', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'].map((s) => (
          <button
            key={s || 'all'}
            className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => { setStatusFilter(s); load(1, s); }}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : orders.length === 0 ? (
        <EmptyState title="No orders" />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td><strong>#{o._id.slice(-8)}</strong></td>
                    <td>{o.owner?.name}<div className="text-small text-muted">{o.owner?.email}</div></td>
                    <td>{o.items?.reduce((sum, i) => sum + (i.quantity || 0), 0)} item(s)</td>
                    <td>{formatCurrency(o.totalAmount)}</td>
                    <td>{statusBadge[o.status] || <span className="badge badge-neutral">{o.status}</span>}</td>
                    <td className="text-small">{formatDate(o.orderDate || o.createdAt)}</td>
                    <td>
{o.status !== 'completed' && o.status !== 'cancelled' && (
  <SelectDropdown
    value={o.status}
    onChange={(v) => updateStatus(o._id, v)}
    style={{ width: 140 }}
    options={['pending', 'confirmed', 'processing', 'completed'].map((s) => ({ value: s, label: s }))}
  />
)}
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

export default AdminOrders;