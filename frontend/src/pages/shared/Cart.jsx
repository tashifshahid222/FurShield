import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storeApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';

export const Cart = () => {
  const { refreshCartCount } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await storeApi.getCart();
      setCart(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateQty = async (productId, quantity) => {
    try {
      const res = await storeApi.updateCartItem({ productId, quantity });
      setCart(res);
      refreshCartCount();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await storeApi.removeFromCart(productId);
      setCart(res);
      refreshCartCount();
      showToast('Removed from cart');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const placeOrder = async () => {
    setOrdering(true);
    try {
      const res = await storeApi.createOrder({});
      showToast(res.message || 'Order placed successfully');
      refreshCartCount();
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="container page-section"><Loading text="Loading your cart..." /></div>;
  if (error) return <div className="container page-section"><ErrorState error={error} onRetry={load} /></div>;

  const items = cart?.data?.items || [];
  const total = cart?.totalAmount || 0;

  return (
    <div className="container page-section">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Your Cart</h1>
      <p className="text-muted mb-4">Review your items before placing an order</p>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Browse the marketplace and add some goodies for your pet."
          icon="cart"
          action={<Link to="/products" className="btn btn-primary mt-2">Browse products</Link>}
        />
      ) : (
        <div className="grid cart-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item) => (
              <div className="card card-padded" key={item._id}>
                <div className="cart-item" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {item.product?.image ? (
                    <img className="cart-item-img" src={item.product.image} alt={item.product.name} />
                  ) : (
                    <div className="cart-item-img cart-item-img-placeholder"><Icon name="bag" size={32} /></div>
                  )}
                  <div className="cart-item-body">
                    <Link to={`/products/${item.product?._id}`}>
                      <h3 style={{ fontSize: '0.95rem' }}>{item.product?.name || 'Product'}</h3>
                    </Link>
                    <p className="text-small text-muted">{formatCurrency(item.price)} each</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => updateQty(item.product?._id, item.quantity - 1)}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => updateQty(item.product?._id, item.quantity + 1)}>+</button>
                      <span style={{ marginLeft: 'auto', fontWeight: 800 }}>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm cart-remove" onClick={() => removeItem(item.product?._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-padded cart-summary">
            <h3 className="mb-2">Order summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {items.map((item) => (
                <div key={item._id} className="text-small" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">{item.product?.name} × {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button className="btn btn-primary btn-block mt-2" onClick={placeOrder} disabled={ordering}>
              {ordering ? 'Placing order...' : 'Place Order'}
            </button>
            <p className="text-small text-muted mt-1 text-center">No payment required — payment is out of scope for this demo.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;