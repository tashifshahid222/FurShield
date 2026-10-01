import { Link } from 'react-router-dom';
import { formatDate, imageUrl } from '../utils/helpers';
import Icon from './Icon';

const truncateWords = (text = '', n = 5) => {
  const words = String(text).split(/\s+/).filter(Boolean);
  return words.length > n ? `${words.slice(0, n).join(' ')}...` : text;
};

const categoryLabel = {
  feeding: 'Feeding',
  hygiene: 'Hygiene',
  exercise: 'Exercise',
  grooming: 'Grooming',
  vaccination: 'Vaccination',
  general: 'General Care',
};

export const ArticleCard = ({ article, fullSummary }) => (
  <Link to={`/care/articles/${article._id}`} className="card card-hover" style={{ display: 'block' }}>
    {article.coverImage ? (
      <img src={imageUrl(article.coverImage)} alt={article.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--teal-50)' }}>
        <Icon name="book" size={42} style={{ color: 'var(--teal-300)' }} />
      </div>
    )}
    <div className="card-padded">
      <span className="badge badge-primary">{categoryLabel[article.category] || article.category}</span>
      <h3 className="mt-2" style={{ fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncateWords(article.title)}</h3>
      <p className="text-small text-muted mt-1" style={fullSummary ? { wordBreak: 'break-word' } : { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {fullSummary ? (article.summary || article.content) : truncateWords(article.summary || article.content)}
      </p>
      <p className="text-small text-muted mt-2" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Icon name="calendar" size={14} />
          {formatDate(article.createdAt)}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Icon name="eye" size={14} />
          {article.viewCount || 0}
        </span>
      </p>
    </div>
  </Link>
);

export default ArticleCard;