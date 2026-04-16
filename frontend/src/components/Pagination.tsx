import React from 'react';
import { useFilters } from '../store/useFilters';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination: React.FC = () => {
  const { state, dispatch } = useFilters();
  const { page, limit } = state.pagination;
  const { total_pages, total_items } = state.ui;

  const setPage = (p: number) => {
    dispatch({ type: 'SET_PAGE', payload: Math.max(1, Math.min(p, total_pages)) });
  };

  if (total_pages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 pb-20 border-t border-white/5">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-slate-500 uppercase">Items per page:</span>
        <select
          value={limit}
          onChange={(e) => dispatch({ type: 'SET_LIMIT', payload: parseInt(e.target.value) })}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500/50"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span className="text-xs text-slate-500">Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total_items)} of {total_items}</span>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setPage(1)} 
          disabled={page === 1}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dynamic Page Numbers */}
        <div className="flex items-center gap-2 px-4">
          {Array.from({ length: Math.min(5, total_pages) }, (_, i) => {
            let p = page;
            if (total_pages <= 5) p = i + 1;
            else if (page <= 3) p = i + 1;
            else if (page >= total_pages - 2) p = total_pages - 4 + i;
            else p = page - 2 + i;

            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === p 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page === total_pages}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setPage(total_pages)} 
          disabled={page === total_pages}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
         <span className="text-xs font-bold text-slate-500 uppercase">Go To:</span>
         <input 
            type="number"
            min={1}
            max={total_pages}
            className="w-14 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-center focus:outline-none focus:border-primary-500/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const p = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(p)) setPage(p);
              }
            }}
         />
      </div>
    </div>
  );
};

export default Pagination;
