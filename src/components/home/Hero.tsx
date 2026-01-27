'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Briefcase, Zap, ShieldCheck, Globe } from 'lucide-react';
import SearchBar from '@/components/jobs/SearchBar';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
            {/* Ultra Premium Background Elements */}
            <div className="absolute inset-0 bg-mesh opacity-40" />

            {/* Animated Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-float" />

            <div className="relative max-w-7xl mx-auto text-center">
                {/* Value Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border-primary/20 text-primary text-sm font-black mb-8 tracking-widest uppercase"
                >
                    <Zap className="w-4 h-4 fill-primary" />
                    <span>India&apos;s Fastest Job Portal</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8"
                >
                    Unlock Your <br />
                    <span className="gradient-text italic">Next Chapter</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                >
                    Premium IT opportunities handpicked for the top 1% tech talent.
                    From high-growth startups to global tech giants.
                </motion.p>

                {/* Main Action Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 w-full max-w-4xl mx-auto glass rounded-[2.5rem] p-4 md:p-6 mb-12 shadow-2xl"
                >
                    <Suspense fallback={<div className="h-16 w-full animate-pulse bg-secondary/50 rounded-full" />}>
                        <SearchBar />
                    </Suspense>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
                >
                    {[
                        { icon: Briefcase, label: "5,000+ Jobs", color: "text-blue-500" },
                        { icon: Globe, label: "Remote First", color: "text-green-500" },
                        { icon: ShieldCheck, label: "100% Verified", color: "text-purple-500" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color}`}>
                                <item.icon className="w-5 h-5 shadow-sm" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Trending Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                    <span className="text-sm font-bold text-muted-foreground mr-2">Top Picks:</span>
                    {['React', 'Next.js', 'Rust', 'AI/ML', 'DevOps'].map((tag) => (
                        <Link
                            key={tag}
                            href={`/jobs?q=${encodeURIComponent(tag)}`}
                            className="tag rounded-2xl px-5 py-2 font-bold hover:bg-primary hover:text-white transition-all"
                        >
                            {tag}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
