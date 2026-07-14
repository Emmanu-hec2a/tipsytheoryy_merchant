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
    const formattedData = { ...formData, end_date: `${formData.end_date}T23:59:59` };
    try {
      await partner.createPromotion(formattedData);
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to save promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-900">Create Promo</h3>
           <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Campaign Title</label>
              <input
                required className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="Weekend Sale"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Code</label>
                 <input
                    required className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-extrabold uppercase tracking-widest text-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="SAVE20"
                    value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                 />
              </div>
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Disc (%)</label>
                 <input
                    required type="number" className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-extrabold focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="20"
                    value={formData.discount_percentage} onChange={e => setFormData({...formData, discount_percentage: e.target.value})}
                 />
              </div>
           </div>
           <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Expiry Date</label>
              <input
                required type="date" className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:ring-1 focus:ring-primary outline-none transition-all"
                value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
           </div>
           <button
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
           >
            {loading ? 'Creating...' : 'Launch Campaign'}
           </button>
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try { await partner.deletePromotion(id); fetchData(); }
    catch (err) { console.error('Failed to delete promotion'); }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div>
           <h2 className="text-sm font-bold text-slate-900">Campaign Manager</h2>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Discounts & Vouchers</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
            <Plus size={14} /> New Promo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
           [...Array(3)].map((_, i) => (
             <div key={i} className="h-28 bg-white animate-pulse rounded-3xl border border-slate-100" />
           ))
        ) : promotions.length === 0 ? (
           <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Ticket size={24} className="mx-auto mb-2 text-slate-200" />
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No active campaigns</p>
           </div>
        ) : (
          promotions.map(promo => {
            const isExpired = new Date(promo.end_date) < new Date();
            return (
              <div key={promo.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isExpired ? 'bg-slate-50 text-slate-300' : 'bg-orange-50 text-orange-500'}`}><Ticket size={16} /></div>
                       <div>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-none">{promo.code}</h4>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1 truncate max-w-[100px]">{promo.title}</p>
                       </div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isExpired ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-600'}`}>{isExpired ? 'Expired' : 'Live'}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-50 mb-2.5">
                    <div>
                       <p className="text-[7px] text-slate-400 font-bold uppercase mb-0.5">Value</p>
                       <p className="text-xs font-extrabold text-primary">{promo.discount_percentage}% OFF</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[7px] text-slate-400 font-bold uppercase mb-0.5">Expires</p>
                       <p className="text-[10px] font-bold text-slate-600">{new Date(promo.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase"><TrendingUp size={10} /> {promo.times_used || 0} REDEEMED</div>
                    <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={12} /></button>
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
