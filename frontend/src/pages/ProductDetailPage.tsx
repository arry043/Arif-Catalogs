import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import type { Product } from '../types/product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
       api.fetchProductById(id).then(setProduct).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate(-1)} className="text-primary-500 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary-500/30">
        <header className="glass sticky top-0 z-50 border-b border-white/10 px-4 py-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-bold">Back to Listing</span>
                </button>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left: Product Image */}
                <div className="glass rounded-[40px] aspect-square flex items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10" />
                     <span className="text-9xl font-black text-white/5 group-hover:scale-110 transition-transform duration-700">{product.category.name[0]}</span>
                     
                     <div className="absolute top-8 left-8">
                        <span className="bg-primary-500/80 backdrop-blur-md text-white text-xs font-black uppercase px-4 py-2 rounded-xl shadow-xl shadow-primary-500/20">
                            {product.category.name}
                        </span>
                     </div>
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                <span className="text-sm font-black text-yellow-500">{product.rating.toFixed(1)}</span>
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            </div>
                            <span className="text-slate-500 text-sm font-medium">• 120+ Reviews</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight leading-tight">{product.name}</h1>
                        <p className="text-slate-400 text-lg leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag: string) => (
                            <span key={tag} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl text-sm font-bold text-slate-400">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="py-8 border-y border-white/10 flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Price</span>
                            <span className="text-5xl font-black text-white">${product.price.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Free Shipping Over $100</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass p-4 rounded-2xl flex flex-col gap-2">
                            <Truck className="w-5 h-5 text-primary-500" />
                            <span className="text-xs font-bold">Fast Delivery</span>
                            <span className="text-[10px] text-slate-500">2-3 Business Days</span>
                        </div>
                        <div className="glass p-4 rounded-2xl flex flex-col gap-2">
                            <RotateCcw className="w-5 h-5 text-indigo-500" />
                            <span className="text-xs font-bold">Free Returns</span>
                            <span className="text-[10px] text-slate-500">Within 30 Days</span>
                        </div>
                        <div className="glass p-4 rounded-2xl flex flex-col gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-bold">Secure Payment</span>
                            <span className="text-[10px] text-slate-500">100% Encrypted</span>
                        </div>
                    </div>

                    <button 
                        disabled={product.stock === 0}
                        className="w-full h-16 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl flex items-center justify-center gap-4 text-white font-black text-xl shadow-2xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                    >
                        <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
};

export default ProductDetailPage;
