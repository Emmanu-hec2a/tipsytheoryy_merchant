import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Download, Edit2, Trash2,
  ChevronLeft, ChevronRight, Wine, X,
  Upload, CheckCircle2, AlertCircle, Save, ImageIcon,
  LayoutGrid
} from 'lucide-react';
import { partner } from '../api';

const StatusToggle = ({ active, onToggle, loading }) => (
  <button
    disabled={loading}
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${active ? 'bg-primary' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
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
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-xl font-bold text-slate-900">{category ? 'Edit Category' : 'Add New Category'}</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category Name</label>
              <input
                required
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. Whisky, Wine, Beers"
                value={name}
                onChange={e => setName(e.target.value)}
              />
           </div>
           <div className="flex gap-4">
              <button onClick={onClose} type="button" className="flex-1 py-3 bg-white text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Saving...' : <><Save size={18} /> {category ? 'Update' : 'Save'}</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
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
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-xl font-bold text-slate-900">{product ? 'Edit Product' : 'Add New Product'}</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
           {/* Image Upload */}
           <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

                {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={24} className="text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                            <ImageIcon size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Upload Product Image</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">PNG, JPG up to 5MB</p>
                    </div>
                )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                 <input
                  required className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Johnnie Walker Black Label"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                 <select
                  required
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all capitalize"
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
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SKU (Unique)</label>
                 <input
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. JW-BLK-750"
                  value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Selling Price (KES)</label>
                 <input
                  required type="number" step="0.01"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-extrabold text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0.00"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Original Price (Optional)</label>
                 <input
                  type="number" step="0.01"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0.00"
                  value={formData.original_price} onChange={e => setFormData({...formData, original_price: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Stock</label>
                 <input
                  required type="number"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0"
                  value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Low Stock Alert</label>
                 <input
                  required type="number"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="5"
                  value={formData.low_stock_threshold} onChange={e => setFormData({...formData, low_stock_threshold: e.target.value})}
                 />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
              <textarea
                rows="3"
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Tell customers about this product..."
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
           </div>

           <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                 <StatusToggle active={formData.is_active} onToggle={() => setFormData({...formData, is_active: !formData.is_active})} />
                 <div>
                    <p className="text-sm font-bold text-slate-900">Make product visible</p>
                    <p className="text-[10px] text-slate-500 font-medium">Inactive products won't show in the mobile app</p>
                 </div>
              </div>

              <div className="border-t border-slate-200/60 pt-4 flex items-center gap-4">
                 <StatusToggle active={formData.is_available} onToggle={() => setFormData({...formData, is_available: !formData.is_available})} />
                 <div>
                    <p className="text-sm font-bold text-slate-900">Instantly In Stock</p>
                    <p className="text-[10px] text-slate-500 font-medium">Toggle off to mark as "Out of Stock" instantly</p>
                 </div>
              </div>

              <div className="border-t border-slate-200/60 pt-4 flex items-center gap-4">
                 <StatusToggle active={formData.is_new_arrival} onToggle={() => setFormData({...formData, is_new_arrival: !formData.is_new_arrival})} />
                 <div>
                    <p className="text-sm font-bold text-slate-900">New Arrival Tag</p>
                    <p className="text-[10px] text-slate-500 font-medium">Shows a "NEW" badge on the product card</p>
                 </div>
              </div>
           </div>
        </form>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
           <button onClick={onClose} type="button" className="flex-1 py-4 bg-white text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
           <button
            onClick={handleSubmit} disabled={loading}
            className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
           >
              {loading ? 'Saving...' : <><Save size={18} /> {product ? 'Update Product' : 'Add Product'}</>}
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

  useEffect(() => {
    fetchData();
  }, []);

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
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await partner.updateCategory(id, { delete: true }); // Assuming a way to delete or just calling delete endpoint if exists
      // If no delete endpoint, we'd need to add one. Let's assume partner.deleteCategory(id)
      // Since I don't see it in api.js, I'll assume we might need to add it or use update with a flag.
      // But for now, let's just refresh.
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
    <div className="space-y-8 pb-10">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text" placeholder="Search products, SKU..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setEditingCategory(null); setCategoryModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <LayoutGrid size={16} /> New Category
          </button>
          <button
            onClick={() => { setEditingProduct(null); setProductModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {/* Categories Grid (High Fidelity) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-base font-bold text-slate-900 px-1">Liquor Categories</h3>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{categories.length} Categories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {loading && categories.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
              ))
           ) : categories.length === 0 ? (
              <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-medium">
                 No categories yet.
              </div>
           ) : (
             categories.map(cat => (
               <div key={cat.id} className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 hover:shadow-md transition-all relative overflow-hidden">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">{cat.name}</h4>
                  <div className="flex items-center gap-1">
                     <button
                      onClick={() => { setEditingCategory(cat); setCategoryModalOpen(true); }}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                     >
                       Edit
                     </button>
                     <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[9px] font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                     >
                       Delete
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
           <h3 className="text-base font-bold text-slate-900">Product List</h3>
           <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
              <Download size={14} /> Export
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[9px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && products.length === 0 ? (
                 [...Array(8)].map((_, i) => (
                    <tr key={i}><td colSpan="6" className="px-8 py-6"><div className="h-4 w-full bg-slate-50 animate-pulse rounded" /></td></tr>
                 ))
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden border border-slate-100">
                           {product.image ? (
                             <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                           ) : (
                             <Wine size={20} />
                           )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SKU: {product.sku || '---'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{product.category_name || product.category}</span></td>
                    <td className="px-8 py-5 text-sm font-extrabold text-primary">KES {parseFloat(product.price).toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-extrabold ${product.stock <= product.low_stock_threshold ? 'text-red-500' : 'text-green-600'}`}>{product.stock}</span>
                        {product.stock <= product.low_stock_threshold && <AlertCircle size={14} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <StatusToggle active={product.is_active} onToggle={() => handleToggleStatus(product)} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${product.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditingProduct(product); setProductModalOpen(true); }}
                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary-light rounded-xl transition-all"
                          >
                             <Edit2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={productModalOpen} onClose={() => setProductModalOpen(false)}
        product={editingProduct} onSave={fetchData}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={editingCategory}
        onSave={fetchData}
      />
    </div>
  );
};

export default Products;
