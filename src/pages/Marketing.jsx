import React, { useState, useEffect } from 'react';
import {
  Megaphone, Sparkles, Smartphone, Send,
  Eye, MousePointer2, Target, Crown,
  Image as ImageIcon, Edit3, Save, CheckCircle2,
  AlertCircle, History, Clock
} from 'lucide-react';
import { partner } from '../api';
import SoftGate from '../components/SoftGate';

const MarketingStat = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
        <Icon size={16} />
      </div>
      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
    </div>
    <h3 className="text-lg font-extrabold text-slate-900">{value}</h3>
  </div>
);

const Marketing = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [blastText, setBlastText] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tagline, setTagline] = useState('');
  const [stats, setStats] = useState({
    store_views: '0',
    menu_clicks: '0',
    customer_reach: '0',
    brand_score: 'B'
  });

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const [settingsRes, statsRes] = await Promise.all([
        partner.getSettings(),
        partner.getMarketingStats()
      ]);
      setStore(settingsRes.data);
      setTagline(settingsRes.data.tagline || '');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch marketing data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTagline = async () => {
    setActionLoading(true);
    try {
      await partner.updateSettings({ tagline });
      setMessage({ type: 'success', text: 'Brand tagline updated!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Update failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendBlast = async () => {
    if (!blastText.trim()) return;
    setActionLoading(true);
    try {
      await partner.sendMarketingBlast({ message: blastText });
      setMessage({ type: 'success', text: 'Marketing blast sent to customers!' });
      setBlastText('');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send blast.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Loading Marketing Tools...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Visibility Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MarketingStat title="Store Views" value={stats.store_views} icon={Eye} color={{bg: 'bg-blue-50', text: 'text-blue-600'}} />
        <MarketingStat title="Menu Clicks" value={stats.menu_clicks} icon={MousePointer2} color={{bg: 'bg-primary-light', text: 'text-primary'}} />
        <MarketingStat title="Customer Reach" value={stats.customer_reach} icon={Target} color={{bg: 'bg-green-50', text: 'text-green-600'}} />
        <MarketingStat title="Brand Score" value={stats.brand_score} icon={Sparkles} color={{bg: 'bg-orange-50', text: 'text-orange-600'}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Identity Studio */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-base font-bold text-slate-900">Brand Identity Studio</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Customize your store's personality</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${store?.plan === 'pro' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                   {store?.plan} Store
                </div>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Store Tagline</label>
                   <div className="flex gap-3">
                      <input
                        className="flex-1 bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="e.g. Premium spirits at your doorstep"
                        value={tagline}
                        onChange={e => setTagline(e.target.value)}
                      />
                      <button
                        onClick={handleUpdateTagline}
                        disabled={actionLoading}
                        className="px-6 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        {actionLoading ? '...' : 'Update'}
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                         <ImageIcon size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900">Update Cover Image</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Recommended: 1200x400px</p>
                      </div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                         <Crown size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900">Featured Placement</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Increase visibility by 3x</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Blast Notifications */}
          <SoftGate isGated={store?.plan !== 'pro'} featureName="Blast Notifications" planRequired="Pro">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-full">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                     <Megaphone size={20} />
                  </div>
                  <div>
                     <h3 className="text-base font-bold text-slate-900">Engagement Blast</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Send instant alerts to your followers</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <textarea
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    rows="3"
                    placeholder="Type your message here (e.g. New Wine Arrival! Check out our collection...)"
                    value={blastText}
                    onChange={e => setBlastText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <CheckCircle2 size={12} className="text-green-500" />
                        Targeting {store?.follower_count || 0} customers
                     </div>
                     <button
                        onClick={handleSendBlast}
                        disabled={actionLoading || !blastText.trim()}
                        className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                     >
                        <Send size={14} /> Send Blast
                     </button>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-50">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Recent Blasts</h4>
                  <div className="space-y-3">
                     {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                           <div className="flex items-center gap-3">
                              <History size={14} className="text-slate-300" />
                              <span className="text-xs text-slate-600 font-medium truncate w-48">New stock alert: Johnnie Walker...</span>
                           </div>
                           <span className="text-[9px] font-bold text-slate-400 uppercase">2 days ago</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </SoftGate>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Store App Preview</h4>
           <div className="bg-[#F8FAFC] rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden aspect-[9/19] relative">
              {/* Phone Status Bar */}
              <div className="h-6 w-full flex items-center justify-between px-6 pt-2">
                 <span className="text-[10px] font-bold text-slate-900">9:41</span>
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-slate-900/20" />
                    <div className="w-3 h-3 rounded-full bg-slate-900" />
                 </div>
              </div>

              {/* App Content */}
              <div className="p-4 space-y-4">
                 <div className="h-40 w-full bg-slate-200 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                       <ImageIcon size={32} />
                    </div>
                    {store?.is_pro && (
                       <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase">PRO</div>
                    )}
                 </div>

                 <div className="px-2 space-y-1">
                    <h5 className="text-lg font-black text-slate-900 truncate">{store?.name || 'Store Name'}</h5>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight italic">{tagline || 'Store tagline goes here...'}</p>
                 </div>

                 <div className="flex gap-2 px-2">
                    <div className="flex-1 h-8 bg-primary rounded-xl flex items-center justify-center text-white text-[8px] font-black uppercase tracking-widest">
                       Menu
                    </div>
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                       <Sparkles size={14} />
                    </div>
                 </div>

                 <div className="pt-4 space-y-3 px-2">
                    <div className="h-3 w-20 bg-slate-200 rounded-full" />
                    <div className="grid grid-cols-2 gap-3">
                       <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
                       <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
                    </div>
                 </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900/10 rounded-full" />
           </div>

           {message.text && (
             <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
               message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
             }`}>
               {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
               <p className="text-[11px] font-bold">{message.text}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Marketing;
