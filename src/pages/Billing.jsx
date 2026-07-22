import React, { useState, useEffect } from 'react';
import {
  CreditCard, Calendar, History, ArrowUpRight,
  CheckCircle2, Clock, AlertTriangle, Wallet,
  ChevronRight, Download, AlertCircle, Store,
  FileText, RefreshCw, Wine, X, Smartphone, ShieldCheck, ShieldAlert, MessageSquare
} from 'lucide-react';
import { partner } from '../api';
import { BillingSkeleton } from '../components/Skeleton';

const PaymentModal = ({ isOpen, onClose, onConfirm, plan, price, loading }) => {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">M-Pesa Payment</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Wine size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Selected Plan</p>
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">{plan.toUpperCase()} — KES {price}</h4>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
                M-Pesa Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-1">
              Enter PIN in the STK Push prompt on your phone.
            </p>

            <button
              onClick={() => onConfirm(phone)}
              disabled={loading || !phone}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, current, isActive, price, features, onUpgrade, loading }) => {
  const isPro = plan === 'pro';
  const isEnterprise = plan === 'enterprise' || plan === 'custom';
  const isExpired = current && !isActive;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-[2rem] border p-5 flex flex-col relative transition-all ${
      current
        ? (isExpired ? 'border-red-200 dark:border-red-900/50 ring-1 ring-red-100 dark:ring-red-900/20 bg-red-50/10' : (isEnterprise ? 'border-emerald-500 ring-1 ring-emerald-500' : (isPro ? 'border-orange-500 ring-1 ring-orange-500' : 'border-primary ring-1 ring-primary')))
        : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isEnterprise ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : (isPro ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' : 'bg-primary-light dark:bg-primary/20 text-primary')}`}>
          <Store size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">{plan}</h4>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
            {isEnterprise ? 'Enterprise' : (isPro ? 'Elite' : 'Standard')}
          </p>
        </div>
        {isExpired && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded animate-pulse">
            Expired
          </div>
        )}
      </div>

      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          {isEnterprise ? (
            <span className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Custom Plan</span>
          ) : (
            <>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">KES {price}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px]">/mo</span>
            </>
          )}
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <CheckCircle2 size={14} className={`${current ? 'text-primary' : 'text-slate-300 dark:text-slate-600'} shrink-0 mt-0.5`} />
            {feature}
          </li>
        ))}
      </ul>

      {isEnterprise ? (
          current ? (
            <div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase text-center">Active Plan</div>
          ) : (
            <button
              onClick={() => window.open(`https://wa.me/254700000000?text=I'm interested in the Tipsy Enterprise Plan for my business`, '_blank')}
              className="w-full py-2.5 rounded-xl border border-emerald-500/30 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <MessageSquare size={14} /> Contact Sales
            </button>
          )
      ) : (
        <button
            disabled={loading}
            onClick={() => onUpgrade(plan)}
            className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
            current
                ? (isExpired ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : (isPro ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-primary text-white opacity-50'))
                : (isPro ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-primary text-white shadow-lg shadow-primary/10')
            } hover:scale-[1.02] active:scale-95`}
        >
            {isExpired ? 'Renew Now' : current ? 'Active' : loading ? '...' : `Switch to ${plan}`}
        </button>
      )}
    </div>
  );
};

const Billing = () => {
  const [history, setHistory] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, plan: '', price: '' });

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

  const openPaymentFlow = (plan) => {
    let price = '3,000';
    if (plan === 'pro') price = '5,000';
    else if ((plan === 'enterprise' || plan === 'custom') && store?.plan_price) {
        price = formatPrice(store.plan_price);
    }
    setPaymentModal({ isOpen: true, plan, price });
  };

  const handleConfirmPayment = async (phone) => {
    setActionLoading(true);
    try {
      const { data } = await partner.paySubscription({ phone, plan: paymentModal.plan });
      setMessage({ type: 'success', text: data.message });
      setPaymentModal({ isOpen: false, plan: '', price: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 7000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Payment failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <BillingSkeleton />;

  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('en-KE');
  };

  const currentPrice = formatPrice(store?.plan_price || (store?.plan === 'pro' ? 5000 : 3000));
  const isActive = store?.subscription_active;
  const billingStatus = store?.billing_status || 'unknown';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        onConfirm={handleConfirmPayment}
        plan={paymentModal.plan}
        price={paymentModal.price}
        loading={actionLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className={`lg:col-span-3 rounded-[2.5rem] p-6 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl border-b-[3px] ${isActive ? 'bg-primary border-orange-500' : 'bg-slate-900 border-red-500'}`}>
           <div className="relative z-10 space-y-5 text-center md:text-left">
              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                 <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border ${isActive ? 'border-white/10' : 'border-red-500/20'}`}>
                    {isActive ? <ShieldCheck className="text-green-400" size={20} /> : <ShieldAlert className="text-red-400" size={20} />}
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-60">Status</h2>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${isActive ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}>
                            {isActive ? 'Active' : (billingStatus === 'suspended' ? 'Suspended' : 'Expired')}
                        </span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest mt-0.5">
                       Ends: <span className={isActive ? 'opacity-60' : 'text-red-400'}>{store?.subscription_expires || 'N/A'}</span>
                    </p>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2.5">
                 <button
                  onClick={() => openPaymentFlow(store?.plan || 'base')}
                  disabled={actionLoading}
                  className={`px-6 py-2.5 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all disabled:opacity-50 ${isActive ? 'bg-orange-500 shadow-orange-500/20' : 'bg-red-600 shadow-red-600/20'}`}
                 >
                    {actionLoading ? 'Processing...' : (isActive ? 'Renew' : 'Reactivate')}
                 </button>
                 <button className="px-6 py-2.5 bg-white/5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5">
                    <Download size={14} className="opacity-60" /> Invoice
                 </button>
              </div>
           </div>

           <div className="relative z-10 text-center md:text-right py-2 mt-6 md:mt-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Monthly Fee</p>
              <div className="flex items-baseline justify-center md:justify-end gap-1">
                 <span className="text-white/40 font-bold text-xs uppercase">KES</span>
                 <h3 className="text-4xl font-extrabold tracking-tight">{currentPrice}</h3>
              </div>
           </div>

           <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
                 <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="white" strokeWidth="0.5" />
              </svg>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
           <div className="flex items-start gap-3 mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                 {isActive ? <AlertTriangle size={16} /> : <AlertCircle size={16} />}
              </div>
              <div>
                 <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{isActive ? 'Note' : 'Action Required'}</h4>
                 <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                   {isActive ? 'Overdue balances cause store suspension.' : 'Renew now to resume operations.'}
                 </p>
              </div>
           </div>
           <div className="space-y-0.5">
              {['Auto Renewal', 'TOS'].map(text => (
                <button key={text} className="w-full flex items-center justify-between py-1.5 text-[9px] font-bold uppercase tracking-widest text-orange-600 hover:translate-x-1 transition-all">
                   {text} <ChevronRight size={12} />
                </button>
              ))}
           </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-3.5 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <p className="text-xs font-bold">{message.text}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
           <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">Subscription Plans</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <PlanCard
            plan="base" price="3,000"
            features={['Order Management', 'Basic Product List', 'Inventory Alerts', 'Standard Analytics']}
            current={store?.plan === 'base'} isActive={isActive} onUpgrade={openPaymentFlow} loading={actionLoading}
           />
           <PlanCard
            plan="pro" price="5,000"
            features={['Smart Promotions', 'New Arrival Broadcasts', 'Elite Customer Insights', 'Marketing Suite', 'Priority Visibility']}
            current={store?.plan === 'pro'} isActive={isActive} onUpgrade={openPaymentFlow} loading={actionLoading}
           />
           <PlanCard
            plan="enterprise"
            features={[
              'Includes ALL Pro Features',
              'Multi-Branch Management',
              'Consolidated Reports',
              'API & POS Integration',
              'Priority 24/7 Support'
            ]}
            current={store?.plan === 'enterprise' || store?.plan === 'custom'}
            isActive={isActive}
            onUpgrade={() => window.open('https://tipsytheoryy.com/contact-sales', '_blank')}
           />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
           <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment History</h3>
           </div>
           <button onClick={fetchBillingData} className="w-8 h-8 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
              <RefreshCw size={14} />
           </button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-800">
                 <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Ref ID</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 {history.length === 0 ? (
                    <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">No records found</td></tr>
                 ) : (
                    history.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                          <td className="px-5 py-3.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                             {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-extrabold text-slate-900 dark:text-white">KSh {parseFloat(item.amount).toLocaleString()}</td>
                          <td className="px-5 py-3.5 font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.mpesa_receipt || '---'}</td>
                          <td className="px-5 py-3.5">
                             <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${item.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>{item.status}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                             <Download size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-primary cursor-pointer ml-auto" />
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
