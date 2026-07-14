import React, { useState, useEffect } from 'react';
import { partner } from '../api';
import { Package, AlertTriangle, CheckCircle, Search, Edit2, RefreshCw, Smartphone, TrendingDown, ArrowRight } from 'lucide-react';

const StatusToggle = ({ active, onToggle, loading }) => (
  <button
    disabled={loading}
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${active ? 'bg-primary' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${active ? 'translate-x-4.5' : 'translate-x-1'}`} />
  </button>
);

const InventoryStat = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
          <Icon size={14} />
        </div>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
      </div>
    </div>
    {loading ? (
      <div className="h-5 w-12 bg-slate-100 animate-pulse rounded-lg" />
    ) : (
      <h3 className="text-base font-extrabold text-slate-900">{value}</h3>
    )}
  </div>
);

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ out_of_stock: 0, low_stock: 0, active_items: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, statsRes] = await Promise.all([
        partner.getProducts(),
        partner.getInventoryStats()
      ]);
      setItems(itemsRes.data || []);
      setStats(statsRes.data || { out_of_stock: 0, low_stock: 0, active_items: 0 });
    } catch (err) {
      console.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    setUpdatingId(id);
    try {
      await partner.updateProduct(id, { stock: newStock });
      setItems(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
      partner.getInventoryStats().then(res => setStats(res.data));
    } catch (err) {
      console.error('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      await partner.updateProduct(id, { is_available: !currentStatus });
      setItems(prev => prev.map(item => item.id === id ? { ...item, is_available: !currentStatus } : item));
      partner.getInventoryStats().then(res => setStats(res.data));
    } catch (err) {
      console.error('Failed to toggle availability');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InventoryStat
          title="Out of Stock"
          value={stats.out_of_stock}
          icon={TrendingDown}
          color={{bg: 'bg-red-50', text: 'text-red-500'}}
          loading={loading}
        />
        <InventoryStat
          title="Low Stock"
          value={stats.low_stock}
          icon={AlertTriangle}
          color={{bg: 'bg-orange-50', text: 'text-orange-500'}}
          loading={loading}
        />
        <InventoryStat
          title="Active Items"
          value={stats.active_items}
          icon={CheckCircle}
          color={{bg: 'bg-primary-light', text: 'text-primary'}}
          loading={loading}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text" placeholder="Search product or SKU..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
           <button onClick={fetchData} className="w-8 h-8 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[8px] uppercase font-bold text-slate-400 tracking-widest">
              <tr>
                <th className="px-5 py-3">Product Details</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3 text-center">In App</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && items.length === 0 ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan="6" className="px-5 py-4"><div className="h-3.5 w-full bg-slate-50 animate-pulse rounded" /></td></tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-400 text-xs font-medium">No items found.</td></tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{item.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.category_name || 'Uncategorized'}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-tighter">{item.sku || '---'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusToggle
                        active={item.is_available}
                        onToggle={() => handleToggleAvailability(item.id, item.is_available)}
                        loading={updatingId === item.id}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                         <input
                           type="number"
                           className={`w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-extrabold focus:ring-1 focus:ring-primary outline-none transition-all ${item.stock <= item.low_stock_threshold ? 'text-red-500' : 'text-slate-900'}`}
                           value={item.stock}
                           onChange={e => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
                         />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        !item.is_available || item.stock === 0 ? 'bg-red-50 text-red-600' :
                        item.stock <= item.low_stock_threshold ? 'bg-orange-50 text-orange-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {!item.is_available ? 'Hidden' : item.stock === 0 ? 'Out' : item.stock <= item.low_stock_threshold ? 'Low' : 'OK'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                       <Edit2 size={12} className="text-slate-300 group-hover:text-primary cursor-pointer ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-primary/5 rounded-3xl p-4 border border-primary/10 flex items-center gap-3">
         <Smartphone size={18} className="text-primary shrink-0" />
         <div>
            <p className="text-xs text-primary/80 leading-relaxed font-medium">
               Changes made here reflect <strong>instantly</strong> on the customer app.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Inventory;
