import { useEffect, useState } from 'react';
import { userApi } from '../../api';
import { VetCard } from '../../components/VetCard';
import { Pagination } from '../../components/Pagination';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { getErrorMessage } from '../../utils/helpers';
import Reveal from '../../components/Reveal';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const Veterinarians = () => {
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [applied, setApplied] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const load = async (filters, pg) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userApi.publicVets({ page: pg, limit: 9, ...filters });
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
    setApplied({ search: search || undefined, specialization: specialization || undefined, city: city || undefined });
  };

  const reset = () => {
    setSearch('');
    setSpecialization('');
    setCity('');
    setPage(1);
    setApplied({});
  };

  return (
    <>
      <section className="hero" style={{ padding: '48px 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: 8 }}>Find a <span style={{ color: 'var(--primary)' }}>Veterinarian</span></h1>
          <p className="section-subtitle">Search by name, specialization or location</p>
          <form className="search-bar" onSubmit={applyFilters}>
            <input
              className="form-control"
              placeholder="Search vets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SelectDropdown
              value={specialization}
              onChange={setSpecialization}
              placeholder="Any specialization"
              ariaLabel="Filter by specialization"
              options={['Small Animal Medicine', 'Dermatology', 'Surgery', 'Cardiology', 'Dentistry', 'Oncology', 'Nutrition', 'General Practice'].map((s) => ({ value: s, label: s }))}
            />
            <input
              className="form-control"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn btn-primary">Search</button>
            {(search || specialization || city) && (
              <button type="button" className="btn btn-ghost" onClick={reset}>Reset</button>
            )}
          </form>
        </div>
      </section>

      <Reveal as="section" className="page-section" style={{ paddingTop: 24 }}>
        <div className="container">
          {loading ? <Loading text="Finding vets..." /> : error ? <ErrorState error={error} onRetry={() => load(applied, page)} /> : data && (
            <>
              {data.data.length === 0 ? (
                <EmptyState title="No veterinarians found" message="Try adjusting your search filters." icon="stethoscope" />
              ) : (
                <>
                  <p className="text-muted mb-2">{data.pagination.total} veterinarian(s) found</p>
                  <div className="grid grid-3">
                    {data.data.map((vet) => <VetCard key={vet._id} vet={vet} />)}
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

export default Veterinarians;