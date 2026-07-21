import React, { useState, useEffect } from 'react';
import {
  Store, CreditCard, Truck, Bell,
  Save, Phone, Mail, MapPin, Clock,
  ShieldCheck, AlertCircle, CheckCircle2,
  Building2, Hash, UserCircle, Key, Lock,
  FileText, Info, ShieldAlert, Send, Wallet, Plus, X
} from 'lucide-react';
import { partner } from '../api';
import SoftGate from '../components/SoftGate';
import { legalTexts } from '../constants/legalTexts';
import { SettingsSkeleton } from '../components/Skeleton';
import { useLocation, useNavigate } from 'react-router-dom';

const SettingsTab = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [branchForm, setBranchForm] = useState({
    name: '',
    address_string: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    delivery_radius_km: 7
  });
  const [branchLoading, setBranchLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('action') === 'add-branch') {
      setShowAddBranch(true);
      // Clean up URL
      navigate('/settings', { replace: true });
    }
  }, [location]);

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

    accepts_wallet_payments: true,

    // Notifications (Frontend state, usually handled by push/fcm token)
    notifications_enabled: true,
    email_notifications: true,
    telegram_chat_id: ''
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

        telegram_chat_id: data.telegram_chat_id || '',

        accepts_wallet_payments: data.accepts_wallet_payments ?? true,

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

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setBranchLoading(true);
    try {
      await partner.createBranch(branchForm);
      setMessage({ type: 'success', text: 'New branch created successfully! Switch to it in the header.' });
      setShowAddBranch(false);
      // Refresh page to update switcher
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create branch');
    } finally {
      setBranchLoading(false);
    }
  };

  const captureBranchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setBranchForm({
        ...branchForm,
        latitude: parseFloat(pos.coords.latitude.toFixed(6)),
        longitude: parseFloat(pos.coords.longitude.toFixed(6)),
        // Auto-fill address if empty to satisfy 'required' field
        address_string: branchForm.address_string || "Captured Location (GPS)"
      });
      alert('Location captured!');
    }, (err) => {
      alert("Error capturing location: " + err.message);
    });
  };

  const tabs = [
    { label: 'Store Information', icon: Store },
    { label: 'Payment Settings', icon: CreditCard },
    { label: 'Delivery Settings', icon: Truck },
    { label: 'Notifications', icon: Bell },
    { label: 'Legal & About', icon: FileText },
  ];

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col md:flex-row gap-5">
        <aside className="w-full md:w-56 space-y-1.5">
          {tabs.map(tab => (
            <SettingsTab
              key={tab.label}
              {...tab}
              active={activeTab === tab.label}
              onClick={() => setActiveTab(tab.label)}
            />
          ))}
        </aside>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeTab}</h3>
                <div className="flex items-center gap-2">
                   <button
                    onClick={fetchSettings}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                   >
                     Reset
                   </button>
                   <button
                    disabled={saveLoading}
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                   >
                      {saveLoading ? 'Saving...' : <><Save size={14} /> Save</>}
                   </button>
                </div>
            </div>

            {message.text && (
              <div className={`p-3.5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 ${
                message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <p className="text-xs font-bold">{message.text}</p>
              </div>
            )}

            {/* Store Information Tab */}
            {activeTab === 'Store Information' && (
              <div className="space-y-5">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Display Name</label>
                    <input
                      type="text" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Enter store name"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tagline</label>
                    <textarea
                      rows="2" className="input-field resize-none py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Premium spirits at your doorstep"
                      value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Business Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                            <input
                              type="tel" className="input-field pl-10 py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="+254..."
                              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Support Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                            <input
                              type="email" className="input-field pl-10 py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="store@email.com"
                              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Physical Address</label>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="relative flex-1">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                          <input
                            type="text" className="input-field pl-10 py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="123 Street, City"
                            value={formData.address_string} onChange={(e) => setFormData({...formData, address_string: e.target.value})}
                          />
                      </div>
                      <button
                        onClick={captureLocation}
                        className="bg-slate-900 dark:bg-primary text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        <MapPin size={14} className="inline mr-1.5" /> GPS
                      </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Opening Hours</label>
                        <div className="flex items-center gap-2">
                            <input type="time" className="input-field py-2 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={formData.opening_time} onChange={e => setFormData({...formData, opening_time: e.target.value})} />
                            <span className="text-slate-300 dark:text-slate-700 font-bold text-xs">/</span>
                            <input type="time" className="input-field py-2 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={formData.closing_time} onChange={e => setFormData({...formData, closing_time: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Theme Color</label>
                        <input type="color" className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 overflow-hidden" value={formData.primary_color} onChange={e => setFormData({...formData, primary_color: e.target.value})} />
                    </div>
                </div>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'Payment Settings' && (
              <div className="space-y-8">
                {/* Bank Payouts Section */}
                <div className="space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <Building2 size={20} className="text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Payout Destination</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Where you receive settlements.</p>
                    </div>
                  </div>

                  <div className="space-y-4 px-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Bank Name</label>
                      <input
                        type="text" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Equity Bank, KCB"
                        value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Account Name</label>
                        <input
                          type="text" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Business Name"
                          value={formData.bank_account_name} onChange={(e) => setFormData({...formData, bank_account_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Account Number</label>
                        <input
                          type="text" className="input-field py-2.5 font-mono text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="0123456789"
                          value={formData.bank_account_number} onChange={(e) => setFormData({...formData, bank_account_number: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Daraja Section */}
                <div className="space-y-5 pt-5 border-t border-slate-50 dark:border-slate-800">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">M-Pesa Integration</h4>
                        <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">STK</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Receive payments directly to your Till.</p>
                    </div>
                  </div>

                  <SoftGate isGated={!['pro', 'enterprise', 'custom'].includes(formData.plan)} featureName="Direct M-Pesa Integration" planRequired="Pro">
                    <div className="space-y-4 px-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Shortcode</label>
                          <div className="relative">
                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                            <input
                              type="text" className="input-field pl-10 py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="174379"
                              value={formData.mpesa_shortcode} onChange={(e) => setFormData({...formData, mpesa_shortcode: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">LNM Passkey</label>
                          <input
                            type="password" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Passkey"
                            value={formData.mpesa_passkey} onChange={(e) => setFormData({...formData, mpesa_passkey: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Consumer Key</label>
                          <input
                            type="password" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Key"
                            value={formData.mpesa_consumer_key} onChange={(e) => setFormData({...formData, mpesa_consumer_key: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Consumer Secret</label>
                          <input
                            type="password" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Secret"
                            value={formData.mpesa_consumer_secret} onChange={(e) => setFormData({...formData, mpesa_consumer_secret: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20 flex gap-2">
                         <AlertCircle size={14} className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                         <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">Credentials are protected by AES-256 encryption.</p>
                      </div>
                    </div>
                  </SoftGate>
                </div>

                {/* Tipsy Wallet Control */}
                <div className="space-y-4 pt-5 border-t border-slate-50 dark:border-slate-800">
                   <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center">
                            <Wallet size={20} className="text-orange-600 dark:text-orange-400" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Accept Tipsy Wallet</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Allow customers to pay using internal credit.</p>
                         </div>
                      </div>
                      <button
                        onClick={() => setFormData({...formData, accepts_wallet_payments: !formData.accepts_wallet_payments})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.accepts_wallet_payments ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.accepts_wallet_payments ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* Delivery Settings Tab */}
            {activeTab === 'Delivery Settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Legacy Fee (KSh)</label>
                    <div className="relative">
                      <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                      <input
                        type="number" className="input-field pl-10 py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={formData.delivery_fee} onChange={(e) => setFormData({...formData, delivery_fee: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Radius (km)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                      <input
                        type="number" className="input-field pl-10 py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="7"
                        value={formData.delivery_radius_km} onChange={(e) => setFormData({...formData, delivery_radius_km: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 pt-5 border-t border-slate-50 dark:border-slate-800">
                  <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10 dark:border-primary/20 flex items-start gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <Truck size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dynamic Pricing</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Calculate fees based on customer distance.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Base Fee</label>
                      <input
                        type="number" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={formData.base_delivery_fee} onChange={(e) => setFormData({...formData, base_delivery_fee: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Base Dist.</label>
                      <input
                        type="number" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={formData.base_distance_km} onChange={(e) => setFormData({...formData, base_distance_km: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Surcharge</label>
                      <input
                        type="number" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={formData.extra_distance_surcharge} onChange={(e) => setFormData({...formData, extra_distance_surcharge: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-start gap-3">
                    <AlertCircle size={16} className="text-orange-600 dark:text-orange-400 mt-0.5" />
                    <p className="text-[10px] text-orange-700 dark:text-orange-300 font-medium leading-relaxed">
                      Your store is only visible to customers within your specified delivery radius.
                    </p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                    <Bell size={24} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Notification Channels</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">Configure how you receive order and system alerts.</p>
                  </div>
                </div>

                {/* Telegram Notifications Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="w-8 h-8 bg-[#0088cc]/10 rounded-lg flex items-center justify-center">
                       <Send size={16} className="text-[#0088cc]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Telegram Alerts</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic">Instant order & stock notifications via Telegram Bot.</p>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Your Chat ID</label>
                        <a
                          href="https://t.me/userinfobot"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] font-black text-[#0088cc] uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <Info size={10} /> Get Chat ID from @userinfobot
                        </a>
                      </div>
                      <div className="relative">
                        <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                        <input
                          type="text" className="input-field pl-10 py-3 text-xs font-mono font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                          placeholder="e.g. 5191834221"
                          value={formData.telegram_chat_id}
                          onChange={(e) => setFormData({...formData, telegram_chat_id: e.target.value})}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 ml-1 leading-relaxed">
                        To receive alerts, add your <b>Chat ID</b> and make sure you've started a chat with the <b>Tipsy Merchant Bot</b>.
                      </p>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex items-start gap-3">
                       <Info size={14} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                       <div className="space-y-1">
                          <p className="text-[10px] text-blue-900 dark:text-blue-300 font-bold">Group Notifications?</p>
                          <p className="text-[9px] text-blue-800 dark:text-blue-400 leading-relaxed font-medium">
                            If you want a group to receive alerts, add the bot to your group and use the group's Chat ID (usually starts with a minus sign, e.g. -100...).
                          </p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* System Alerts */}
                <div className="pt-5 border-t border-slate-50 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                           <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Push Notifications</p>
                           <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Browser & Mobile app notifications.</p>
                        </div>
                     </div>
                     <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Legal & About Tab */}
            {activeTab === 'Legal & About' && (
              <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="text-primary" size={20} />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">About TipsyTheoryy</h4>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                    {legalTexts.aboutUs}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-primary" size={20} />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Merchant Terms & Conditions</h4>
                  </div>
                  <div className="h-64 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                    {legalTexts.merchantTerms}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldAlert className="text-primary" size={20} />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Privacy Policy</h4>
                  </div>
                  <div className="h-64 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                    {legalTexts.privacyPolicy}
                  </div>
                </div>

                <div className="text-center py-4">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Version 1.0.0 (Kenya)</p>
                  <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-1">© 2026 TipsyTheoryy. Operated by Emmanuel Odongo.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Preview */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Store Profile Preview</h4>
             <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden sticky top-20">
                <div className="h-16 bg-slate-50 dark:bg-slate-800 relative overflow-hidden" style={{ backgroundColor: formData.primary_color + '10' }}>
                   <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                      <Store size={60} style={{ color: formData.primary_color }} />
                   </div>
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center p-1.5 border border-slate-50 dark:border-slate-800">
                      <div className="w-full h-full rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center" style={{ color: formData.primary_color }}>
                         <Store size={18} />
                      </div>
                   </div>
                </div>
                <div className="pt-8 pb-5 px-5 text-center">
                   <h5 className="text-base font-black text-slate-900 dark:text-white mb-0.5">{formData.name || 'Store Name'}</h5>
                   <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-3 px-2 font-medium italic">{formData.tagline || 'Your tagline'}</p>
                   <div className="space-y-2.5 text-left border-t border-slate-50 dark:border-slate-800 pt-3.5">
                      <div className="flex items-start gap-2">
                         <MapPin size={12} className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
                         <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{formData.address_string || 'Address...'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Phone size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                         <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{formData.phone || 'Phone...'}</span>
                      </div>
                   </div>
                   <div className="mt-5 pt-3.5 border-t border-slate-50 dark:border-slate-800">
                      <div className="w-full py-2 rounded-xl text-white text-[9px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: formData.primary_color }}>
                         Order Now
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddBranch && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Branch</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Enterprise Feature</p>
              </div>
              <button onClick={() => setShowAddBranch(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="p-6 space-y-4">
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Branch Name</label>
                  <input
                    required type="text" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. Tipsy Westlands"
                    value={branchForm.name} onChange={e => setBranchForm({...branchForm, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                  <input
                    required type="tel" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="+254..."
                    value={branchForm.phone} onChange={e => setBranchForm({...branchForm, phone: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Physical Address</label>
                  <div className="flex gap-2">
                    <input
                      required type="text" className="input-field py-2.5 text-xs font-medium flex-1 dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Street, Building..."
                      value={branchForm.address_string} onChange={e => setBranchForm({...branchForm, address_string: e.target.value})}
                    />
                    <button type="button" onClick={captureBranchLocation} className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all">
                      <MapPin size={18} />
                    </button>
                  </div>
                  {branchForm.latitude !== 0 && (
                    <p className="text-[9px] text-green-500 font-bold mt-1.5">GPS: {branchForm.latitude}, {branchForm.longitude}</p>
                  )}
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Delivery Radius (KM)</label>
                  <input
                    required type="number" className="input-field py-2.5 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    value={branchForm.delivery_radius_km} onChange={e => setBranchForm({...branchForm, delivery_radius_km: e.target.value})}
                  />
               </div>

               <button
                disabled={branchLoading}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
               >
                 {branchLoading ? 'Creating...' : 'Create Branch'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
