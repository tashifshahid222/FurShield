import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { careApi } from '../../api';
import { ArticleCard } from '../../components/ArticleCard';
import { Pagination } from '../../components/Pagination';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { toEmbedUrl } from '../../utils/helpers';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

const categoryTabs = ['all', 'feeding', 'hygiene', 'exercise', 'grooming', 'vaccination', 'general'];

const labels = {
  feeding: 'Feeding',
  hygiene: 'Hygiene',
  exercise: 'Exercise',
  grooming: 'Grooming',
  vaccination: 'Vaccination',
  general: 'General',
};

export const CareResources = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [a, v] = await Promise.all([
        careApi.getArticles({ limit: 12, category: activeTab === 'all' ? undefined : activeTab, search: search || undefined }),
        careApi.getVideos({ limit: 6, category: activeTab === 'all' ? undefined : activeTab, search: search || undefined }),
      ]);
      setArticles(a);
      setVideos(v);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [activeTab, search]);

  return (
    <>
      <section className="hero" style={{ padding: '48px 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: 8 }}>Pet Care <span style={{ color: 'var(--primary)' }}>Resources</span></h1>
          <p className="section-subtitle">Articles, videos and FAQs to help you care better</p>
          <input
            className="form-control"
            placeholder="Search care topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 460 }}
          />
        </div>
      </section>

      <Reveal as="section" className="page-section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="tabs">
            {categoryTabs.map((c) => (
              <button key={c} className={`tab ${activeTab === c ? 'active' : ''}`} onClick={() => setActiveTab(c)}>
                {c === 'all' ? 'All topics' : labels[c]}
              </button>
            ))}
          </div>

          {loading ? <Loading text="Loading resources..." /> : error ? <ErrorState error={error} onRetry={load} /> : (
            <>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="book" size={18} /> Articles</h2>
              {!articles || articles.data.length === 0 ? (
                <EmptyState title="No articles found" message="Try a different topic or search term." />
              ) : (
                <div className="grid grid-3 mb-4">
                  {articles.data.map((a, i) => (
                    <Reveal key={a._id} delay={(i % 3) * 90} style={{ height: '100%' }}>
                      <ArticleCard article={a} fullSummary />
                    </Reveal>
                  ))}
                </div>
              )}

              <h2 style={{ fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="video" size={18} /> Videos</h2>
              {!videos || videos.data.length === 0 ? (
                <EmptyState title="No videos available" icon="video" />
              ) : (
                <div className="grid grid-3">
                  {videos.data.map((v, i) => (
                    <Reveal key={v._id} delay={(i % 3) * 90} style={{ height: '100%' }}>
                      <div className="card card-hover">
                      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0f172a' }}>
                        {v.url ? (
                          <iframe
                            src={toEmbedUrl(v.url)}
                            title={v.title}
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
                            allowFullScreen
                          />
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="video" size={40} /></div>
                        )}
                      </div>
                      <div className="card-padded">
                        <span className="badge badge-teal">{labels[v.category] || v.category}</span>
                        <h3 className="mt-1" style={{ fontSize: '1rem' }}>{v.title}</h3>
                        {v.description && <p className="text-small text-muted mt-1">{v.description}</p>}
                      </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}

<div className="mt-4 text-center">
  <Link to="/faq" className="btn btn-outline-teal"><Icon name="info" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Browse FAQs</Link>
</div>
            </>
          )}
        </div>
      </Reveal>
    </>
  );
};

export default CareResources;