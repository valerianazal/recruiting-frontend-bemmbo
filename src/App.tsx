import { Button, Table, TableSkeleton, InjectionModal } from "@/components";
import { useGetInvoices, useInjectInvoices, useLocalInvoices } from "@/hooks";
import { useState, useEffect, useRef, useCallback } from "react";

const token = import.meta.env.VITE_AUTH_TOKEN;

function App() {
  const { data: apiData, loading, error } = useGetInvoices(token);
  const rowsPerPage = 18;
  
  const {
    invoices,
    setInvoices,
    selectedInvoices,
    setSelectedInvoices,
    injectedInvoices,
    setInjectedInvoices,
    isInjected
  } = useLocalInvoices();
  
  const { 
    data: injectionData, 
    loading: injectionLoading, 
    error: injectionError, 
    injectInvoices,
    retryCount,
    maxRetries 
  } = useInjectInvoices(token);

  const [injectionStatus, setInjectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasLoadedFromAPI, setHasLoadedFromAPI] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedInvoicesRef = useRef<string[]>([]);

  useEffect(() => {
    selectedInvoicesRef.current = selectedInvoices;
  }, [selectedInvoices]);

  useEffect(() => {
    if (apiData && apiData.length > 0 && !hasLoadedFromAPI) {
      setInvoices(apiData);
      setHasLoadedFromAPI(true);
    }
  }, [apiData, hasLoadedFromAPI, setInvoices]);

  const processedData = useCallback(() => {
    return invoices && invoices.length > 0 
      ? invoices.map(invoice => ({
          ...invoice,
          injected: isInjected(invoice.id) || invoice.injected
        }))
      : [];
  }, [invoices, isInjected]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (injectionData) {
      setInjectionStatus('success');
      
      if (selectedInvoicesRef.current.length > 0) {
        const newInjectedInvoices = [...new Set([...injectedInvoices, ...selectedInvoicesRef.current])];
        setInjectedInvoices(newInjectedInvoices);
        setSelectedInvoices([]);
      }
    } else if (injectionError) {
      setInjectionStatus('error');
    }

    if (injectionData || injectionError) {
      timer = setTimeout(() => setInjectionStatus('idle'), 5000);
    }
    
    return () => clearTimeout(timer);
  }, [injectionData, injectionError, injectedInvoices, setInjectedInvoices, setSelectedInvoices]);

  const handleInjectClick = useCallback(() => {
    if (selectedInvoices.length > 0) {
      setIsModalOpen(true);
    }
  }, [selectedInvoices]);

  const handleConfirmInjection = useCallback(() => {
    if (selectedInvoices.length > 0) {
      injectInvoices(selectedInvoices);
      setIsModalOpen(false);
    }
  }, [selectedInvoices, injectInvoices]);

  const showLoading = loading && !hasLoadedFromAPI;
  const currentData = processedData();
  const selectedInvoicesData = currentData.filter(invoice => selectedInvoices.includes(invoice.id));

  return (
    <div className="min-h-screen min-w-screen bg-slate-50 flex flex-col items-center w-6xl">
      <div className="bg-white rounded-lg p-6 px-8 flex flex-col h-screen max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Listado</h2>
          <div className="flex items-center gap-3">
            {injectionStatus === 'success' && (
              <span className="text-green-600 text-sm animate-fade-out">¡Facturas inyectadas exitosamente!</span>
            )}
            {injectionStatus === 'error' && (
              <span className="text-red-600 text-sm animate-fade-out">
                {retryCount > 0 ? `Reintento ${retryCount}/${maxRetries}: ` : ''}
                {injectionError}
              </span>
            )}
            <Button 
              variant="default" 
              onClick={handleInjectClick}
              disabled={selectedInvoices.length === 0 || injectionLoading}
            >
              {injectionLoading ? 'Inyectando...' : 'Inyectar'}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-row justify-center w-full flex-1 overflow-hidden">
          {showLoading && <TableSkeleton rowsPerPage={rowsPerPage} />}
          {error && <div>Error: {error}</div>}
          {invoices && invoices.length > 0 && !showLoading && (
            <Table 
              data={currentData}
              rowsPerPage={rowsPerPage}
              selected={selectedInvoices}
              onSelectedChange={setSelectedInvoices}
            />
          )}
        </div>

        <InjectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmInjection}
          invoices={selectedInvoicesData}
        />
      </div>
    </div>
  );
}

export default App;
