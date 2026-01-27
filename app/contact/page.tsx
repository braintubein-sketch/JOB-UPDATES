'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, Phone, Info } from 'lucide-react';

export default function ContactPage() {
    const [status, setStatus] = useState<null | 'success'>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setStatus('success');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12">
                <div className="container-main text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Contact <span className="text-blue-600">Support</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                        Need help or have suggestions? Reach out to us.
                    </p>
                </div>
            </div>

            <div className="container-main py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12">

                        {/* Info Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Support Channels</h2>

                            <div className="flex items-start gap-4">
                                <Mail className="text-blue-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide">Email</h3>
                                    <p className="text-slate-500 text-sm">support@jobupdates.site</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="text-blue-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide">Call Support</h3>
                                    <p className="text-slate-500 text-sm">+91 88846 24741 (10 AM - 6 PM)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="text-blue-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide">Location</h3>
                                    <p className="text-slate-500 text-sm">Hyderabad, Telangana, India</p>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                                <div className="flex gap-2 text-blue-600 mb-2">
                                    <Info size={18} />
                                    <span className="font-bold text-sm">Response Time</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    We typically respond to emails within 24 working hours. Ensure to provide your contact number if you prefer a call back.
                                </p>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
                                {status === 'success' ? (
                                    <div className="py-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                                            <Send size={32} />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Message Received!</h2>
                                        <p className="text-slate-500 text-sm">Our team will review and get back to you soon.</p>
                                        <button
                                            onClick={() => setStatus(null)}
                                            className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
                                                <input required type="text" className="input text-sm" placeholder="Your Full Name" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                                                <input required type="email" className="input text-sm" placeholder="email@address.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                            <select className="select text-sm">
                                                <option>General Support</option>
                                                <option>Job Listing Issue</option>
                                                <option>Bug Report</option>
                                                <option>Feedback</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message</label>
                                            <textarea required rows={4} className="input text-sm py-2 resize-none" placeholder="How can we help?"></textarea>
                                        </div>
                                        <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                                            <MessageSquare size={18} />
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
