import { useState, useCallback, useRef } from 'react';
import { injectInvoices } from '@/integrations';

interface UseInjectInvoicesReturn {
  data: boolean;
  loading: boolean;
  error: string | null;
  injectInvoices: (invoiceIds: string[]) => Promise<void>;
  retryCount: number;
  maxRetries: number;
}

/**
 * Hook to inject invoices to the API with automatic retry logic
 * @param token - Authentication token
 * @returns Object with injection data, loading state, error state, and inject function
 */
export function useInjectInvoices(token: string): UseInjectInvoicesReturn {
  const [data, setData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const currentInvoiceIds = useRef<string[]>([]);

  const maxRetries = 3;
  const retryDelay = 2000;

  const attemptInject = useCallback(async (invoiceIds: string[], attempt: number): Promise<boolean> => {
    try {
      const result = await injectInvoices(invoiceIds, token);
      if (result) {
        return true;
      }
      throw new Error('Error al inyectar las facturas');
    } catch (err) {
      if (attempt < maxRetries - 1) {
        setRetryCount(attempt + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return attemptInject(invoiceIds, attempt + 1);
      }
      throw err;
    }
  }, [token]);

  const injectInvoicesHandler = useCallback(async (invoiceIds: string[]) => {
    if (!token) {
      setError('Token is required');
      return;
    }

    if (invoiceIds.length === 0) {
      setError('No hay facturas seleccionadas');
      return;
    }

    setLoading(true);
    setError(null);
    setRetryCount(0);
    currentInvoiceIds.current = invoiceIds;

    try {
      const success = await attemptInject(invoiceIds, 0);
      if (success) {
        setData(true);
        setRetryCount(0);
        setTimeout(() => {
          setData(false);
        }, 100);
      }
    } catch (err) {
      setError(`Error después de ${maxRetries} intentos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setData(false);
      setRetryCount(0);
    } finally {
      setLoading(false);
      currentInvoiceIds.current = [];
    }
  }, [token, attemptInject]);

  return {
    data,
    loading,
    error,
    injectInvoices: injectInvoicesHandler,
    retryCount,
    maxRetries: maxRetries
  };
}
