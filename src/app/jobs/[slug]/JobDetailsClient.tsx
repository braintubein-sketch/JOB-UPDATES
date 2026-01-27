'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    Clock,
    Building2,
    ExternalLink,
    Share2,
    Zap,
    Tag,
    DollarSign,
    Calendar,
    ChevronRight,
    Search,
    X,
} from 'lucide-react';
import { Job } from '@/types';
import { formatDate, formatRelativeDate, formatExperience, formatSalary } from '@/lib/utils';

export default function JobDetailsClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${slug}`);
                const data = await res.json();
                if (data.success) {
                    setJob(data.data);
                } else {
                    setError(data.error || 'Job not found');
                }
            } catch (err) {
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [slug]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${job?.title} at ${job?.company}`,
                    url,
                });
            } catch (err) { }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 animate-pulse">
                    <div className="flex-1 space-y-8">
                        <div className="h-40 glass rounded-[2.5rem]" />
                        <div className="h-96 glass rounded-[2.5rem]" />
                    </div>
                    <div className="w-full md:w-80 h-96 glass rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                        <X className="w-12 h-12 text-destructive" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight">{error || 'Job not found'}</h1>
                    <button onClick={() => router.push('/jobs')} className="btn-primary">
                        BROWSE OTHER JOBS
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Backdrop */}
            <div className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 font-black text-sm text-primary mb-12 hover:gap-4 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO EXPLORE
                    </Link>

                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-secondary border border-border flex items-center justify-center p-4 shadow-2xl">
                                {job.companyLogo ? (
                                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-black text-primary tracking-widest uppercase">{job.company}</span>
                                    {job.isRecent && (
                                        <div className="px-2 py-0.5 bg-primary text-white text-[10px] font-black uppercase rounded-full">NEW</div>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-4">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2 text-muted-foreground font-bold">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {job.locations.join(', ')}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground font-bold">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        {formatExperience(job.experience.min, job.experience.max)}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground font-bold">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {job.employmentType}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <a
                                href={job.applyLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 md:flex-none btn-primary !h-16 !px-12 text-lg font-black italic shadow-2xl shadow-primary/30"
                            >
                                APPLY NOW
                            </a>
                            <button
                                onClick={handleShare}
                                className="w-16 h-16 flex items-center justify-center rounded-3xl bg-secondary border border-border hover:border-primary transition-all shadow-xl"
                            >
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Section */}
                    <div className="flex-1 space-y-12">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { icon: DollarSign, label: "SALARY RANGE", value: job.salary ? formatSalary(job.salary.min, job.salary.max, job.salary.currency, job.salary.period) : "Competitive" },
                                { icon: Calendar, label: "POSTED ON", value: formatDate(job.postedDate) },
                                { icon: Zap, label: "VERIFIED", value: "100% Legit" },
                            ].map((item, i) => (
                                <div key={i} className="card-premium !p-6 flex items-center gap-4 bg-secondary/20">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{item.label}</div>
                                        <div className="font-black tracking-tight">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="card-premium">
                            <h2 className="text-2xl font-black italic tracking-tighter mb-8 border-b border-border pb-4 w-fit pr-8">JOB DESCRIPTION</h2>
                            <div
                                className="description-rich prose prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground font-medium text-lg"
                                dangerouslySetInnerHTML={{ __html: job.description }}
                            />
                        </div>

                        {/* Required Skills */}
                        <div className="card-premium">
                            <h2 className="text-2xl font-black italic tracking-tighter mb-8 border-b border-border pb-4 w-fit pr-8">SKILLS & TECH</h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skills.map((skill) => (
                                    <div key={skill} className="px-6 py-2.5 rounded-2xl bg-secondary border border-border font-black text-sm hover:border-primary hover:text-primary transition-all cursor-default">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-96 space-y-8">
                        {/* Company Card */}
                        <div className="card-premium sticky top-32">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-secondary border border-border flex items-center justify-center p-4 mx-auto mb-6 shadow-xl">
                                    {job.companyLogo ? (
                                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-10 h-10 text-muted-foreground" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">{job.company}</h3>
                                <p className="text-muted-foreground font-bold mt-2">Elite Recruitment Partner</p>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href={job.applyLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary w-full h-16 rounded-[2rem] text-lg font-black italic"
                                >
                                    DIRECT APPLY
                                </a>
                                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                    <div className="text-xs font-black text-primary leading-tight uppercase">Safeguarded by JOB UPDATES Security</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Floating Mobile Sticky Header (Hidden initially, shown on mobile) */}
            <AnimatePresence>
                <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] md:hidden">
                    <a
                        href={job.applyLink}
                        target="_blank"
                        className="btn-primary w-full h-16 rounded-[2rem] text-lg font-black italic shadow-[0_20px_40px_rgba(100,80,255,0.4)]"
                    >
                        APPLY ON COMPANY SITE
                    </a>
                </div>
            </AnimatePresence>
        </div>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
