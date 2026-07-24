import React, { useState } from 'react';
import { Mail, Lock, Wine, ChevronLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import { auth } from '../api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Verify
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await auth.requestPasswordReset(email);
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await auth.verifyPasswordReset({ email, otp, password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code or reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-6 gap-8 transform rotate-12 scale-150">
            {[...Array(24)].map((_, i) => (
              <ShieldCheck key={i} size={80} className="text-primary" />
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white max-w-md text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-primary/30">
            <Lock size={40} className="text-primary" />
          </div>
          <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Security First</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            We use industry-standard encryption to protect your merchant account. Follow the steps to securely reset your credentials.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <a href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest mb-12 transition-colors">
            <ChevronLeft size={16} /> Back to Login
          </a>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tight">
              {step === 1 ? 'Forgot Password' : 'Verify Identity'}
            </h1>
            <p className="text-slate-500 font-medium">
              {step === 1
                ? "Enter your email address and we'll send you a 6-digit verification code."
                : `We've sent a code to ${email}. Please enter it below along with your new password.`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          {message && !error && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl text-sm font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequest} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="merchant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">6-Digit Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 tracking-[0.5em] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Didn't receive a code? <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline">Resend</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
