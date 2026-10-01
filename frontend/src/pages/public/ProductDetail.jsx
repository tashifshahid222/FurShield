import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi, reviewApi, storeApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Loading';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { RatingStars } from '../../components/RatingStars';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const ProductDetail = () => {
  const { id } = useParams();
  const { user, refreshCartCount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.getById(id);
      setProduct(res.data);
      const rev = await reviewApi.getAll({ target: id, targetType: 'product', limit: 50 }).catch(() => ({ data: [] }));
      setReviews(rev.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await storeApi.addToCart({ productId: id, quantity });
      showToast('Added to cart');
      refreshCartCount();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setAdding(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setReviewError('');
    setReviewing(true);
    try {
      const res = await reviewApi.create({ targetType: 'product', target: id, rating: reviewForm.rating, comment: reviewForm.comment });
      showToast(res.message || 'Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      load();
    } catch (err) {
      setReviewError(getErrorMessage(err));
    } finally {
      setReviewing(false);
    }
  };

  const hasReviewed = user && reviews.some((r) => r.author?._id === user._id);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <div className="container page-section"><ErrorState error={error} onRetry={load} /></div>;
  if (!product) return <div className="container page-section"><EmptyState title="Product not found" /></div>;

  return (
    <div className="container page-section detail-page">
      <Link to="/products" className="btn btn-ghost btn-sm mb-2">← Back to products</Link>

      <Reveal className="detail-hero">
        <div>
          {product.image ? (
            <img src={product.image} alt={product.name} className="detail-hero-img" />
          ) : (
            <div className="detail-hero-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}><Icon name="bag" size={48} /></div>
          )}
        </div>
        <div>
          <span className="badge badge-primary">{product.category?.name || 'Product'}</span>
          <h1 className="mt-1">{product.name}</h1>
          <div className="mb-2"><RatingStars rating={product.rating || 0} count={product.ratingCount || 0} /></div>
          <p className="product-price mb-2">{formatCurrency(product.price)}</p>
          <p className="text-muted" style={{ marginBottom: 12, whiteSpace: 'pre-wrap' }}>{product.description}</p>

          <div className="card card-padded mb-3" style={{ maxWidth: 380 }}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                className="form-control"
                style={{ width: 100 }}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={addToCart} disabled={adding || product.stock <= 0}>
              {adding ? 'Adding...' : product.stock <= 0 ? 'Out of stock' : 'Add to Cart'}
            </button>
<p className="text-small text-muted mt-1">
  {product.stock > 0 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={14} /> In stock ({product.stock} available)</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="x" size={14} /> Out of stock</span>}
</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="grid product-reviews-layout">
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Customer reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map((r) => (
                <div className="review-card" key={r._id}>
                  <div className="review-header">
                    <div className="nav-avatar">{r.author?.name?.[0]?.toUpperCase() || '?'}</div>
                    <div>
                      <strong>{r.author?.name || 'Anonymous'}</strong>
                      <div className="text-small text-muted">{formatDate(r.createdAt)}</div>
                      <RatingStars rating={r.rating} size={13} />
                    </div>
                  </div>
                  {r.comment && <p className="text-small" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {user ? (
            hasReviewed ? (
              <div className="alert alert-info">You have already reviewed this product.</div>
            ) : (
              <div className="card card-padded">
                <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>Write a review</h3>
                {reviewError && <div className="alert alert-error">{reviewError}</div>}
                <form onSubmit={submitReview}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <SelectDropdown
                      value={reviewForm.rating}
                      onChange={(v) => setReviewForm({ ...reviewForm, rating: v })}
                      options={[
                        { value: 5, label: '★★★★★ Excellent' },
                        { value: 4, label: '★★★★☆ Very good' },
                        { value: 3, label: '★★★☆☆ Good' },
                        { value: 2, label: '★★☆☆☆ Fair' },
                        { value: 1, label: '★☆☆☆☆ Poor' },
                      ]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your review</label>
                    <textarea className="form-control" placeholder="Share your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={reviewing}>
                    {reviewing ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )
          ) : (
            <div className="card card-padded">
              <p className="text-muted mb-2">Sign in to leave a review.</p>
              <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default ProductDetail;