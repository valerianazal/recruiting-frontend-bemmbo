import { useState } from "react";
import { Checkbox } from "../index";
import { compactPagination, formatAmount } from "@/helpers";
import type { Invoice } from "@/types";

interface TableProps {
  data: Invoice[];
  rowsPerPage: number;
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
}

function Table({ data, rowsPerPage, selected, onSelectedChange }: TableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleSelectRow = (id: string, checked: boolean) => {
    onSelectedChange(
      checked ? [...selected, id] : selected.filter((sid) => sid !== id)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const selectableRows = paginatedData.filter((row) => !row.injected);
  const allCurrentPageSelected = selectableRows.length > 0 && 
    selectableRows.every((row) => selected.includes(row.id));

  const handleSelectCurrentPage = (checked: boolean) => {
    const selectableIds = paginatedData
      .filter((row) => !row.injected)
      .map((row) => row.id);
    
    if (checked) {
      const newSelected = [...selected];
      selectableIds.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      onSelectedChange(newSelected);
    } else {
      onSelectedChange(selected.filter((id) => !selectableIds.includes(id)));
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col">
      <table className="text-sm text-left w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-2 py-2 w-24">
              <Checkbox
                checked={allCurrentPageSelected}
                onCheckedChange={handleSelectCurrentPage}
              />
            </th>
            <th className="px-2 py-2 font-semibold w-xl">Emisor</th>
            <th className="px-2 py-2 font-semibold text-right w-sm">Monto</th>
            <th className="px-8 py-2 font-semibold w-3xs">Moneda</th>
            <th className="py-2 font-semibold text-center w-3xs">Inyectado</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0 hover:bg-slate-50">
              <td className="px-2 py-2">
                <Checkbox
                  checked={selected.includes(row.id)}
                  onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                  disabled={row.injected}
                />
              </td>
              <td className="px-2 py-2">{row.receiverName}</td>
              <td className="px-2 py-2 text-right">${formatAmount(row.amount, row.currency)}</td>
              <td className="px-8 py-2">{row.currency}</td>
              <td className="py-2 text-center">
                {row.injected ? (
                  <span className="inline-block mt-1 w-3.5 h-3.5 rounded-full bg-green-500 items-center justify-center">
                  </span>
                ) : (
                  <span className="inline-block mt-1 w-3.5 h-3.5 rounded-full bg-red-500 items-center justify-center">
                  </span>
                )}
              </td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, rowsPerPage - paginatedData.length) }, (_, i) => (
            <tr key={`empty-${i}`}>
              <td className="px-2 py-2">&nbsp;</td>
              <td className="px-2 py-2">&nbsp;</td>
              <td className="px-2 py-2">&nbsp;</td>
              <td className="px-8 py-2">&nbsp;</td>
              <td className="py-2">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div
        className="flex justify-center items-center gap-2 mt-6 flex-shrink-0"
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
    </div>
  );
}

export { Table };