import { useState, useEffect } from 'react';
import type { Invoice } from '@/types';

interface UseLocalInvoicesReturn {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  selectedInvoices: string[];
  setSelectedInvoices: (selected: string[]) => void;
  injectedInvoices: string[];
  setInjectedInvoices: (injected: string[]) => void;
  isInjected: (invoiceId: string) => boolean;
}

/**
 * Hook to manage local invoice state with persistence and injection status
 * @returns Object with invoices data, selected invoices, and injection status
 */
export function useLocalInvoices(): UseLocalInvoicesReturn {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [injectedInvoices, setInjectedInvoices] = useState<string[]>([]);

  useEffect(() => {
    const loadFromStorage = () => {
      const savedInvoices = localStorage.getItem('invoices');
      const savedSelected = localStorage.getItem('selectedInvoices');
      const savedInjected = localStorage.getItem('injectedInvoices');

      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      }
      if (savedSelected) {
        setSelectedInvoices(JSON.parse(savedSelected));
      }
      if (savedInjected) {
        setInjectedInvoices(JSON.parse(savedInjected));
      }
    };

    loadFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'injectedInvoices' || e.key === 'selectedInvoices' || e.key === 'invoices') {
        loadFromStorage();
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'injectedInvoices') {
        setInjectedInvoices(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const storageData = {
      invoices,
      selectedInvoices,
      injectedInvoices
    };
    
    Object.entries(storageData).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, [invoices, selectedInvoices, injectedInvoices]);

  const isInjected = (invoiceId: string): boolean => {
    return injectedInvoices.includes(invoiceId);
  };

  return {
    invoices,
    setInvoices,
    selectedInvoices,
    setSelectedInvoices,
    injectedInvoices,
    setInjectedInvoices,
    isInjected,
  };
} 