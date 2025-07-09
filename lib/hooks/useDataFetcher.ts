import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';

interface UseDataFetcherOptions<T> {
  fetchFn: (userId: string) => Promise<T>;
  dependencies?: any[];
  initialData?: T;
}

interface UseDataFetcherReturn<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDataFetcher<T>({
  fetchFn,
  dependencies = [],
  initialData
}: UseDataFetcherOptions<T>): UseDataFetcherReturn<T> {
  const [data, setData] = useState<T>(initialData as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn(user.uid);
      setData(result);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}