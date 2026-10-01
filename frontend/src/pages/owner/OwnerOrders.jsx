import { useEffect, useState } from 'react';
import { storeApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, imageUrl } from '../../utils/helpers';
import Icon from '../../components/Icon';

const statusBadge = {
  pending: <span className="badge badge-warning">Pending</span>,
  confirmed: <span className="badge badge-info">Confirmed</span>,
  processing: <span className="badge badge-primary">Processing</span>,
  completed: <span className="badge badge-success">Completed</span>,
  cancelled: <span className="badge badge-neutral">Cancelled</span>,
};

export const OwnerOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeApi.getOrders({ limit: 50 })
      .then((res) => setOrders(res.data || []))
      .catch((err) => showToast(err.response?.data?.message || 'Failed to load orders', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      const res = await storeApi.cancelOrder(orderId);
      showToast(res.message || 'Order cancelled');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: 'cancelled' } : o)));
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel order', 'error');
    }
  };

  return (
    <>
      <div className="health-timeline-title">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>My Orders</h1>
          <p className="text-muted">Track your product orders</p>
        </div>
        <Link to="/products" className="btn btn-primary btn-sm"><Icon name="bag" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Shop more</Link>
      </div>

      {loading ? <Loading /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Browse the marketplace and place your first order." action={<Link className="btn btn-primary btn-sm mt-2" to="/products">Browse products</Link>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((o) => (
            <div className="card card-padded" key={o._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
                <div>
                  <strong>Order #{o._id.slice(-8)}</strong>
                  <div className="text-small text-muted">{formatDate(o.orderDate)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {statusBadge[o.status] || <span className="badge badge-neutral">{o.status}</span>}
                  {['pending', 'confirmed'].includes(o.status) && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(o._id)}>Cancel order</button>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {o.items.map((item) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.product?.image ? (
                      <img src={imageUrl(item.product.image)} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bag" size={20} /></div>
                    )}
                    <span style={{ flex: 1 }}>{item.productName} × {item.quantity}</span>
                    <span className="text-muted">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'flex-end', fontWeight: 800 }}>
                Total: {formatCurrency(o.totalAmount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OwnerOrders;