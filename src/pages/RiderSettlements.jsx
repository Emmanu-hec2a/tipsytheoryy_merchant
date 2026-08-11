import React, { useState, useEffect } from 'react';
import {
  Navigation, CheckCircle2, Clock, AlertTriangle,
  Search, ShieldAlert, CreditCard, ExternalLink, Filter
} from 'lucide-react';
import { partner } from '../api';

const RiderSettlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [liveEarnings, setLiveEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [mpesaCode, setMpesaCode] = useState('');
  const [isModalOpen, setIsStoreModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchSettlements = async () => {
    try {
      const [settlementsRes, liveRes] = await Promise.all([
        partner.getRiderSettlements(),
        partner.getLiveRiderEarnings()
      ]);
      setSettlements(settlementsRes.data);
      setLiveEarnings(liveRes.data);
    } catch (err) {
      console.error("Failed to fetch rider data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSettlements = async () => {
    setIsSubmitting(true);
    try {
      await partner.triggerRiderSettlements();
      await fetchSettlements();
      alert('Rider payout records generated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate records');
    } finally {
      setIsSubmitting(false);
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
          <button
            onClick={handleTriggerSettlements}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            {isSubmitting ? 'Generating...' : 'Generate Payouts'}
          </button>
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800 flex items-center gap-2 shadow-sm">
            <Clock size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Settlement Day: Every Monday</span>
          </div>
        </div>
      </div>

      {/* Live Tracking Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Accruals (This Week)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))
          ) : liveEarnings.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No deliveries completed yet this week</p>
            </div>
          ) : liveEarnings.map((earning) => (
            <div key={earning.rider_id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-[10px] uppercase">
                    {earning.rider_name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{earning.rider_name}</h4>
                    <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest">{earning.delivery_count} trips</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-primary dark:text-white">KSh {earning.total_amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-[1px] bg-slate-50 dark:bg-slate-800 w-full mb-2" />
              <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Base: {earning.total_base_fare}</span>
                <span>Tips: {earning.total_tips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Status Notice */}
      <div className="flex items-center gap-3 px-2 text-slate-400">
        <ShieldAlert size={14} className="text-slate-300 dark:text-slate-600" />
        <p className="text-[9px] font-black uppercase tracking-[0.15em]">
          Payout Integrity: Ensure accurate M-Pesa codes to maintain store rating and avoid rider disputes.
        </p>
      </div>

      {/* Compact Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search rider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {['all', 'unpaid', 'paid', 'disputed'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* Compact Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Rider</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Total Due</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Syncing Ledgers...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">No records found</td></tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-500 text-[10px]">
                        {item.rider_name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.rider_name}</p>
                        <p className="text-[9px] text-slate-400 font-bold">Verified</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Week of {new Date(item.week_start).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs font-black text-primary dark:text-white">KSh {parseFloat(item.total_amount).toLocaleString()}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Tips: {item.total_tips}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      item.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                      item.status === 'disputed' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                      'bg-amber-100 text-amber-600 dark:bg-amber-900/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'unpaid' ? (
                      <button
                        onClick={() => { setSelectedSettlement(item); setIsStoreModalOpen(true); }}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto shadow-sm shadow-primary/10"
                      >
                        <CheckCircle2 size={12} /> Pay
                      </button>
                    ) : item.status === 'paid' ? (
                      <div className="flex flex-col items-end">
                        <p className="text-[8px] font-black text-slate-400 uppercase">TX REF</p>
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white">{item.mpesa_code}</p>
                      </div>
                    ) : (
                      <button className="bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ml-auto">
                        <AlertTriangle size={12} /> Dispute
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
