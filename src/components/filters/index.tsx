import { useState, useMemo } from "react";
import type { Invoice } from "@/types";
import { Button } from "@/components";

interface FiltersProps {
  data: Invoice[];
}

interface Filters {
  search: string;
  currency: string;
  injectionStatus: string;
}

export function Filters({ data }: FiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    currency: "",
    injectionStatus: "",
  });

  const filtered = useMemo(() => {
    let result = [...data];

    if (filters.search) {
      result = result.filter((invoice) =>
        invoice.receiverName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.currency) {
      result = result.filter((invoice) => invoice.currency === filters.currency);
    }

    if (filters.injectionStatus) {
      const isInjected = filters.injectionStatus === "injected";
      result = result.filter((invoice) => invoice.injected === isInjected);
    }

    return result;
  }, [data, filters]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setFilters((prev) => ({ ...prev, currency: value }));
  };

  const handleInjectionStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, injectionStatus: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      currency: "",
      injectionStatus: "",
    });
  };

  const hasActiveFilters = filters.search || filters.currency || filters.injectionStatus;

  return (
    <div className="mb-4 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
              Nombre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
              Moneda
            </label>
            <select
              id="currency"
              value={filters.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las monedas</option>
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="injectionStatus" className="block text-sm font-medium text-slate-700 mb-1">
              Estado de inyección
            </label>
            <select
              id="injectionStatus"
              value={filters.injectionStatus}
              onChange={(e) => handleInjectionStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="injected">Inyectado</option>
              <option value="not-injected">No inyectado</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>
              Mostrando {filtered.length} de {data.length} facturas
              {hasActiveFilters && " (filtradas)"}
            </span>
          </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
} 