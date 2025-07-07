export function FiltersSkeleton() {
  return (
    <div className="mb-4 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-16 mb-1"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse w-full"></div>
          </div>

          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-16 mb-1"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse w-full"></div>
          </div>

          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-24 mb-1"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse w-full"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-48"></div>
        </div>
      </div>
    </div>
  );
} 