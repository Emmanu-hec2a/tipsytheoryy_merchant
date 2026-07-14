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
  <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
        <Icon size={14} />
      </div>
      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
    </div>
    <h3 className="text-base font-extrabold text-slate-900">{value}</h3>
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
    brand_score: 'B',
    recent_blasts: [],
    can_blast: true
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
      setMessage({ type: 'success', text: 'Tagline updated!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchMarketingData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Update failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('cover_image', file);
    setActionLoading(true);
    try {
      await partner.updateSettings(formData);
      setMessage({ type: 'success', text: 'Cover updated!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchMarketingData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendBlast = async () => {
    if (!blastText.trim()) return;
    setActionLoading(true);
    try {
      await partner.sendMarketingBlast({ message: blastText });
      setMessage({ type: 'success', text: 'Blast sent successfully!' });
      setBlastText('');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchMarketingData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 text-xs font-medium">Loading tools...</div>;

  return (
    <div className="space-y-5 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MarketingStat title="Store Views" value={stats.store_views} icon={Eye} color={{bg: 'bg-blue-50', text: 'text-blue-600'}} />
        <MarketingStat title="Menu Clicks" value={stats.menu_clicks} icon={MousePointer2} color={{bg: 'bg-primary-light', text: 'text-primary'}} />
        <MarketingStat title="Reach" value={stats.customer_reach} icon={Target} color={{bg: 'bg-green-50', text: 'text-green-600'}} />
        <MarketingStat title="Score" value={stats.brand_score} icon={Sparkles} color={{bg: 'bg-orange-50', text: 'text-orange-600'}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Brand Identity Studio</h3>
                <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400">{store?.plan}</span>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Store Tagline</label>
                   <div className="flex gap-2">
                      <input
                        className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Premium spirits at your doorstep"
                        value={tagline}
                        onChange={e => setTagline(e.target.value)}
                      />
                      <button onClick={handleUpdateTagline} disabled={actionLoading} className="px-4 bg-primary text-white rounded-xl font-bold text-[9px] uppercase tracking-widest disabled:opacity-50">
                        Update
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                   <label className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 group cursor-pointer hover:border-primary/20 transition-all">
                      <input type="file" className="hidden" accept="image/*" onChange={handleUpdateCover} />
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm"><ImageIcon size={16} /></div>
                      <div>
                         <p className="text-[11px] font-bold text-slate-900">Cover Image</p>
                         <p className="text-[8px] text-slate-400 font-bold uppercase">1200x400px</p>
                      </div>
                   </label>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 group hover:border-primary/20 transition-all cursor-pointer">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm"><Crown size={16} /></div>
                      <div>
                         <p className="text-[11px] font-bold text-slate-900">Featured Placement</p>
                         <p className="text-[8px] text-slate-400 font-bold uppercase">Boost reach 3x</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <SoftGate isGated={store?.plan !== 'pro'} featureName="Blast Notifications" planRequired="Pro">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20"><Megaphone size={16} /></div>
                  <h3 className="text-sm font-bold text-slate-900">Engagement Blast</h3>
               </div>

               <div className="space-y-3">
                  <textarea
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-3 text-xs font-medium focus:ring-1 focus:ring-primary transition-all resize-none outline-none"
                    rows="3"
                    placeholder="Message to your customers..."
                    value={blastText}
                    onChange={e => setBlastText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                     <div className="text-[9px] font-bold text-slate-400 uppercase">Target: {stats.customer_reach} customers</div>
                     <button
                        onClick={handleSendBlast}
                        disabled={actionLoading || !blastText.trim() || !stats.can_blast}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                     >
                        <Send size={12} /> Send Blast
                     </button>
                  </div>
               </div>

               <div className="mt-6 pt-4 border-t border-slate-50">
                  <h4 className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activities</h4>
                  <div className="space-y-2">
                     {stats.recent_blasts.length > 0 ? (
                       stats.recent_blasts.map(blast => (
                        <div key={blast.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                           <span className="text-[11px] text-slate-600 font-medium truncate max-w-[150px]">{blast.message}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(blast.created_at).toLocaleDateString()}</span>
                        </div>
                       ))
                     ) : (
                       <p className="text-center py-2 text-[9px] text-slate-400 font-bold uppercase">No history</p>
                     )}
                  </div>
               </div>
            </div>
          </SoftGate>
        </div>

        <div className="space-y-4">
           <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">App Preview</h4>
           <div className="bg-white rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden aspect-[9/18] relative">
              <div className="h-5 w-full flex items-center justify-between px-5 pt-1.5">
                 <span className="text-[8px] font-bold text-slate-900">9:41</span>
                 <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full border border-slate-900/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                 </div>
              </div>
              <div className="p-3 space-y-3">
                 <div className="h-32 w-full bg-slate-100 rounded-[1.5rem] relative overflow-hidden">
                    {store?.cover_image ? <img src={store.cover_image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-200"><ImageIcon size={24} /></div>}
                 </div>
                 <div className="px-1 space-y-1">
                    <h5 className="text-sm font-black text-slate-900 truncate">{store?.name || 'Store Name'}</h5>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight italic truncate">{tagline || 'Tagline here...'}</p>
                 </div>
                 <div className="flex gap-1.5 px-1">
                    <div className="flex-1 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-[8px] font-black uppercase tracking-widest">Menu</div>
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300"><Sparkles size={12} /></div>
                 </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-900/10 rounded-full" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
