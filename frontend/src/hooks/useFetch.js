import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetcher, deps = [], initial = null) => {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher({ page });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, ...deps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, page, setPage };
};

export default useFetch;