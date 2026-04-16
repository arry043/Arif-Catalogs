import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useFilters } from '../store/useFilters';

const SearchBar: React.FC = () => {
  const { state, dispatch } = useFilters();
  const [inputValue, setInputValue] = useState(state.search);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_SEARCH', payload: value });
    }, 300);
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    dispatch({ type: 'SET_SEARCH', payload: '' });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500/50">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
        <Search className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search for tech, clothing, books..."
        className="w-full bg-transparent border-none text-white py-3 pl-12 pr-12 focus:outline-none placeholder:text-slate-500"
      />

      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
