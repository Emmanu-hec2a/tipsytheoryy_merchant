import React, { useState, useEffect } from 'react';
import { partner } from '../api';
import { Ticket, Plus, Calendar, Trash2, X, Save, TrendingUp, Clock, Tag, Percent, DollarSign } from 'lucide-react';
import SoftGate from '../components/SoftGate';

const PromotionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discount_percentage: '',
    discount_amount: '',
    min_order_amount: '0',
    usage_limit: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true
  });
  const [discountType, setDiscountType] = useState('percentage');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        code: '',
        discount_percentage: '',
        discount_amount: '',
        min_order_amount: '0',
        usage_limit: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true
      });
      setDiscountType('percentage');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };
    if (discountType === 'percentage') {
        payload.discount_amount = null;
    } else {
        payload.discount_percentage = null;
    }

    const formattedData = { ...payload, end_date: `${formData.end_date}T23:59:59` };
    try {
      await partner.createPromotion(formattedData);
      onSave();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save promotion';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Promo</h3>
           <button onClick={onClose} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
           <div>
              <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Campaign Title</label>
              <input
                required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="Weekend Sale"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Code</label>
                 <input
                    required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-extrabold uppercase tracking-widest text-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="SAVE20"
                    value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                 />
              </div>
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Discount Type</label>
                 <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-[10px] font-bold text-slate-900 dark:text-white outline-none"
                 >
                    <option value="percentage">Percentage (%)</option>
                    <option value="amount">Fixed Amount (KSh)</option>
                 </select>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {discountType === 'percentage' ? 'Disc (%)' : 'Amount (KSh)'}
                 </label>
                 <input
                    required type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder={discountType === 'percentage' ? '20' : '500'}
                    value={discountType === 'percentage' ? formData.discount_percentage : formData.discount_amount}
                    onChange={e => setFormData({
                        ...formData,
                        [discountType === 'percentage' ? 'discount_percentage' : 'discount_amount']: e.target.value
                    })}
                 />
              </div>
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Min. Order (KSh)</label>
                 <input
                    type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="0"
                    value={formData.min_order_amount} onChange={e => setFormData({...formData, min_order_amount: e.target.value})}
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Usage Limit</label>
                 <input
                    type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Unlimited"
                    value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})}
                 />
              </div>
              <div>
                 <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Expiry Date</label>
                 <input
                    required type="date" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})}
                 />
              </div>
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
    <SoftGate isGated={!isPro} featureName="Smart Promotions" planRequired="Pro">
      <div className="space-y-5 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Campaign Manager</h2>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Discounts & Vouchers</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
              <Plus size={14} /> New Promo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-white dark:bg-slate-900 animate-pulse rounded-3xl border border-slate-100 dark:border-slate-800" />
            ))
          ) : promotions.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <Ticket size={24} className="mx-auto mb-2 text-slate-200 dark:text-slate-700" />
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">No active campaigns</p>
            </div>
          ) : (
            promotions.map(promo => {
              const isExpired = new Date(promo.end_date) < new Date();
              return (
                <div key={promo.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isExpired ? 'bg-slate-50 dark:bg-slate-800 text-slate-300' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'}`}><Ticket size={16} /></div>
                        <div>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">{promo.code}</h4>
                            <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mt-1 truncate max-w-[100px]">{promo.title}</p>
                        </div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isExpired ? 'bg-red-50 dark:bg-red-900/20 text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>{isExpired ? 'Expired' : 'Live'}</span>
                  </div>

                  {/* Performance Metrics Section */}
                  <div className="grid grid-cols-2 gap-3 mb-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-1 text-[7px] text-slate-400 dark:text-slate-500 font-black uppercase mb-0.5">
                            <Percent size={8} className="text-primary" /> Redemption Rate
                        </div>
                        <p className="text-[11px] font-black text-slate-900 dark:text-white">
                          {promo.usage_limit ? Math.round((promo.times_used / promo.usage_limit) * 100) : '0'}%
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-[7px] text-slate-400 dark:text-slate-500 font-black uppercase mb-0.5">
                            <DollarSign size={8} className="text-green-500" /> Total Saved
                        </div>
                        <p className="text-[11px] font-black text-green-600 dark:text-green-400">
                          KSh {parseFloat(promo.total_saved || 0).toLocaleString()}
                        </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2.5 border-b border-slate-50 dark:border-slate-800 mb-2.5">
                      <div>
                        <p className="text-[7px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Value</p>
                        <p className="text-xs font-extrabold text-primary">
                          {promo.discount_percentage ? `${promo.discount_percentage}% OFF` : `KSh ${parseFloat(promo.discount_amount).toLocaleString()} OFF`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Min Order</p>
                        <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">KSh {parseFloat(promo.min_order_amount || 0).toLocaleString()}</p>
                      </div>
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                              <TrendingUp size={10} /> {promo.times_used || 0} REDEEMED
                          </div>
                          {promo.usage_limit && (
                              <p className="text-[7px] text-slate-400 mt-0.5 font-medium italic">Limit: {promo.usage_limit} total uses</p>
                          )}
                      </div>
                      <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={12} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <PromotionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={fetchData} />
      </div>
    </SoftGate>
  );
};

export default Promotions;
