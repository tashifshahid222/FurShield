import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careApi } from '../../api';
import { Loading } from '../../components/Loading';
import { ErrorState } from '../../components/ErrorState';
import { formatDate } from '../../utils/helpers';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

export const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    careApi.getArticle(id)
      .then((res) => setArticle(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading text="Loading article..." />;
  if (error) return <div className="container page-section"><ErrorState error={error} /></div>;
  if (!article) return <div className="container page-section">Article not found</div>;

  return (
    <div className="container page-section detail-page" style={{ maxWidth: 860 }}>
      <Link to="/care" className="btn btn-ghost btn-sm mb-2">← Back to resources</Link>
      <span className="badge badge-primary mb-2" style={{ textTransform: 'capitalize' }}>{article.category}</span>
      <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>{article.title}</h1>
      <p className="text-muted text-small mb-3">
        Published {formatDate(article.createdAt)} {article.author ? `· By ${article.author.name}` : ''} · <Icon name="eye" size={14} style={{ verticalAlign: 'middle' }} /> {article.viewCount || 0}
      </p>
      <Reveal>
      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 24 }} />
      )}
      </Reveal>
      <Reveal className="card card-padded" style={{ fontSize: '1.05rem', whiteSpace: 'pre-wrap', lineHeight: 1.8, border: 'none', boxShadow: 'none', background: 'transparent' }}>
        {article.content}
      </Reveal>
      <Reveal>
      {article.tags && article.tags.length > 0 && (
        <div className="mt-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {article.tags.map((t) => <span key={t} className="badge badge-neutral">#{t}</span>)}
        </div>
      )}
      </Reveal>
    </div>
  );
};

export default ArticleDetail;