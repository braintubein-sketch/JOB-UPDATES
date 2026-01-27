'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import JobCard, { JobCardSkeleton } from '@/components/jobs/JobCard';
import { Job } from '@/types';

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs?limit=6&featured=true');
                const data = await res.json();
                if (data.success) {
                    setJobs(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">
                            <TrendingUp className="w-4 h-4" />
                            <span>High Priority</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                            Featured <span className="gradient-text italic">Picks</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium">
                            The most exclusive tech roles from India&apos;s leading unicorns and global GICs.
                        </p>
                    </div>

                    <Link
                        href="/jobs?featured=true"
                        className="group flex items-center gap-4 font-black text-primary hover:gap-6 transition-all uppercase tracking-tighter"
                    >
                        EXPLORE ALL FEATURED
                        <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/20">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </motion.div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))
                    ) : jobs.length > 0 ? (
                        jobs.map((job, index) => (
                            <JobCard key={job._id} job={job} index={index} featured />
                        ))
                    ) : (
                        <div className="col-span-full glass p-20 text-center rounded-[3rem] border-dashed border-2 border-border">
                            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
                            <h3 className="text-2xl font-black mb-2">Refining Selection...</h3>
                            <p className="text-muted-foreground font-medium text-lg max-w-sm mx-auto">We are currently curating the next batch of elite featured opportunities.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
