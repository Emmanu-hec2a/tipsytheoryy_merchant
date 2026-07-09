import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, Tag } from 'lucide-react';
import { partner } from '../api';

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) setFormData(category);
    else setFormData({ name: '', description: '', icon: '' });
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) await partner.updateCategory(category.id, formData);
      else await partner.createCategory(formData);
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-2xl font-bold text-slate-900">{category ? 'Edit Category' : 'Add Category'}</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category Name</label>
              <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea rows="3" className="input-field resize-none py-4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
           </div>
           <button disabled={loading} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              {loading ? 'Saving...' : <><Save size={20} /> Save Category</>}
           </button>
        </form>
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingProduct] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await partner.getCategories();
      setCategories(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
        <button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="h-32 bg-white animate-pulse rounded-3xl" />) :
          categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center"><Tag size={24} /></div>
                <div>
                  <h4 className="font-bold text-slate-900">{cat.name}</h4>
                  <p className="text-xs text-slate-400">{cat.description?.substring(0, 40)}...</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => { setEditingProduct(cat); setModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary"><Edit2 size={16} /></button>
              </div>
            </div>
          ))
        }
      </div>
      <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} category={editingCategory} onSave={fetchCategories} />
    </div>
  );
};

export default Categories;
