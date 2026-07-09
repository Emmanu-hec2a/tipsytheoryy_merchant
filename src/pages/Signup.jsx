import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Wine, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { auth } from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    agreeTerms: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const locations = ['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await auth.signup({
        business_name: formData.storeName,
        first_name: formData.ownerName.split(' ')[0] || '',
        last_name: formData.ownerName.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        business_location: formData.location
      });
      window.location.href = '/login?signup=success';
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side Branding */}
      <div className="hidden lg:flex lg:w-1/3 bg-primary relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="relative z-10">
             <div className="flex items-center gap-3 mb-12">
                <Wine size={48} className="text-accent" />
                <h1 className="text-4xl font-bold tracking-tight">TipsyTheoryy</h1>
            </div>
            <h2 className="text-3xl font-medium opacity-90 mb-6 italic">Join TipsyTheoryy - Grow Your Business</h2>
            <div className="flex flex-col gap-6 mt-12">
                {[
                    'Multi-tenant store management',
                    'Real-time order tracking',
                    'Integrated M-Pesa payments',
                    'Detailed sales analytics'
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-accent" />
                        <span className="text-lg opacity-80">{item}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl shadow-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Store Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Wine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text" required className="input-field pl-12"
                            placeholder="Tipsy Lounge"
                            value={formData.storeName}
                            onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        />
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Owner Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text" required className="input-field pl-12"
                            placeholder="John Mwangi"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        />
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="email" required className="input-field pl-12"
                            placeholder="john@tipsylounge.co.ke"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative flex">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3">
                             <Phone size={18} className="text-slate-400" />
                             <span className="text-sm font-bold text-slate-600">+254</span>
                        </div>
                        <input
                            type="tel" required className="input-field pl-28"
                            placeholder="712 345 678"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'} required className="input-field pl-12"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    </div>
                    <div className="mt-2 flex gap-1 h-1">
                        <div className={`flex-1 rounded-full ${formData.password.length > 0 ? 'bg-green-500' : 'bg-slate-200'}`} />
                        <div className={`flex-1 rounded-full ${formData.password.length > 5 ? 'bg-green-500' : 'bg-slate-200'}`} />
                        <div className={`flex-1 rounded-full ${formData.password.length > 8 ? 'bg-green-500' : 'bg-slate-200'}`} />
                        <div className={`flex-1 rounded-full ${formData.password.length > 10 ? 'bg-green-500' : 'bg-slate-200'}`} />
                    </div>
                    <p className="text-[10px] text-green-600 font-bold mt-1 text-right">Strong password</p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="password" required className="input-field pl-12"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                        <CheckCircle2 className={`absolute right-4 top-1/2 -translate-y-1/2 ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'text-green-500' : 'text-slate-300'}`} size={18} />
                    </div>
                    <p className="text-[10px] text-green-600 font-bold mt-1 text-right">Passwords match</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Store Location <span className="text-red-500">*</span></label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                        required className="input-field pl-12 appearance-none"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    >
                        <option value="">Select Location</option>
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4">
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-slate-600 mt-6">
                Already have an account? <a href="/login" className="font-bold text-primary">Sign in</a>
            </p>

            <div className="flex items-center gap-2 justify-center mt-6">
                <input type="checkbox" checked={formData.agreeTerms} readOnly className="w-4 h-4 rounded text-primary border-slate-300" />
                <span className="text-xs text-slate-500">I agree to the <a href="#" className="underline font-medium">Terms of Service</a> and <a href="#" className="underline font-medium">Privacy Policy</a></span>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t flex justify-center gap-6 text-xs text-slate-400">
             <span>TipsyTheoryy © 2026</span>
             <a href="#" className="hover:text-slate-600">Privacy Policy</a>
             <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
