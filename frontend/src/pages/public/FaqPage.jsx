import { useEffect, useState } from 'react';
import { careApi } from '../../api';
import { Loading } from '../../components/Loading';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';

export const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    careApi.getFaqs()
      .then((res) => setFaqs(res.data || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter((f) => {
    if (!search) return true;
    return f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container page-section faq-page" style={{ maxWidth: 820 }}>
      <h1 style={{ marginBottom: 8 }}>Frequently Asked <span style={{ color: 'var(--primary)' }}>Questions</span></h1>
      <p className="section-subtitle">Quick answers to common questions</p>

      <input
        className="form-control mb-3"
        placeholder="Search FAQs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={() => window.location.reload()} /> : (
        filtered.length === 0 ?         <EmptyState title="No FAQs match your search" icon="info" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((f) => (
              <div className="card card-padded" key={f._id}>
                <button
                  onClick={() => setOpen(open === f._id ? null : f._id)}
                  style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: '1.02rem', fontWeight: 700, cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, color: 'var(--navy)' }}
                >
                  <span className="faq-question">{f.question}</span>
                  <span style={{ color: 'var(--primary)' }}>{open === f._id ? '−' : '+'}</span>
                </button>
                {open === f._id && (
                  <p className="text-muted mt-2" style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>{f.answer}</p>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default FaqPage;