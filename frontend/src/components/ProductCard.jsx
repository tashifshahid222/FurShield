import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { RatingStars } from './RatingStars';
import Icon from './Icon';

export const ProductCard = ({ product, onAddToCart = null }) => (
  <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
    <Link to={`/products/${product._id}`} style={{ flex: 1 }}>
      {product.image ? (
        <img src={product.image} alt={product.name} className="product-card-img" />
      ) : (
        <div className="product-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--teal-50)' }}>
          <Icon name="bag" size={40} style={{ color: 'var(--teal-300)' }} />
        </div>
      )}
    </Link>
    <div className="card-padded" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Link to={`/products/${product._id}`}>
        <h3 style={{ fontSize: '1rem' }}>{product.name}</h3>
      </Link>
      <div>
        <RatingStars rating={product.rating || 0} count={product.ratingCount || 0} />
      </div>
      <div className="product-price">{formatCurrency(product.price)}</div>
      {product.stock > 0 ? (
        <p className="text-small text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="box" size={14} style={{ color: 'var(--success)' }} />
          {product.stock} in stock
        </p>
      ) : (
        <p className="text-small" style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="alert-circle" size={14} />
          Out of stock
        </p>
      )}
      {onAddToCart && (
        <button
          className="btn btn-secondary btn-sm btn-block mt-1"
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
        >
          <Icon name="cart" size={15} />
          Add to Cart
        </button>
      )}
    </div>
  </div>
);

export default ProductCard;