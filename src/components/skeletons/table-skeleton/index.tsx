interface TableSkeletonProps {
  rowsPerPage: number;
}

export function TableSkeleton({ rowsPerPage }: TableSkeletonProps) {
  return (
    <div className="w-full max-w-5xl flex flex-col">
      <table className="text-sm text-left w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-2 py-2 w-24">
              <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            </th>
            <th className="px-2 py-2 font-semibold w-xl">Emisor</th>
            <th className="px-2 py-2 font-semibold text-right w-sm">Monto</th>
            <th className="px-8 py-2 font-semibold w-3xs">Moneda</th>
            <th className="py-2 font-semibold text-center w-3xs">Inyectado</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowsPerPage }, (_, i) => (
            <tr key={`skeleton-${i}`} className="border-b last:border-b-0">
              <td className="px-2 py-2">
                <div className="w-4 h-5 bg-slate-200 rounded animate-pulse"></div>
              </td>
              <td className="px-2 py-2">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-32"></div>
              </td>
              <td className="px-2 py-2 text-right">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-20 ml-auto"></div>
              </td>
              <td className="px-8 py-2">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-12"></div>
              </td>
              <td className="py-2 text-center">
                <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse mx-auto mt-1"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 