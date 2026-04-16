import { memo } from 'react';
import { Star, ShoppingCart, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const ProductCard = memo(({ product, onDelete, onEdit }: ProductCardProps) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`group glass rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 ${
      !product.isActive ? 'opacity-50 grayscale' : ''
    }`}>
      <Link to={`/products/${product.id}`}>
        {/* Image Placeholder */}
        <div className="relative aspect-square overflow-hidden bg-white/5 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-4xl font-black text-white/10 group-hover:scale-110 transition-transform duration-500">{product.category.name[0]}</div>
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isOutOfStock && (
              <span className="bg-red-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg">Out of Stock</span>
            )}
            {!product.isActive && (
              <span className="bg-slate-700/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg">Inactive</span>
            )}
            <span className="bg-primary-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg">{product.category.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
              <span className="text-[10px] font-black text-yellow-500">{product.rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
            {product.description ?? 'No description available.'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 h-5 overflow-hidden">
            {product.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-bold text-slate-400 border border-white/5 bg-white/5 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Price</span>
            <span className="text-xl font-black text-white">${product.price.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(product.id)}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            )}
            <button 
                disabled={isOutOfStock}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                isOutOfStock 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                    : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:scale-110 active:scale-95'
                }`}
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
