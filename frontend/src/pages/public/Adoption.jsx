import { useEffect, useState } from 'react';
import { adoptionApi } from '../../api';
import { AdoptionCard } from '../../components/AdoptionCard';
import { Pagination } from '../../components/Pagination';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import Reveal from '../../components/Reveal';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const Adoption = () => {
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const [applied, setApplied] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const load = async (filters, pg) => {
    setLoading(true);
    setError(null);
    try {
      const result = await adoptionApi.getAll({ page: pg, limit: 9, public: true, ...filters });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(applied, page);
  }, [applied, page]);

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied({ search: search || undefined, species: species || undefined });
  };

  return (
    <>
      <section className="hero" style={{ padding: '48px 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: 8 }}>Adopt a <span style={{ color: 'var(--primary)' }}>Pet</span></h1>
          <p className="section-subtitle">Give a loving home to a pet from a verified shelter</p>
          <form className="search-bar" onSubmit={applyFilters}>
            <input className="form-control" placeholder="Search by name or breed..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <SelectDropdown
              value={species}
              onChange={setSpecies}
              placeholder="All species"
              ariaLabel="Filter by species"
              options={[
                { value: 'dog', label: 'Dog' },
                { value: 'cat', label: 'Cat' },
                { value: 'bird', label: 'Bird' },
                { value: 'rabbit', label: 'Rabbit' },
                { value: 'fish', label: 'Fish' },
                { value: 'reptile', label: 'Reptile' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <button className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <Reveal as="section" className="page-section" style={{ paddingTop: 24 }}>
        <div className="container">
          {loading ? <Loading text="Loading adorable pets..." /> : error ? <ErrorState error={error} onRetry={() => load(applied, page)} /> : data && (
            <>
              {data.data.length === 0 ? (
                <EmptyState title="No pets available for adoption right now" message="Check back soon or adjust your search." icon="paw" />
              ) : (
                <>
                  <p className="text-muted mb-2">{data.pagination.total} pet(s) waiting for a home</p>
                  <div className="grid grid-3">
                    {data.data.map((l, i) => (
                      <Reveal key={l._id} delay={(i % 3) * 90} style={{ height: '100%' }}>
                        <AdoptionCard listing={l} />
                      </Reveal>
                    ))}
                  </div>
                  <Pagination page={page} pages={data.pagination.pages} onPageChange={setPage} />
                </>
              )}
            </>
          )}
        </div>
      </Reveal>
    </>
  );
};

export default Adoption;