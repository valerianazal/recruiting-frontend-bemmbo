import { useState, useEffect, useCallback } from 'react';
import { getInvoices } from '@/integrations/get-invoices';
import type { Invoice } from '@/types';

interface UseGetInvoicesReturn {
  data: Invoice[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch invoices from the API
 * @param token - Authentication token
 * @returns Object with invoices data, loading state, error state, and refetch function
 */
export function useGetInvoices(token: string): UseGetInvoicesReturn {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  const fetchInvoices = useCallback(async () => {
    if (!token) {
      setError('Token is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getInvoices(token);
      
      if ('status' in result) {
        setError(result.message);
        setData([]);
      } else {
        setData(result);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      fetchInvoices();
    }
  }, [hasInitialized, fetchInvoices]);

  return {
    data,
    loading,
    error,
    refetch: fetchInvoices,
  };
}
