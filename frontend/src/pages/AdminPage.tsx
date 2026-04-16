import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import type { CategoryCount, Product } from '../types/product';

interface EditFormState {
  name: string;
  price: number | string;
  stock: number | string;
  description: string;
  categoryName: string;
}

const EMPTY_FORM: EditFormState = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  categoryName: '',
};

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(EMPTY_FORM);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.fetchProducts({ limit: 100 }),
          api.fetchCategories(),
        ]);

        setProducts(prodRes.data);
        setCategories(catRes);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description ?? '',
      categoryName: product.category.name,
    });
  };

  const handleSave = async () => {
    if (!isEditing) return;

    try {
      if (isEditing === 'new') {
        alert('Create flow is not wired to this UI yet.');
        setIsEditing(null);
        return;
      } else {
        await api.updateProduct(isEditing, {
            name: editForm.name.trim(),
            price: Number(editForm.price),
            stock: Number(editForm.stock),
            description: editForm.description.trim(),
        });
      }
      setIsEditing(null);
      // Refresh
      const prodRes = await api.fetchProducts({ limit: 100 });
      setProducts(prodRes.data);
    } catch {
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><Plus className="animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-white">Admin Dashboard</h2>
          <button 
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
            onClick={() => {
                setIsEditing('new');
                setEditForm({ ...EMPTY_FORM, categoryName: categories[0]?.category ?? '' });
            }}
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        <div className="glass rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {isEditing === product.id ? (
                      <input 
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white w-full"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <div className="font-bold text-white">{product.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{product.category.name}</td>
                  <td className="px-6 py-4">
                    {isEditing === product.id ? (
                      <input 
                        type="number"
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white w-24"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    ) : (
                      <span className="text-primary-400 font-bold">${product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     {isEditing === product.id ? (
                      <input 
                        type="number"
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white w-20"
                        value={editForm.stock}
                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      />
                    ) : (
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.stock} Units
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {isEditing === product.id ? (
                        <>
                          <button onClick={handleSave} className="p-2 bg-green-500/20 text-green-500 rounded-xl hover:bg-green-500/40">
                             <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setIsEditing(null)} className="p-2 bg-white/10 text-slate-400 rounded-xl hover:bg-white/20">
                             <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(product)} className="p-2 bg-white/10 text-slate-400 rounded-xl hover:bg-white/20">
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/40">
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
