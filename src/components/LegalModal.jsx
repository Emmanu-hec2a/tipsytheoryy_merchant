import React from 'react';
import { X, ShieldCheck, FileText, Wine } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const isPrivacy = title.toLowerCase().includes('privacy');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPrivacy ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/5 text-primary'}`}>
              {isPrivacy ? <ShieldCheck size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">TipsyTheoryy Legal Suite</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <X size={20} className="text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
            {content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Wine size={16} className="text-primary opacity-40" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sip. Savour. Celebrate.</span>
          </div>
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-slate-900/10"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
