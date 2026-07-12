import React, { useState, useEffect } from 'react';
import { partner } from '../api';
import { Ticket, Plus, Calendar, Trash2, X, Save, TrendingUp, Clock, Tag } from 'lucide-react';

const PromotionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discount_percentage: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        code: '',
        discount_percentage: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format end_date to end of day to prevent immediate expiry
    const formattedData = {
      ...formData,
      end_date: `${formData.end_date}T23:59:59`
    };

    try {
      await partner.createPromotion(formattedData);
      onSave();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save promotion';
      alert(`Error: ${errorMsg}`);
      console.error('Failed to save promotion', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-xl font-bold text-slate-900">Create Promotion</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Campaign Title</label>
              <input
                required
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. Weekend Flash Sale"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Promo Code</label>
                 <input
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-extrabold uppercase tracking-widest text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="FLASH20"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Discount (%)</label>
                 <input
                    required
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-extrabold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="20"
                    value={formData.discount_percentage}
                    onChange={e => setFormData({...formData, discount_percentage: e.target.value})}
                 />
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Expiry Date</label>
              <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                 <input
                    required
                    type="date"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.end_date}
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                 />
              </div>
           </div>

           <div className="pt-2">
              <button
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Creating...' : <><Save size={18} /> Launch Campaign</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await partner.getPromotions();
      setPromotions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion? This action cannot be undone.')) return;
    try {
      await partner.deletePromotion(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete promotion');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div>
           <h2 className="text-lg font-bold text-slate-900">Campaign Manager</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manage discounts & vouchers</p>
        </div>
        <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
            <Plus size={16} /> Create Promo
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
           [...Array(3)].map((_, i) => (
             <div key={i} className="h-32 bg-white animate-pulse rounded-3xl border border-slate-100" />
           ))
        ) : promotions.length === 0 ? (
           <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Ticket size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active campaigns found</p>
              <button onClick={() => setModalOpen(true)} className="mt-4 text-primary text-[10px] font-extrabold uppercase hover:underline">Launch your first promo</button>
           </div>
        ) : (
          promotions.map(promo => {
            const isExpired = new Date(promo.end_date) < new Date();

            return (
              <div key={promo.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isExpired ? 'bg-slate-50 text-slate-300' : 'bg-orange-50 text-orange-500'}`}>
                          <Ticket size={18} />
                       </div>
                       <div>
                          <h4 className="text-base font-extrabold text-slate-900 leading-none">{promo.code}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 truncate max-w-[120px]">{promo.title}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${isExpired ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-600'}`}>
                          {isExpired ? 'Expired' : 'Active'}
                       </span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-50 mb-3">
                    <div className="space-y-0.5">
                       <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Value</p>
                       <p className="text-sm font-extrabold text-primary">{promo.discount_percentage}% OFF</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                       <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Expires</p>
                       <p className="text-xs font-bold text-slate-600">{new Date(promo.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <TrendingUp size={12} className="text-slate-300" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{promo.times_used || 0} REDEMPTIONS</span>
                    </div>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <Trash2 size={14} />
                    </button>
                 </div>
              </div>
            );
          })
        )}
      </div>

      <PromotionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={fetchData} />
    </div>
  );
};

export default Promotions;
