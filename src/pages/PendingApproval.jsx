import React, { useState } from 'react';
import { Clock, ShieldCheck, Mail, ArrowLeft, LogOut, RefreshCw } from 'lucide-react';

const PendingApproval = ({ onCheckStatus }) => {
  const [checking, setChecking] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    if (onCheckStatus) {
      await onCheckStatus();
    }
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
           <Clock size={40} className="animate-pulse" />
           <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck size={14} className="text-orange-500" />
           </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-4">Application Pending</h2>
        <p className="text-slate-500 leading-relaxed mb-8">
          Thank you for joining TipsyTheoryy! Our team is currently reviewing your store details. You'll receive an email once your account is active.
        </p>

        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl mb-8">
           <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <Mail size={18} className="text-primary" />
              <span>support@tipsytheoryy.com</span>
           </div>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest text-left">Average review time: 24 Hours</p>
        </div>

        <div className="flex flex-col gap-3">
            <button
                disabled={checking}
                onClick={handleCheckStatus}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {checking ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  'Check Status'
                )}
            </button>
            <button
                onClick={handleLogout}
                className="w-full py-4 text-slate-400 font-bold hover:text-red-500 transition-all flex items-center justify-center gap-2"
            >
                <LogOut size={18} /> Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
