'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, ArrowRight, Zap, Globe } from 'lucide-react';

const topCompanies = [
    { name: 'Google', jobCount: 45, color: 'from-blue-500 to-green-500' },
    { name: 'Microsoft', jobCount: 38, color: 'from-blue-600 to-cyan-400' },
    { name: 'Amazon', jobCount: 52, color: 'from-orange-500 to-yellow-500' },
    { name: 'Meta', jobCount: 28, color: 'from-blue-500 to-purple-500' },
    { name: 'Apple', jobCount: 22, color: 'from-gray-600 to-gray-400' },
    { name: 'Netflix', jobCount: 15, color: 'from-red-600 to-red-400' },
    { name: 'Infosys', jobCount: 120, color: 'from-blue-700 to-blue-500' },
    { name: 'TCS', jobCount: 95, color: 'from-purple-600 to-pink-500' },
    { name: 'Wipro', jobCount: 78, color: 'from-teal-500 to-green-400' },
    { name: 'Accenture', jobCount: 85, color: 'from-purple-700 to-purple-500' },
    { name: 'Flipkart', jobCount: 32, color: 'from-yellow-500 to-blue-500' },
    { name: 'Swiggy', jobCount: 18, color: 'from-orange-600 to-orange-400' },
];

export default function TopCompanies() {
    return (
        <section className="py-24 relative overflow-hidden bg-secondary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20"
                >
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">
                            <Globe className="w-4 h-4" />
                            <span>Global Network</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                            Top <span className="gradient-text italic">Partners</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl">
                            We collaborate with the world&apos;s most innovative companies to bring you elite tech roles.
                        </p>
                    </div>

                    <Link
                        href="/companies"
                        className="btn-primary !rounded-[2rem] !px-10 h-16 flex items-center gap-3 font-black text-lg italic shadow-xl shadow-primary/20"
                    >
                        VIEW ALL PARTNERS
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                {/* Companies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                    {topCompanies.map((company, index) => (
                        <motion.div
                            key={company.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Link
                                href={`/jobs?company=${encodeURIComponent(company.name)}`}
                                className="group block glass !p-4 md:!p-8 rounded-3xl md:rounded-[2.5rem] border border-border/50 hover:border-primary/50 hover:bg-primary/[0.02] transition-all hover:-translate-y-2 text-center"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-secondary border border-border flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-sm group-hover:border-primary/50 transition-colors">
                                    <Building2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">
                                    {company.name}
                                </h3>
                                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <Zap className="w-3 h-3 text-primary animate-pulse" />
                                    {company.jobCount} Jobs
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
