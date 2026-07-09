import React from 'react';
import { Construction, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Placeholder = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-primary-light text-primary rounded-[2rem] flex items-center justify-center mb-8 relative">
        <Construction size={48} className="animate-bounce duration-[2000ms]" />
        <Sparkles size={20} className="absolute -top-1 -right-1 text-accent animate-pulse" />
      </div>

      <h2 className="text-3xl font-black text-slate-900 mb-4">{title} Module</h2>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
        We're currently building something amazing for your store management experience. This feature will be available in the next platform update.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <button className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold border border-slate-100 hover:bg-slate-100 transition-all">
          Request Early Access
        </button>
      </div>

      <div className="mt-20 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
         <div className="w-8 h-[1px] bg-slate-200" />
         TipsyTheoryy Build v1.0.4
         <div className="w-8 h-[1px] bg-slate-200" />
      </div>
    </div>
  );
};

export default Placeholder;
