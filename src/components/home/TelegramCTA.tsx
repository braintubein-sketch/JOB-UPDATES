'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, Users, Bell, Zap, CheckCircle2, Globe, Sparkles } from 'lucide-react';

const benefits = [
    { icon: Bell, text: 'Real-time Alerts' },
    { icon: Zap, text: 'Early Application access' },
    { icon: Users, text: '50K+ Professionals' },
    { icon: CheckCircle2, text: '100% Verified Posts' },
];

export default function TelegramCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative glass rounded-[3rem] p-8 md:p-20 overflow-hidden border-primary/20 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
                    {/* Background Orbs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-8 border border-primary/20">
                                <Sparkles className="w-4 h-4 fill-primary" />
                                <span>Premium Community</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                                Jobs on the <br />
                                <span className="gradient-text italic">Fast Lane</span>
                            </h2>

                            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
                                Join our elite Telegram community and get the industry&apos;s most sought-after job alerts delivered straight to your device.
                                No noise, just opportunities.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                {benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <benefit.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-sm">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/telegram"
                                className="w-full sm:w-auto btn-primary !h-16 !px-12 text-lg font-black italic shadow-2xl shadow-primary/30"
                            >
                                <Send className="w-5 h-5 mr-3" />
                                JOIN THE CHANNEL
                            </Link>
                        </motion.div>

                        {/* Visual Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="hidden md:flex justify-center"
                        >
                            <div className="relative pt-10">
                                {/* Phone Shell */}
                                <div className="w-[300px] h-[600px] bg-secondary border-8 border-border rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                    <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden flex flex-col">
                                        {/* App Header */}
                                        <div className="bg-primary/10 border-b border-border p-5 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                                <Send className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black tracking-tight leading-none text-foreground uppercase text-sm">JOB UPDATES</p>
                                                <p className="text-[10px] font-bold text-muted-foreground tracking-widest mt-1 uppercase">Official Channel</p>
                                            </div>
                                        </div>

                                        {/* Mock Feed */}
                                        <div className="flex-1 p-4 space-y-4">
                                            {[
                                                { comp: "GOOGLE", title: "Cloud Architect", loc: "Bangalore" },
                                                { comp: "META", title: "Product Designer", loc: "Remote" },
                                                { comp: "CRED", title: "Backend Engineer", loc: "Mumbai" },
                                            ].map((msg, i) => (
                                                <div key={i} className="bg-secondary/50 border border-border rounded-2xl p-4 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-primary tracking-widest">{msg.comp}</span>
                                                        <span className="text-[10px] text-muted-foreground">Recent</span>
                                                    </div>
                                                    <p className="font-black tracking-tight text-sm mb-1">{msg.title}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        <Globe className="w-3 h-3" />
                                                        {msg.loc}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Badge Overlay */}
                                <div className="absolute -top-4 -right-8 glass !p-6 rounded-[2rem] shadow-2xl animate-float border-primary/20">
                                    <div className="text-3xl font-black text-primary leading-none">50K+</div>
                                    <div className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mt-1">Subscribed</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
