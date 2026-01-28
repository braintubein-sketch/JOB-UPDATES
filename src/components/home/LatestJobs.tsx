'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import JobCard, { JobCardSkeleton } from '@/components/jobs/JobCard';
import { Job } from '@/types';

export default function LatestJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs?limit=15&sortBy=postedDate&sortOrder=desc');
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
            {/* Decoration */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">
                            <Sparkles className="w-4 h-4 fill-primary" />
                            <span>Curated Opportunities</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                            Fresh <span className="gradient-text italic">Openings</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium">
                            Discover the latest roles at companies like Google, Microsoft, and high-growth Indian startups.
                        </p>
                    </div>
                    <Link
                        href="/jobs"
                        className="group flex items-center gap-3 font-black text-primary hover:gap-5 transition-all"
                    >
                        VIEW ALL JOBS
                        <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </motion.div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))
                    ) : jobs.length > 0 ? (
                        jobs.map((job, index) => (
                            <JobCard key={job._id} job={job} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full glass p-20 text-center rounded-[3rem]">
                            <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
                            <h3 className="text-2xl font-black mb-2">Powering Up...</h3>
                            <p className="text-muted-foreground font-medium text-lg">New jobs are being handpicked as we speak. Check back in a few minutes!</p>
                        </div>
                    )}
                </div>

                {/* Mobile View All */}
                <div className="md:hidden">
                    <Link href="/jobs" className="btn-primary w-full h-16 rounded-3xl text-lg font-black italic">
                        BROWSE ALL JOBS
                    </Link>
                </div>
            </div>
        </section>
    );
}
