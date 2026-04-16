import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFilters } from '../store/useFilters';
import { api } from '../services/api';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { Loader2, PackageSearch, AlertTriangle } from 'lucide-react';
import type { Product } from '../types/product';

const ProductGrid: React.FC = () => {
  const { state, dispatch } = useFilters();
  const [products, setProducts] = useState<Product[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const isCanceledError = (error: unknown) =>
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'CanceledError';

  const fetchData = useCallback(async (append = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    dispatch({ type: 'SET_UI', payload: { loading: true, error: null } });

    try {
      const response = await api.fetchProducts(
        {
          search: state.search,
          category: state.filters.categories,
          min_price: state.filters.price_range.min,
          max_price: state.filters.price_range.max,
          min_rating: state.filters.min_rating,
          in_stock: state.filters.in_stock,
          tags: state.filters.tags,
          sort_by: state.sort.by,
          sort_order: state.sort.order,
          page: state.pagination.page,
          limit: state.pagination.limit,
        },
        abortControllerRef.current.signal
      );

      setProducts((prev) => (append ? [...prev, ...response.data] : response.data));
      dispatch({
        type: 'SET_UI',
        payload: {
          loading: false,
          total_items: response.pagination.total_items,
          total_pages: response.pagination.total_pages,
        },
      });
    } catch (error: unknown) {
      if (!isCanceledError(error)) {
        dispatch({
          type: 'SET_UI',
          payload: { loading: false, error: 'Failed to fetch products. Please try again.' },
        });
      }
    }
  }, [state.search, state.filters, state.sort, state.pagination, dispatch]);

  useEffect(() => {
    fetchData(state.ui.infinite_scroll && state.pagination.page > 1);
  }, [fetchData, state.ui.infinite_scroll, state.pagination.page]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!state.ui.infinite_scroll || state.pagination.page >= state.ui.total_pages) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !state.ui.loading) {
        dispatch({ type: 'SET_PAGE', payload: state.pagination.page + 1 });
      }
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [state.ui.infinite_scroll, state.ui.total_pages, state.pagination.page, state.ui.loading, dispatch]);

  if (!state.ui.loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl gap-4">
        <PackageSearch className="w-16 h-16 text-slate-700" />
        <h3 className="text-xl font-bold text-white">No products found</h3>
        <p className="text-slate-500 max-w-xs text-center">Try adjusting your filters or search terms to find what you're looking for.</p>
        <button 
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            {state.ui.total_items} <span className="text-slate-500">Results Found</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            {state.filters.categories.map(c => (
              <span key={c} className="text-[10px] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                {c}
                <button onClick={() => dispatch({ type: 'SET_CATEGORIES', payload: state.filters.categories.filter(x => x !== c) })}>
                  <Loader2 className="w-2 h-2 rotate-45" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Sort By:</span>
          <select 
            value={state.sort.by}
            onChange={(e) => dispatch({ type: 'SET_SORT', payload: { ...state.sort, by: e.target.value } })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-500/50"
          >
            <option value="createdAt">Date Created</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => dispatch({ type: 'SET_SORT', payload: { ...state.sort, order: state.sort.order === 'asc' ? 'desc' : 'asc' } })}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"
          >
            <Loader2 className={`w-4 h-4 transition-transform ${state.sort.order === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {state.ui.error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-3xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-semibold">{state.ui.error}</p>
          <button onClick={() => fetchData()} className="ml-auto underline font-bold">Retry</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.ui.loading && products.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-3xl aspect-[3/4] animate-pulse bg-white/5" />
          ))
        ) : (
          products.map((product, idx) => (
            <div key={product.id} ref={idx === products.length - 1 ? lastElementRef : null}>
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      {/* Loading State (Infinite Scroll) */}
      {state.ui.loading && products.length > 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      )}

      {/* Pagination */}
      {!state.ui.infinite_scroll && <Pagination />}
    </div>
  );
};

export default ProductGrid;
