import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Wine } from 'lucide-react';
import { auth } from '../api';
import LegalModal from '../components/LegalModal';
import { legalTexts } from '../constants/legalTexts';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Legal Modal State
  const [legalModal, setLegalModal] = useState({ isOpen: false, title: '', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await auth.login({
        username: formData.email, // backend expects username (phone/email)
        password: formData.password
      });
      localStorage.setItem('access_token', data.access);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const openLegal = (type) => {
    if (type === 'privacy') {
      setLegalModal({ isOpen: true, title: 'Privacy Policy', content: legalTexts.privacyPolicy });
    } else {
      setLegalModal({ isOpen: true, title: 'Terms of Service', content: legalTexts.merchantTerms });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
        title={legalModal.title}
        content={legalModal.content}
      />

      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {/* Pattern placeholder */}
            <div className="grid grid-cols-6 gap-4 transform -rotate-12 scale-150">
                {[...Array(24)].map((_, i) => (
                    <Wine key={i} size={80} className="text-white" />
                ))}
            </div>
        </div>

        <div className="relative z-10 text-white max-w-md">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Wine className="text-primary" size={28} />
                </div>
                <h1 className="text-3xl font-bold">TipsyTheoryy</h1>
            </div>

            <h2 className="text-5xl font-extrabold leading-tight mb-6">
                Manage Your Liquor Store Digitally
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-8" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500">Sign in to your TipsyTheoryy Merchant Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-12 pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span className="text-sm text-slate-600">Remember Me</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary hover:text-primary-dark">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-bold text-primary hover:text-primary-dark">
              Sign up
            </a>
          </p>

          <div className="mt-20 flex justify-center gap-6 text-xs text-slate-400 font-medium uppercase tracking-widest">
             <span className="opacity-50">TipsyTheoryy © 2026</span>
             <button onClick={() => openLegal('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
             <button onClick={() => openLegal('terms')} className="hover:text-primary transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
