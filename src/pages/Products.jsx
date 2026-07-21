import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Download, Edit2, Trash2,
  ChevronLeft, ChevronRight, Wine, X,
  Upload, CheckCircle2, AlertCircle, Save, ImageIcon,
  LayoutGrid, Crown, Wallet
} from 'lucide-react';
import { partner } from '../api';
import SoftGate from '../components/SoftGate';

const StatusToggle = ({ active, onToggle, loading }) => (
  <button
    disabled={loading}
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-300 transition-transform ${active ? 'translate-x-4.5' : 'translate-x-1'}`} />
  </button>
);

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(category ? category.name : '');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (category) {
        await partner.updateCategory(category.id, { name });
      } else {
        await partner.createCategory({ name });
      }
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category ? 'Edit Category' : 'Add Category'}</h3>
           <button onClick={onClose} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Category Name</label>
              <input
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                placeholder="e.g. Whisky, Wine, Beers"
                value={name}
                onChange={e => setName(e.target.value)}
              />
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} type="button" className="flex-1 py-2.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                {loading ? 'Saving...' : (category ? 'Update' : 'Save')}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, product, onSave, isPro }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_name: '',
    price: '',
    original_price: '',
    stock: '',
    low_stock_threshold: '5',
    sku: '',
    description: '',
    is_active: true,
    is_available: true,
    is_new_arrival: false
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
        fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
        const { data } = await partner.getCategories();
        setCategories(data || []);
        if (data.length > 0 && !formData.category_name && !product) {
            setFormData(prev => ({ ...prev, category_name: data[0].name }));
        }
    } catch (err) {
        console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_name: product.category_name || '',
        price: product.price || '',
        original_price: product.original_price || '',
        stock: product.stock || '',
        low_stock_threshold: product.low_stock_threshold || '5',
        sku: product.sku || '',
        description: product.description || '',
        is_active: product.is_active ?? true,
        is_available: product.is_available ?? true,
        is_new_arrival: product.is_new_arrival ?? false
      });
      setImagePreview(product.image);
    } else {
      setFormData({
        name: '',
        category_name: categories.length > 0 ? categories[0].name : '',
        price: '',
        original_price: '',
        stock: '',
        low_stock_threshold: '5',
        sku: '',
        description: '',
        is_active: true,
        is_available: true,
        is_new_arrival: false
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    const fieldsToSend = [
        'name', 'category_name', 'price', 'original_price',
        'stock', 'low_stock_threshold', 'sku', 'description', 'is_active',
        'is_available', 'is_new_arrival'
    ];

    fieldsToSend.forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
            data.append(key, formData[key]);
        }
    });

    if (imageFile) {
        data.append('image', imageFile);
    }

    try {
      if (product) {
        await partner.updateProduct(product.id, data);
      } else {
        await partner.createProduct(data);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to save product', err.response?.data || err.message);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">{product ? 'Edit Product' : 'Add Product'}</h3>
           <button onClick={onClose} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-5 no-scrollbar">
           {/* Image Upload */}
           <div className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

                {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={20} className="text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm dark:shadow-none text-slate-400 group-hover:text-primary transition-colors">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Image</p>
                    </div>
                )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Product Name</label>
                 <input
                  required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="e.g. Johnnie Walker Black Label"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                 <select
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none capitalize"
                  value={formData.category_name} onChange={e => setFormData({...formData, category_name: e.target.value})}
                 >
                    {categories.length === 0 ? (
                        <option value="">No categories found</option>
                    ) : (
                        categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))
                    )}
                 </select>
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">SKU</label>
                 <input
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Unique SKU"
                  value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Selling Price (KES)</label>
                 <input
                  required type="number" step="0.01"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-extrabold text-primary focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="0.00"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Original Price (KES)</label>
                 <input
                  type="number" step="0.01"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-400 dark:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="0.00"
                  value={formData.original_price} onChange={e => setFormData({...formData, original_price: e.target.value})}
                 />
              </div>

              <div className="col-span-2">
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Product Description</label>
                 <textarea
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none min-h-[80px]"
                  placeholder="Describe the tasting notes, origin, or flavor profile..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Stock Quantity</label>
                 <input
                  required type="number"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="0"
                  value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                 />
              </div>
           </div>

           <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                 <StatusToggle active={formData.is_active} onToggle={() => setFormData({...formData, is_active: !formData.is_active})} />
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Visible</p>
              </div>
              <div className="flex items-center gap-3">
                 <StatusToggle active={formData.is_available} onToggle={() => setFormData({...formData, is_available: !formData.is_available})} />
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-300">In Stock</p>
              </div>

              {/* New Arrival Toggle with SoftGate */}
              <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isPro ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                       <Crown size={14} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-1">Mark as New Arrival</p>
                       <p className="text-[8px] text-slate-500 font-medium">Broadcast to your customers</p>
                    </div>
                 </div>
                 {isPro ? (
                    <StatusToggle
                      active={formData.is_new_arrival}
                      onToggle={() => setFormData({...formData, is_new_arrival: !formData.is_new_arrival})}
                    />
                 ) : (
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">PRO</span>
                       <StatusToggle active={false} onToggle={() => {}} loading={true} />
                    </div>
                 )}
              </div>
           </div>
        </form>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
           <button onClick={onClose} type="button" className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">Cancel</button>
           <button
            onClick={handleSubmit} disabled={loading}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
           >
              {loading ? 'Saving...' : (product ? 'Update' : 'Add Product')}
           </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStorePlan();
  }, []);

  const fetchStorePlan = async () => {
    try {
      const { data } = await partner.getSettings();
      setIsPro(['pro', 'enterprise', 'custom'].includes(data.plan));
    } catch (err) {
      console.error('Failed to fetch plan');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        partner.getProducts(),
        partner.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await partner.updateProduct(product.id, { is_active: !product.is_active });
      fetchData();
    } catch (err) {
      console.error('Failed to toggle status');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await partner.updateCategory(id, { delete: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete category');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text" placeholder="Search products, SKU..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setEditingCategory(null); setCategoryModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <LayoutGrid size={14} /> New Category
          </button>
          <button
            onClick={() => { setEditingProduct(null); setProductModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={14} /> New Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-5">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">Liquor Categories</h3>
           <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{categories.length} Categories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
           {loading && categories.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-100 dark:border-slate-800" />
              ))
           ) : categories.length === 0 ? (
              <div className="col-span-full py-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs font-medium">No categories yet.</div>
           ) : (
             categories.map(cat => (
               <div key={cat.id} className="group p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary/20 hover:shadow-md transition-all relative overflow-hidden">
                  <h4 className="text-[11px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">{cat.name}</h4>
                  <div className="flex items-center gap-1">
                     <button onClick={() => { setEditingCategory(cat); setCategoryModalOpen(true); }} className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-[8px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Edit</button>
                     <button onClick={() => handleDeleteCategory(cat.id)} className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-[8px] font-bold text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">Delete</button>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-sm font-bold text-slate-900 dark:text-white">Product List</h3>
           <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
              <Download size={12} /> Export
           </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading && products.length === 0 ? (
                 [...Array(6)].map((_, i) => (
                    <tr key={i}><td colSpan="6" className="px-5 py-4"><div className="h-3.5 w-full bg-slate-50 dark:bg-slate-800 animate-pulse rounded" /></td></tr>
                 ))
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 overflow-hidden border border-slate-100 dark:border-slate-800">
                           {product.image ? <img src={product.image} className="w-full h-full object-cover" alt={product.name} /> : <Wine size={16} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{product.name}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">SKU: {product.sku || '---'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{product.category_name || product.category}</span></td>
                    <td className="px-5 py-3.5 text-xs font-extrabold text-primary">KES {parseFloat(product.price).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-extrabold ${product.stock <= product.low_stock_threshold ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{product.stock}</span>
                        {product.stock <= product.low_stock_threshold && <AlertCircle size={12} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                       <div className="flex items-center gap-2">
                          <StatusToggle active={product.is_active} onToggle={() => handleToggleStatus(product)} />
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${product.is_active ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-600'}`}>{product.is_active ? 'Live' : 'Hidden'}</span>
                       </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                       <button onClick={() => { setEditingProduct(product); setProductModalOpen(true); }} className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-primary-light dark:hover:bg-primary/20 rounded-xl transition-all ml-auto"><Edit2 size={14} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal isOpen={productModalOpen} onClose={() => setProductModalOpen(false)} product={editingProduct} onSave={fetchData} isPro={isPro} />
      <CategoryModal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} category={editingCategory} onSave={fetchData} />
    </div>
  );
};

export default Products;
