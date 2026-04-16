import React, { useState, useEffect } from 'react';
import { useFilters } from '../store/useFilters';
import { api } from '../services/api';
import { SlidersHorizontal, Star, Trash2 } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const { state, dispatch } = useFilters();
  const [categories, setCategories] = useState<{ category: string, count: number }[]>([]);

  useEffect(() => {
    api.fetchCategories().then(setCategories);
  }, []);

  const handleCategoryToggle = (category: string) => {
    const newCategories = state.filters.categories.includes(category)
      ? state.filters.categories.filter((c) => c !== category)
      : [...state.filters.categories, category];
    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
  };

  const handlePriceChange = (minOrMax: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    dispatch({
      type: 'SET_PRICE_RANGE',
      payload: { ...state.filters.price_range, [minOrMax]: numValue },
    });
  };

  const handleRatingSelect = (rating: number) => {
    dispatch({ 
      type: 'SET_MIN_RATING', 
      payload: state.filters.min_rating === rating ? null : rating 
    });
  };

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        <button
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        {/* Categories */}
        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <label key={c.category} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                    state.filters.categories.includes(c.category)
                      ? 'bg-primary-500 border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}>
                    {state.filters.categories.includes(c.category) && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm ${state.filters.categories.includes(c.category) ? 'text-white' : 'text-slate-400'}`}>
                    {c.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-white/5 py-1 px-2 rounded-full text-slate-500 group-hover:bg-white/10 group-hover:text-slate-400 transition-colors">
                  {c.count}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={state.filters.categories.includes(c.category)}
                  onChange={() => handleCategoryToggle(c.category)}
                />
              </label>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Price Range</h3>
          <div className="flex items-center gap-3">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                placeholder="Min"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-sm focus:outline-none focus:border-primary-500/50"
                value={state.filters.price_range.min ?? ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
            </div>
            <div className="w-2 h-px bg-white/10" />
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-sm focus:outline-none focus:border-primary-500/50"
                value={state.filters.price_range.max ?? ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Minimum Rating */}
        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Min Rating</h3>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingSelect(rating)}
                className={`flex-grow h-10 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  state.filters.min_rating === rating
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{rating}</span>
                <Star className={`w-3 h-3 ${state.filters.min_rating === rating ? 'fill-white' : 'fill-none'}`} />
              </button>
            ))}
          </div>
        </section>

        {/* In Stock Toggle */}
        <section>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">In Stock Only</span>
            <div
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                state.filters.in_stock ? 'bg-primary-500 shadow-inner' : 'bg-white/10 shadow-none'
              }`}
              onClick={() => dispatch({ type: 'TOGGLE_IN_STOCK' })}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                  state.filters.in_stock ? 'left-7' : 'left-1'
                } shadow-md`}
              />
            </div>
          </label>
        </section>
      </div>

      {/* Infinite Scroll Toggle (Bonus) */}
      <div className="pt-6 border-t border-white/5">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Infinite Scroll</span>
            <span className="text-[10px] text-slate-500">Toggle pagination mode</span>
          </div>
          <div
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
              state.ui.infinite_scroll ? 'bg-indigo-500 shadow-inner' : 'bg-white/10'
            }`}
            onClick={() => dispatch({ type: 'TOGGLE_INFINITE_SCROLL' })}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                state.ui.infinite_scroll ? 'left-7' : 'left-1'
              } shadow-md`}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
