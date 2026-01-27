'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutGrid, Code2, Database, Bot, Cloud, Terminal, Shield, TestTube, Smartphone, Shapes, Network, Cpu, Globe, Braces } from 'lucide-react';
import { JOB_CATEGORIES } from '@/types';

const categoryIcons: Record<string, any> = {
    'Software Engineer': Code2,
    'Systems Engineer': Cpu,
    'Data Engineer': Database,
    'AI/ML Engineer': Bot,
    'Cloud Engineer': Cloud,
    'DevOps Engineer': Terminal,
    'Cybersecurity': Shield,
    'QA/Testing': TestTube,
    'Frontend Developer': Globe,
    'Backend Developer': Braces,
    'Full Stack Developer': Shapes,
    'Mobile Developer': Smartphone,
    'Other IT Roles': Network,
};

export default function JobCategories() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">
                        <LayoutGrid className="w-4 h-4" />
                        <span>Infinite Paths</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 text-foreground">
                        Explore by <span className="gradient-text italic">Verticals</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Precision-targeted categories to help you navigate through 5,000+ elite tech opportunities.
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {JOB_CATEGORIES.map((category, index) => {
                        const Icon = categoryIcons[category] || Code2;
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/jobs?category=${encodeURIComponent(category)}`}
                                    className="group flex flex-col items-center justify-center p-6 md:p-10 rounded-[2.5rem] bg-secondary/50 border border-border hover:border-primary/50 hover:bg-primary/[0.02] transition-all hover:-translate-y-2"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/20">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-sm md:text-base font-black text-center tracking-tight leading-tight uppercase group-hover:text-primary transition-colors">
                                        {category.split(' ').map((w, i) => i === 0 ? w : <span key={i} className="block text-[10px] text-muted-foreground opacity-60 font-bold tracking-widest">{w}</span>)}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
