import React, { useState, useEffect } from 'react';
import {
  Store, CreditCard, Truck, Bell,
  Save, Phone, Mail, MapPin, Clock,
  ShieldCheck, AlertCircle, CheckCircle2,
  Building2, Hash, UserCircle, Key, Lock
} from 'lucide-react';
import { partner } from '../api';
import SoftGate from '../components/SoftGate';

const SettingsTab = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Store Information');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State for all settings
  const [formData, setFormData] = useState({
    // Store Info
    name: '',
    tagline: '',
    address_string: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    email: '',
    opening_time: '09:00',
    closing_time: '23:00',
    primary_color: '#F97316',

    // Payout / Bank (Maps to User model in backend)
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',

    // M-Pesa Daraja Credentials
    mpesa_shortcode: '',
    mpesa_consumer_key: '',
    mpesa_consumer_secret: '',
    mpesa_passkey: '',
    mpesa_callback_url: '',

    plan: 'base',

    // Delivery
    delivery_fee: 200,
    delivery_radius_km: 7,
    base_delivery_fee: 100,
    base_distance_km: 2,
    extra_distance_surcharge: 30,

    // Notifications (Frontend state, usually handled by push/fcm token)
    notifications_enabled: true,
    email_notifications: true
  });

  const [locationStatus, setLocationStatus] = useState('idle');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await partner.getSettings();
      setFormData({
        ...formData,
        name: data.name || '',
        tagline: data.tagline || '',
        address_string: data.address_string || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        delivery_fee: data.delivery_fee || 200,
        delivery_radius_km: data.delivery_radius_km || 7,
        base_delivery_fee: data.base_delivery_fee || 100,
        base_distance_km: data.base_distance_km || 2,
        extra_distance_surcharge: data.extra_distance_surcharge || 30,
        phone: data.phone || '',
        email: data.email || '',
        opening_time: data.opening_time?.substring(0, 5) || '09:00',
        closing_time: data.closing_time?.substring(0, 5) || '23:00',
        primary_color: data.primary_color || '#F97316',

        bank_name: data.bank_name || '',
        bank_account_name: data.bank_account_name || '',
        bank_account_number: data.bank_account_number || '',

        // M-Pesa fields
        mpesa_shortcode: data.mpesa_shortcode || '',
        mpesa_consumer_key: data.mpesa_consumer_key || '',
        mpesa_consumer_secret: data.mpesa_consumer_secret || '',
        mpesa_passkey: data.mpesa_passkey || '',
        mpesa_callback_url: data.mpesa_callback_url || '',

        plan: data.plan || 'base'
      });
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setFormData({ ...formData, latitude: lat, longitude: lng });
        setLocationStatus('success');
        setMessage({ type: 'success', text: 'Shop coordinates captured successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      },
      (error) => {
        setLocationStatus('error');
        setMessage({ type: 'error', text: 'Failed to capture location.' });
      }
    );
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await partner.updateSettings(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const tabs = [
    { label: 'Store Information', icon: Store },
    { label: 'Payment Settings', icon: CreditCard },
    { label: 'Delivery Settings', icon: Truck },
    { label: 'Notifications', icon: Bell },
  ];

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Loading store settings...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          {tabs.map(tab => (
            <SettingsTab
              key={tab.label}
              {...tab}
              active={activeTab === tab.label}
              onClick={() => setActiveTab(tab.label)}
            />
          ))}
        </aside>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{activeTab}</h3>
                <div className="flex items-center gap-3">
                   <button
                    onClick={fetchSettings}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
                   >
                     Reset
                   </button>
                   <button
                    disabled={saveLoading}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                   >
                      {saveLoading ? 'Saving...' : <><Save size={14} /> Save</>}
                   </button>
                </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            {/* Store Information Tab */}
            {activeTab === 'Store Information' && (
              <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                    <input
                      type="text" className="input-field" placeholder="Enter store name"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
                    <textarea
                      rows="2" className="input-field resize-none py-4" placeholder="e.g. Premium spirits at your doorstep"
                      value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="tel" className="input-field pl-12 font-medium" placeholder="+254..."
                              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="email" className="input-field pl-12 font-medium" placeholder="store@email.com"
                              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Physical Address</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text" className="input-field pl-12" placeholder="123 Street, City"
                            value={formData.address_string} onChange={(e) => setFormData({...formData, address_string: e.target.value})}
                          />
                      </div>
                      <button
                        onClick={captureLocation}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        <MapPin size={16} className="inline mr-2" /> Use GPS
                      </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-50 pt-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Opening Hours</label>
                        <div className="flex items-center gap-3">
                            <input type="time" className="input-field py-2.5 text-sm" value={formData.opening_time} onChange={e => setFormData({...formData, opening_time: e.target.value})} />
                            <span className="text-slate-400 font-bold">to</span>
                            <input type="time" className="input-field py-2.5 text-sm" value={formData.closing_time} onChange={e => setFormData({...formData, closing_time: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Theme Color</label>
                        <input type="color" className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden" value={formData.primary_color} onChange={e => setFormData({...formData, primary_color: e.target.value})} />
                    </div>
                </div>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'Payment Settings' && (
              <div className="space-y-10">
                {/* Bank Payouts Section */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <Building2 size={24} className="text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Payout Destination</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Where you receive your settlements from TipsyTheoryy.</p>
                    </div>
                  </div>

                  <div className="space-y-6 px-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Bank Name</label>
                      <input
                        type="text" className="input-field" placeholder="e.g. Equity Bank, KCB"
                        value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Account Name</label>
                        <input
                          type="text" className="input-field" placeholder="Business or Personal Name"
                          value={formData.bank_account_name} onChange={(e) => setFormData({...formData, bank_account_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Account Number</label>
                        <input
                          type="text" className="input-field font-mono" placeholder="0123456789"
                          value={formData.bank_account_number} onChange={(e) => setFormData({...formData, bank_account_number: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Daraja Section */}
                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <ShieldCheck size={24} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">M-Pesa Daraja Integration</h4>
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Direct STK</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">Configure your Safaricom Daraja API credentials to receive payments directly to your Shortcode or Till Number.</p>
                    </div>
                  </div>

                  <SoftGate isGated={formData.plan === 'base'} featureName="Direct M-Pesa Integration" planRequired="Pro">
                    <div className="space-y-6 px-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Shortcode / Till</label>
                          <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="text" className="input-field pl-12" placeholder="e.g. 174379"
                              value={formData.mpesa_shortcode} onChange={(e) => setFormData({...formData, mpesa_shortcode: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">LNM Passkey</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="password" className="input-field pl-12" placeholder="STK Push Passkey"
                              value={formData.mpesa_passkey} onChange={(e) => setFormData({...formData, mpesa_passkey: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Consumer Key</label>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="password" className="input-field pl-12" placeholder="Daraja Consumer Key"
                            value={formData.mpesa_consumer_key} onChange={(e) => setFormData({...formData, mpesa_consumer_key: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Consumer Secret</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="password" className="input-field pl-12" placeholder="Daraja Consumer Secret"
                            value={formData.mpesa_consumer_secret} onChange={(e) => setFormData({...formData, mpesa_consumer_secret: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Callback URL</label>
                        <input
                          type="url" className="input-field" placeholder="https://your-domain.com/mpesa/callback/"
                          value={formData.mpesa_callback_url} onChange={(e) => setFormData({...formData, mpesa_callback_url: e.target.value})}
                        />
                        <p className="text-[10px] text-slate-400 mt-2 italic">Leave empty to use platform default.</p>
                      </div>

                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex gap-3">
                         <AlertCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                         <p className="text-[11px] text-emerald-800 font-medium">Your credentials are encrypted for security. Once saved, they are protected by AES-256 encryption.</p>
                      </div>
                    </div>
                  </SoftGate>
                </div>
              </div>
            )}

            {/* Delivery Settings Tab */}
            {activeTab === 'Delivery Settings' && (
              <div className="space-y-8">
                {/* Legacy / Simple Fee Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Legacy Delivery Fee (KSh)</label>
                    <div className="relative">
                      <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number" className="input-field pl-12"
                        value={formData.delivery_fee} onChange={(e) => setFormData({...formData, delivery_fee: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Radius (km)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number" className="input-field pl-12" placeholder="e.g. 7"
                        value={formData.delivery_radius_km} onChange={(e) => setFormData({...formData, delivery_radius_km: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Distance Based Pricing */}
                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <Truck size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">Dynamic Distance-Based Pricing</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Calculate fees based on the customer's distance from your shop. This ensures fair pricing for far-away deliveries.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Base Fee (KSh)</label>
                      <input
                        type="number" className="input-field"
                        value={formData.base_delivery_fee} onChange={(e) => setFormData({...formData, base_delivery_fee: e.target.value})}
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Starting fee for every order.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Base Distance (km)</label>
                      <input
                        type="number" className="input-field"
                        value={formData.base_distance_km} onChange={(e) => setFormData({...formData, base_distance_km: e.target.value})}
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Distance covered by base fee.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Surcharge / km</label>
                      <input
                        type="number" className="input-field"
                        value={formData.extra_distance_surcharge} onChange={(e) => setFormData({...formData, extra_distance_surcharge: e.target.value})}
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Extra charge per km beyond base.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    <p className="text-[11px] text-slate-500 font-medium">
                      Example: If Base is KSh {formData.base_delivery_fee} for {formData.base_distance_km}km and Surcharge is KSh {formData.extra_distance_surcharge}/km, a 5km delivery will cost KSh {Number(formData.base_delivery_fee) + (5 - Number(formData.base_distance_km)) * Number(formData.extra_distance_surcharge)}.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> Radius Note
                  </h4>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Your store will only be visible to customers within this radius from your physical GPS coordinates.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="py-10 text-center text-slate-400">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium font-bold uppercase tracking-widest text-[10px]">Real-time system alerts enabled</p>
              </div>
            )}
          </div>

          {/* Sidebar Preview */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Store Profile Preview</h4>
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden sticky top-24">
                <div className="h-20 bg-slate-50 relative overflow-hidden" style={{ backgroundColor: formData.primary_color + '10' }}>
                   <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                      <Store size={80} style={{ color: formData.primary_color }} />
                   </div>
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2 border border-slate-50">
                      <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center" style={{ color: formData.primary_color }}>
                         <Store size={24} />
                      </div>
                   </div>
                </div>
                <div className="pt-10 pb-6 px-6 text-center">
                   <h5 className="text-lg font-black text-slate-900 mb-1">{formData.name || 'Store Name'}</h5>
                   <p className="text-[10px] text-slate-400 mb-4 px-4 font-medium italic">{formData.tagline || 'Your store tagline'}</p>
                   <div className="space-y-3 text-left border-t border-slate-50 pt-4">
                      <div className="flex items-start gap-2">
                         <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                         <span className="text-[11px] text-slate-600 font-medium leading-relaxed">{formData.address_string || 'Address not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Phone size={14} className="text-slate-400 shrink-0" />
                         <span className="text-[11px] text-slate-600 font-medium">{formData.phone || 'Phone not set'}</span>
                      </div>
                   </div>
                   <div className="mt-6 pt-4 border-t border-slate-50">
                      <div className="w-full py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: formData.primary_color }}>
                         Order Now
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
