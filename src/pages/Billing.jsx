import React, { useState, useEffect } from 'react';
import {
  CreditCard, Calendar, History, ArrowUpRight,
  CheckCircle2, Clock, AlertTriangle, Wallet,
  ChevronRight, Download, AlertCircle, Store,
  FileText, RefreshCw, Wine
} from 'lucide-react';
import { partner } from '../api';

const PlanCard = ({ plan, current, price, features, onUpgrade, loading }) => {
  const isPro = plan === 'pro';
  const isEnterprise = plan === 'enterprise';

  if (isEnterprise) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
          <Store size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Enterprise</h4>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6 px-2">
          Custom solutions for multi-store franchises and high-volume distributors.
        </p>
        <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all">
          Talk to Sales
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border p-6 flex flex-col relative transition-all ${
      current ? (isPro ? 'border-orange-500 ring-1 ring-orange-500' : 'border-[#0D3B30] ring-1 ring-[#0D3B30]') : 'border-slate-100 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPro ? 'bg-orange-50 text-orange-500' : 'bg-primary-light text-primary'}`}>
          <Store size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none mb-1">{plan} Plan</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            {isPro ? 'Elite Business' : 'Standard Setup'}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-900">KES {price}</span>
          <span className="text-slate-500 font-bold text-xs">/mo</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <CheckCircle2 size={16} className="text-slate-300 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        disabled={current || loading}
        onClick={() => onUpgrade(plan)}
        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
          current
            ? (isPro ? 'bg-slate-50 text-slate-400' : 'bg-[#0D3B30] text-white opacity-50')
            : (isPro ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[#0D3B30] text-white shadow-lg shadow-[#0D3B30]/10')
        } hover:scale-[1.02] active:scale-95`}
      >
        {current ? 'Current Plan' : loading ? 'Switching...' : `Switch to ${plan}`}
      </button>
    </div>
  );
};

const Billing = () => {
  const [history, setHistory] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [historyRes, settingsRes] = await Promise.all([
        partner.getBillingHistory(),
        partner.getSettings()
      ]);
      setHistory(historyRes.data || []);
      setStore(settingsRes.data);
    } catch (err) {
      console.error('Failed to fetch billing data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    setActionLoading(true);
    try {
      const { data } = await partner.paySubscription();
      setMessage({ type: 'success', text: data.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Payment initiation failed.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    if (!window.confirm(`Are you sure you want to switch to the ${plan.toUpperCase()} plan?`)) return;
    setActionLoading(true);
    try {
      await partner.updateSettings({ plan });
      fetchBillingData();
      setMessage({ type: 'success', text: `Plan updated to ${plan.toUpperCase()}!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update plan.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Loading billing details...</div>;

  const currentPrice = store?.plan === 'pro' ? '5,000' : '3,000';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Banner */}
        <div className="lg:col-span-3 bg-[#0D3B30] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl border-b-4 border-orange-500">
           <div className="relative z-10 space-y-6 text-center md:text-left">
              <div className="flex items-center gap-4 justify-center md:justify-start">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Wine className="text-white opacity-40" size={24} />
                 </div>
                 <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Plan</h2>
                    <p className="text-sm font-bold uppercase tracking-widest mt-1">
                       Next: <span className="opacity-60">{store?.subscription_expires || 'Not Scheduled'}</span>
                    </p>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                 <button
                  onClick={handlePayNow}
                  disabled={actionLoading}
                  className="px-8 py-3 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {actionLoading ? 'Processing...' : 'Renew Subscription'}
                 </button>
                 <button className="px-8 py-3 bg-white/5 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <Download size={16} className="opacity-60" /> Download Invoice
                 </button>
              </div>
           </div>

           <div className="relative z-10 text-center md:text-right md:pl-12 py-4 mt-8 md:mt-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Subscription Fee</p>
              <div className="flex items-baseline justify-center md:justify-end gap-1">
                 <span className="text-white/40 font-bold text-sm uppercase">KES</span>
                 <h3 className="text-5xl font-extrabold tracking-tight">{currentPrice}</h3>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest mt-2">Billed monthly, cancel anytime</p>
           </div>

           <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
                 <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="white" strokeWidth="0.5" />
                 <path d="M0,40 Q25,20 50,40 T100,40" fill="none" stroke="white" strokeWidth="0.5" />
              </svg>
           </div>
        </div>

        {/* Notice Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
           <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                 <AlertTriangle size={20} />
              </div>
              <div>
                 <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Important Notice</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                   Overdue balances are hidden from customers after 24 hours.
                 </p>
              </div>
           </div>

           <div className="space-y-1">
              {['Deduct Payments', 'Automatic Renewal', 'Terms of Service'].map(text => (
                <button key={text} className="w-full flex items-center justify-between py-2.5 text-[10px] font-bold uppercase tracking-widest text-orange-600 hover:translate-x-1 transition-all">
                   {text} <ChevronRight size={14} />
                </button>
              ))}
           </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500 ${
          message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      {/* Plans Section */}
      <div className="space-y-6">
        <div>
           <h3 className="text-lg font-bold text-slate-900 px-1">Available Plans</h3>
           <p className="text-sm text-slate-500 font-medium px-1">Choose the best fit for your store</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <PlanCard
            plan="base"
            price="3,000"
            features={['Order Management', 'Basic Analytics', 'Standard Support', '1% Platform Fee']}
            current={store?.plan === 'base'}
            onUpgrade={handleUpgrade}
            loading={actionLoading}
           />
           <PlanCard
            plan="pro"
            price="5,000"
            features={['Priority Ranking', 'Elite Visibility', 'Marketing Dashboard', 'Customer Insights', '2.5% Fee']}
            current={store?.plan === 'pro'}
            onUpgrade={handleUpgrade}
            loading={actionLoading}
           />
           <PlanCard plan="enterprise" />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div>
              <h3 className="text-lg font-bold text-slate-900">Payment History</h3>
              <p className="text-sm text-slate-500 font-medium">Download invoices and receipts</p>
           </div>
           <button onClick={fetchBillingData} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all">
              <RefreshCw size={16} />
           </button>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                 <tr>
                    <th className="px-6 py-4">Transaction Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Reference ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Invoice</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {history.length === 0 ? (
                    <tr>
                       <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 text-slate-400">
                             <FileText size={48} className="opacity-20" />
                             <p className="text-sm font-medium">No transaction records found</p>
                          </div>
                       </td>
                    </tr>
                 ) : (
                    history.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4 text-sm font-medium text-slate-600 uppercase">{item.date}</td>
                          <td className="px-6 py-4 text-sm font-extrabold text-slate-900">KSh {parseFloat(item.amount).toLocaleString()}</td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">{item.receipt || '---'}</td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                item.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                             }`}>
                                {item.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all flex items-center justify-center ml-auto">
                                <Download size={16} />
                             </button>
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
