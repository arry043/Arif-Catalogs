import React, { useEffect, useState } from 'react';
import { useFilters } from '../store/useFilters';
import { api } from '../services/api';
import { Box, DollarSign, Star, AlertCircle } from 'lucide-react';

interface Stats {
  total_products: number;
  avg_price: number;
  avg_rating: number;
  price_range: { min: number; max: number };
  out_of_stock_count: number;
}

const StatsPanel: React.FC = () => {
  const { state } = useFilters();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.fetchStats({
          search: state.search,
          category: state.filters.categories,
          min_price: state.filters.price_range.min,
          max_price: state.filters.price_range.max,
          min_rating: state.filters.min_rating,
          in_stock: state.filters.in_stock,
          tags: state.filters.tags,
        });
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, [state.search, state.filters]);

  if (!stats) return null;

  const statItems = [
    { label: 'Total Products', value: stats.total_products, icon: Box, color: 'text-primary-500' },
    { label: 'Avg Price', value: `$${stats.avg_price}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Avg Rating', value: `${stats.avg_rating} / 5.0`, icon: Star, color: 'text-yellow-500' },
    { label: 'Out of Stock', value: stats.out_of_stock_count, icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, idx) => (
        <div key={idx} className="glass rounded-2xl p-4 flex items-center gap-4 transition-transform hover:scale-105">
          <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{item.label}</p>
            <p className="text-lg font-black text-white">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
