import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Last Updated: August 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm space-y-10 text-slate-600 dark:text-slate-400 leading-relaxed">

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <Eye size={20} className="text-primary" />
                            1. Introduction
                        </h2>
                        <p>
                            Welcome to Tipsy Theoryy ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to our mobile application and merchant dashboard.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <FileText size={20} className="text-primary" />
                            2. Information We Collect
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase mb-2">Location Data</h3>
                                <p className="text-xs">We collect precise location data for Riders to facilitate real-time delivery tracking and for Customers to ensure delivery accuracy within our service zones.</p>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase mb-2">Payment Info</h3>
                                <p className="text-xs">We process M-Pesa transaction details to confirm payments. We use high-level encryption for all sensitive business credentials.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <Lock size={20} className="text-primary" />
                            3. Age Verification
                        </h2>
                        <p>
                            As a service facilitating liquor delivery, we require age verification. This may include capturing temporary images of identification documents (Midnight Mirror), which are encrypted and used solely for legal compliance.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <Shield size={20} className="text-primary" />
                            4. Data Security
                        </h2>
                        <p>
                            We implement industry-standard security measures, including SSL Pinning and AES-256 encryption, to protect your data from unauthorized access or disclosure.
                        </p>
                    </section>

                    <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Contact Us</h2>
                        <p className="text-xs">If you have questions about this policy, please contact us at support@tipsytheoryy.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
