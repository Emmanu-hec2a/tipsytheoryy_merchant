import React, { useState, useEffect } from 'react';
import {
  Navigation, CheckCircle2, Clock, AlertTriangle,
  Search, ShieldAlert, CreditCard, ExternalLink, Filter
} from 'lucide-react';
import { partner } from '../api';

const RiderSettlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [mpesaCode, setMpesaCode] = useState('');
  const [isModalOpen, setIsStoreModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchSettlements = async () => {
    try {
      const { data } = await partner.getRiderSettlements();
      setSettlements(data);
    } catch (err) {
      console.error("Failed to fetch rider settlements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleSettle = async (e) => {
    e.preventDefault();
    if (!mpesaCode.trim()) return;

    setIsSubmitting(true);
    try {
      await partner.settleRiderWeek(selectedSettlement.id, { mpesa_code: mpesaCode });
      setIsStoreModalOpen(false);
      setMpesaCode('');
      fetchSettlements();
      alert('Settlement recorded successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to record settlement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = settlements.filter(s => {
    const matchesSearch = s.rider_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Rider Payouts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage weekly settlements for your delivery partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800 flex items-center gap-2 shadow-sm">
            <Clock size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Settlement Day: Every Monday</span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] p-6 flex items-start gap-5">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-wide">Legal Warning: Payout Integrity</h4>
          <p className="text-xs text-red-700/70 dark:text-red-400/60 leading-relaxed font-medium">
            Entering fraudulent M-Pesa transaction codes is a violation of the Partner Agreement. cheating on rider payouts triggers an <strong>immediate account audit</strong> and potential suspension. Riders have the right to dispute unpaid settlements.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search rider name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
            {['all', 'unpaid', 'paid', 'disputed'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Period</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Due</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Synchronizing Ledgers...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No payout records found</td></tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-500 group-hover:scale-110 transition-transform">
                        {item.rider_name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.rider_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Verified Rider</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Week of {new Date(item.week_start).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.week_start} - {item.week_end}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-primary dark:text-white">KSh {parseFloat(item.total_amount).toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-bold">Base: {item.total_base_fare} | Tips: {item.total_tips}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                      item.status === 'disputed' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                      'bg-amber-100 text-amber-600 dark:bg-amber-900/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {item.status === 'unpaid' ? (
                      <button
                        onClick={() => { setSelectedSettlement(item); setIsStoreModalOpen(true); }}
                        className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto shadow-lg shadow-primary/20"
                      >
                        <CheckCircle2 size={14} /> Mark Paid
                      </button>
                    ) : item.status === 'paid' ? (
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase">TX REF</p>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white">{item.mpesa_code}</p>
                      </div>
                    ) : (
                      <button className="bg-red-50 dark:bg-red-900/20 text-red-500 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-auto">
                        <AlertTriangle size={14} /> View Dispute
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-primary-light/30 dark:bg-primary/20 text-primary rounded-3xl flex items-center justify-center mx-auto mb-2">
                <CreditCard size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Record Payout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Confirm payout for <strong>{selectedSettlement?.rider_name}</strong>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</span>
                  <span className="text-lg font-black text-primary dark:text-white underline decoration-primary/30 underline-offset-4">KSh {parseFloat(selectedSettlement?.total_amount).toLocaleString()}</span>
               </div>
               <div className="h-[1px] bg-slate-200 dark:bg-slate-700 w-full" />
               <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">M-Pesa Target</span>
                  <span className="text-slate-600 dark:text-slate-300">07XX XXX XXX (Rider Profile)</span>
               </div>
            </div>

            <form onSubmit={handleSettle} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Enter M-Pesa Transaction Code</label>
                <input
                  autoFocus
                  required
                  type="text"
                  placeholder="e.g. SFD5S..."
                  value={mpesaCode}
                  onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                  className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-center text-xl font-black tracking-[0.2em] focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase placeholder:opacity-30"
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl flex gap-3">
                 <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-red-700/80 dark:text-red-400/60 font-bold uppercase tracking-tight leading-normal">
                    Fake codes trigger a manual platform audit. Your store visibility will be hidden during investigation.
                 </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStoreModalOpen(false)}
                  className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderSettlements;
