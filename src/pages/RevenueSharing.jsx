import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, DollarSign, Calendar,
  History, AlertCircle, ArrowRight, CheckCircle2,
  X, Loader2, Landmark, PhoneCall
} from 'lucide-react';
import { partner } from '../api';

const RevenueSharing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [mpesaCode, setMpesaCode] = useState(''); // This will be used as the phone number input
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [payError, setPayError] = useState('');

  // Auto-fill phone number from store settings
  useEffect(() => {
    if (isAuthenticated) {
      const stats = JSON.parse(localStorage.getItem('dashboard_stats') || '{}');
      // We don't have the phone directly in dashboard stats usually,
      // but we can fetch it or use a default if available.
      // Better yet, let's ensure it's fetched when data loads.
    }
  }, [isAuthenticated]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await partner.verifyRevenueGate({ password });
      if (res.data.success) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err) {
      setAuthError('Access Denied. Incorrect Password.');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setFetchLoading(true);
    setError(null);
    try {
      const [revRes, settingsRes] = await Promise.all([
        partner.getRevenueShare(),
        partner.getSettings()
      ]);
      setData(revRes.data);
      // Pre-fill phone number from settings
      if (settingsRes.data?.phone) {
        setMpesaCode(settingsRes.data.phone);
      }
    } catch (err) {
      console.error('Failed to fetch revenue data', err);
      setError('Failed to connect to billing server. Please check your internet or try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const initiatePayment = (stat) => {
    setSelectedStat(stat);
    setShowPayModal(true);
    setPayError('');
  };

  const handleConfirmPayment = async (phoneToUse) => {
    const phone = phoneToUse || mpesaCode; // Reusing state or passed phone
    if (!phone || phone.length < 10) {
      setPayError('Please enter a valid M-Pesa Phone Number.');
      return;
    }

    setIsVerifying(true);
    setPayError('');
    try {
      const res = await partner.payRevenueShare({
        stat_id: selectedStat.id,
        phone: phone
      });

      const checkoutId = res.data.checkout_request_id;

      // Close selection modal to show verification overlay
      setShowPayModal(false);

      // 🛡️ RESILIENCY: Polling with Initial Delay & Max Retries
      let attempts = 0;
      const MAX_ATTEMPTS = 40; // ~2 minutes total

      const checkStatus = async () => {
        if (attempts >= MAX_ATTEMPTS) {
          setIsVerifying(false);
          setPayError('Verification timed out. Please check your billing history in a moment.');
          return;
        }

        try {
          const statusRes = await partner.getSubscriptionStatus(checkoutId);

          if (statusRes.data.payment_status === 'success') {
            setIsVerifying(false);
            fetchData();
            setTimeout(() => window.location.reload(), 1500);
          } else if (statusRes.data.payment_status === 'failed') {
            setIsVerifying(false);
            setPayError('Payment failed or cancelled.');
            setShowPayModal(true);
          } else {
            // payment_status is 'pending' or null (not found yet)
            attempts++;
            setTimeout(checkStatus, 3000);
          }
        } catch (e) {
          // 🛡️ Silent Fail: If the record isn't in DB yet, backend might return 400/404.
          // We wait and try again instead of crashing.
          attempts++;
          setTimeout(checkStatus, 3000);
        }
      };

      // Initial delay of 2 seconds before first poll to allow DB write
      setTimeout(checkStatus, 2000);

    } catch (err) {
      setPayError(err.response?.data?.error || 'Failed to initiate STK Push.');
      setIsVerifying(false);
    }
  };

  const cancelVerification = () => {
    setIsVerifying(false);
    setPayError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-5">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 dark:bg-primary text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl">
             <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pay As You Go Gate</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">This section contains sensitive financial and commission records.</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
             <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                <input
                  type="password"
                  placeholder="Enter Access Password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
             </div>
             {authError && (
               <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                  {authError}
               </div>
             )}
             <button
               disabled={loading}
               className="w-full bg-slate-900 dark:bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 dark:shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
             >
               {loading ? 'Verifying...' : 'Unlock Secure Records'}
             </button>
          </form>
        </div>
      </div>
    );
  }

  if (fetchLoading) return <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">Accessing Vault...</div>;

  if (error) {
    return (
      <div className="p-20 text-center space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <p className="text-sm font-bold text-slate-900 dark:text-white">{error}</p>
        <button onClick={fetchData} className="bg-primary text-white px-6 py-2 rounded-xl font-bold uppercase text-[10px]">Retry Connection</button>
      </div>
    );
  }

  const current = data?.current_week;
  const history = data?.history || [];
  const commRate = data?.commission_rate || 10;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Pay-As-You-Go Commission ({commRate}%)</span>
                  </div>
                  <Calendar size={20} className="text-white/20" />
               </div>
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Sales this week</h3>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black">KSh {current?.total_liquor_sales?.toLocaleString() || '0'}</span>
                  </div>
               </div>
               <div className="flex flex-col md:flex-row md:items-center gap-6 pt-6 border-t border-white/10">
                  <div className="flex-1">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Commission Due ({commRate}%)</h4>
                     <p className="text-2xl font-black text-primary">KSh {current?.partner_share?.toLocaleString() || '0'}</p>
                  </div>
                  {!current?.status || current?.status === 'unpaid' ? (
                    <button
                      onClick={() => initiatePayment(current)}
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                    >
                      Pay Now
                    </button>
                  ) : current?.status === 'pending' ? (
                    <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 animate-pulse">
                       <Loader2 size={16} className="animate-spin" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Verification Pending</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-2xl border border-green-500/20">
                       <CheckCircle2 size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Paid for this week</span>
                    </div>
                  )}
               </div>
            </div>
            {/* Design elements */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
         </div>

         <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 space-y-6">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center">
               <History size={24} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Billing Cycle</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Sales are tracked Monday to Sunday. Commission is calculated at {commRate}% of total sales.
            </p>
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
               <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                  <span>Pay-As-You-Go Policy</span>
                  <ArrowRight size={12} />
               </div>
            </div>
         </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Verification Overlay for Commission */}
        {isVerifying && !showPayModal && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto">
                  <RefreshCw size={40} className="animate-spin" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Verifying Commission</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      We are waiting for M-Pesa confirmation. Please enter your PIN on your phone.
                  </p>
                </div>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Cancel Waiting
                </button>
            </div>
          </div>
        )}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Invoicing History</h3>
           <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Total Records: {history.length}</div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">
                 <tr>
                    <th className="px-6 py-4">Billing Period</th>
                    <th className="px-6 py-4">Total Sales</th>
                    <th className="px-6 py-4">Commission ({commRate}%)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ref Code</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 {history.map((h) => (
                   <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                      <td className="px-6 py-5">
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                               {new Date(h.week_start).toLocaleDateString()} - {new Date(h.week_end).toLocaleDateString()}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-tighter">Week Period</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-slate-600 dark:text-slate-400">KSh {h.total_liquor_sales.toLocaleString()}</td>
                      <td className="px-6 py-5 text-xs font-black text-slate-900 dark:text-white">KSh {h.partner_share.toLocaleString()}</td>
                      <td className="px-6 py-5">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           h.status === 'paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                           h.status === 'pending' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 animate-pulse' :
                           'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                         }`}>
                            {h.status === 'paid' ? 'Paid' : h.status === 'pending' ? 'Verifying...' : 'Unpaid'}
                         </span>
                      </td>
                      <td className="px-6 py-5">
                         {h.status === 'paid' || h.status === 'pending' ? (
                           <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">{h.mpesa_code}</span>
                         ) : (
                           <button
                             onClick={() => initiatePayment(h)}
                             className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                           >
                             Pay Now
                           </button>
                         )}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-5">
           <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Commission Payout</h3>
                    {!isVerifying && (
                      <button onClick={() => setShowPayModal(false)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                        <X size={20} />
                      </button>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-3xl border border-primary/10 dark:border-primary/20">
                       <div className="flex items-center gap-2 mb-3">
                          <Landmark size={16} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Option 1: Bank Transfer</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white">KCB BANK</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Lipa na Mpesa</p>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white">Paybill: 522522</p>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white">Acc: 1316778207</p>
                       </div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                       <div className="flex items-center gap-2 mb-3">
                          <PhoneCall size={16} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Option 2: Send Money</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white">M-Pesa Send Money</p>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white">Phone: 0718258821</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Recipient:</p>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase">Emmanuel Odongo</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total to Pay:</span>
                       <span className="text-lg font-black text-slate-900 dark:text-white underline decoration-primary decoration-4 underline-offset-4">KSh {selectedStat?.partner_share?.toLocaleString()}</span>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">M-Pesa Phone Number</label>
                       <input
                         type="text"
                         placeholder="0712345678"
                         className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-5 text-sm font-black uppercase placeholder:text-slate-200 dark:placeholder:text-slate-700 text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-primary focus:ring-0 transition-all"
                         value={mpesaCode}
                         onChange={(e) => setMpesaCode(e.target.value)}
                         disabled={isVerifying}
                       />
                    </div>
                 </div>

                 {payError && (
                   <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100 dark:border-red-900/30">
                      {payError}
                   </div>
                 )}

                 <div className="space-y-3">
                    {!isVerifying ? (
                      <button
                        onClick={() => handleConfirmPayment()}
                        className="w-full bg-slate-900 dark:bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 dark:shadow-primary/20 hover:scale-[1.02] transition-all"
                      >
                        Send STK Push
                      </button>
                    ) : (
                      <div className="space-y-4">
                         <div className="flex flex-col items-center justify-center py-4 space-y-3">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <div className="text-center">
                               <p className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Waiting for M-Pesa</p>
                               <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Please enter PIN on your phone...</p>
                            </div>
                         </div>
                         <button
                           onClick={cancelVerification}
                           className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                         >
                           Cancel
                         </button>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RevenueSharing;
