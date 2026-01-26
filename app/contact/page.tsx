'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    const [status, setStatus] = useState<null | 'success'>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setStatus('success');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
                <div className="container-main text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Contact <span className="text-blue-600">Support</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
                        Need help or want to suggest a feature? We're here for you.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container-main py-16">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                                Our support team is available from 10:00 AM to 6:00 PM (IST) to assist you with any portal-related queries.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Email Us</h3>
                                    <p className="text-slate-500">jobupdates.site@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Call Hours</h3>
                                    <p className="text-slate-500">+91 88846 24741</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Head Office</h3>
                                    <p className="text-slate-500">Hyderabad, Telangana, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card md:p-10 shadow-xl shadow-slate-900/5">
                        {status === 'success' ? (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                                    <Send size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                                <p className="text-slate-500">We will get back to you within 24-48 hours.</p>
                                <button onClick={() => setStatus(null)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                        <input required type="text" placeholder="Your Name" className="input" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                        <input required type="email" placeholder="example@email.com" className="input" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                    <select className="select">
                                        <option>General Inquiry</option>
                                        <option>Bug Report</option>
                                        <option>Partnership</option>
                                        <option>Content Takedown</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                    <textarea required rows={5} placeholder="How can we help you?" className="input py-3 resize-none"></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full py-4 text-lg">
                                    <MessageSquare size={18} className="mr-2" />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
