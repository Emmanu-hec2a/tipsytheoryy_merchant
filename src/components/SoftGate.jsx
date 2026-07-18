import React from 'react';
import { ShieldAlert, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const SoftGate = ({ isGated, children, featureName, planRequired = "Pro" }) => {
  if (!isGated) return children;

  return (
    <div className="relative h-full">
      {/* Blurred Content Background */}
      <div className="filter blur-[4px] opacity-40 pointer-events-none select-none h-full">
        {children}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-[280px] space-y-4">
          <div className="w-14 h-14 bg-primary-light dark:bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Crown size={28} className="animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{featureName}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium leading-relaxed">
              Unlock advanced tools with our <span className="text-primary font-bold">{planRequired} Plan</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/billing"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Upgrade Now <ArrowRight size={14} />
            </Link>
            <button className="text-slate-400 text-[9px] font-bold hover:text-slate-600 transition-colors uppercase tracking-widest">
              Learn More
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
             <ShieldAlert size={10} /> Priority Support
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftGate;
