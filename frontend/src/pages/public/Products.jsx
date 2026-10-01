import { useEffect, useState } from 'react';
import { productApi } from '../../api';
import { ProductCard } from '../../components/ProductCard';
import { Pagination } from '../../components/Pagination';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import { SelectDropdown } from '../../components/ui/SelectDropdown';

export const Products = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState('');
  const [applied, setApplied] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    productApi.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const load = async (filters, pg) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productApi.getAll({ page: pg, limit: 12, ...filters });
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

  const applyFilters = () => {
    setPage(1);
    setApplied({
      search: search || undefined,
      category: category || undefined,
      sort: sort || undefined,
      maxPrice: maxPrice ? maxPrice * 100 / 100 : undefined,
    });
  };

  const reset = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    setMaxPrice('');
    setPage(1);
    setApplied({});
  };

  return (
    <>
      <section className="hero" style={{ padding: '48px 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: 8 }}>Pet <span style={{ color: 'var(--primary)' }}>Marketplace</span></h1>
          <p className="section-subtitle">Everything your pet needs — food, toys, grooming and health supplies</p>
          <div className="filter-bar">
            <input
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 260 }}
            />
            <SelectDropdown
              value={category}
              onChange={setCategory}
              placeholder="All categories"
              ariaLabel="Filter by category"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
            />
            <SelectDropdown
              value={sort}
              onChange={setSort}
              ariaLabel="Sort products"
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'price_asc', label: 'Price: low → high' },
                { value: 'price_desc', label: 'Price: high → low' },
                { value: 'rating', label: 'Top rated' },
              ]}
            />
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: 140 }}
            />
            <button className="btn btn-primary" onClick={applyFilters}>Apply</button>
            {(search || category || sort !== 'newest' || maxPrice) && (
              <button className="btn btn-ghost" onClick={reset}>Reset</button>
            )}
          </div>
        </div>
      </section>

      <Reveal as="section" className="page-section" style={{ paddingTop: 24 }}>
        <div className="container">
          {loading ? <Loading text="Loading products..." /> : error ? <ErrorState error={error} onRetry={() => load(applied, page)} /> : data && (
            <>
              {data.data.length === 0 ? (
                <EmptyState title="No products found" message="Try adjusting your filters." icon="bag" />
              ) : (
                <>
                  <p className="text-muted mb-2">{data.pagination.total} product(s)</p>
                  <div className="grid grid-4">
                    {data.data.map((p, i) => (
                      <Reveal key={p._id} delay={(i % 4) * 80} style={{ height: '100%' }}>
                        <ProductCard product={p} />
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

export default Products;