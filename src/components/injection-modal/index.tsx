import { useState } from "react";
import type { Invoice } from "@/types";
import { Button } from "@/components";
import { compactPagination } from "@/helpers";

interface InjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoices: Invoice[];
}

export function InjectionModal({ isOpen, onClose, onConfirm, invoices }: InjectionModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Inyección de facturas</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-slate-600 mb-4">
          Revisa las facturas que se van a inyectar y confirma la operación.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Emisor</th>
                <th className="text-right py-2 px-4">Monto</th>
                <th className="text-center py-2 px-4">Moneda</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((invoice, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{invoice.receiverName}</td>
                  <td className="text-right py-2 px-4">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(invoice.amount)}
                  </td>
                  <td className="text-center py-2 px-4">{invoice.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div 
          className="flex justify-center items-center gap-2 mb-6"
          style={{ minWidth: "420px" }}
        >
          <button 
            className={`px-2 py-1 rounded ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'hover:bg-slate-200 cursor-pointer'
            }`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {'<'}
          </button>

          {compactPagination(currentPage, totalPages).map((page, idx) =>
            typeof page === 'number' ? (
              <button 
                key={page}
                className={`px-2 py-1 rounded cursor-pointer ${
                  currentPage === page 
                    ? 'bg-slate-200 font-bold' 
                    : 'hover:bg-slate-200'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 select-none">...</span>
            )
          )}

          <button 
            className={`px-2 py-1 rounded ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'hover:bg-slate-200 cursor-pointer'
            }`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {'>'}
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
} 