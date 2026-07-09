import React, { useState, useEffect } from 'react';
import { partner } from '../api';
import { Wallet, ArrowDownRight, History, CreditCard } from 'lucide-react';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const { data } = await partner.getPayoutHistory();
        setPayouts(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPayouts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-primary rounded-[2rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Available for Withdrawal</p>
              <h2 className="text-5xl font-black mb-4">KES 0.00</h2>
              <button className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">Withdraw Now</button>
           </div>
           <div className="bg-white/10 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-white/60 text-xs font-bold uppercase mb-4">Payout Method</p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><CreditCard size={20} /></div>
                 <div><p className="font-bold">M-Pesa Business</p><p className="text-xs opacity-60">254712****78</p></div>
              </div>
           </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-2"><History size={20} className="text-slate-400" /><h3 className="font-bold text-slate-900">Withdrawal History</h3></div>
        <div className="p-20 text-center text-slate-400">No withdrawal records found.</div>
      </div>
    </div>
  );
};

export default Payouts;
