'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MapPin,
    Briefcase,
    Clock,
    Building2,
    ExternalLink,
    Zap,
    Verified,
    Eye,
    ChevronRight,
} from 'lucide-react';
import { Job } from '@/types';
import { formatRelativeDate, formatExperience, formatLocations } from '@/lib/utils';

interface JobCardProps {
    job: Job;
    index?: number;
    featured?: boolean;
}

export default function JobCard({ job, index = 0, featured = false }: JobCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative card-premium ${featured ? 'border-primary/50 bg-primary/[0.02]' : ''}`}
        >
            {/* Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Row: Company & Status */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4 flex-1">
                    <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-secondary border border-border flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500">
                        {job.companyLogo ? (
                            <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <Building2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer capitalize">
                                {job.company}
                            </span>
                            {job.isVerified && <Verified className="w-4 h-4 text-primary" />}
                        </div>
                        <Link href={`/jobs/${job.slug}`}>
                            <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                                {job.title}
                            </h3>
                        </Link>
                    </div>
                </div>

                <div className="flex shrink-0 items-center sm:items-end gap-2">
                    {job.isRecent && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                            <Zap className="w-3 h-3 fill-white" />
                            New
                        </div>
                    )}
                </div>
            </div>

            {/* Metas Row: Location, Exp, Type */}
            <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    {formatLocations(job.locations)}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-primary/60" />
                    {formatExperience(job.experience.min, job.experience.max)}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary/60" />
                    {formatRelativeDate(job.postedDate)}
                </div>
            </div>

            {/* Bottom Row: Skills & Action */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, i) => (
                        <div
                            key={skill}
                            className="px-4 py-1.5 bg-secondary border border-border rounded-full text-[11px] font-black text-foreground shadow-sm group-hover:border-primary/30 transition-colors"
                        >
                            {skill}
                        </div>
                    ))}
                    {job.skills.length > 3 && (
                        <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[11px] font-black text-primary">
                            +{job.skills.length - 3}
                        </div>
                    )}
                </div>

                <Link
                    href={`/jobs/${job.slug}`}
                    className="flex items-center justify-center sm:justify-end gap-2 font-black text-sm text-primary hover:gap-4 transition-all bg-primary/5 sm:bg-transparent py-3 sm:py-0 rounded-2xl border border-primary/10 sm:border-0"
                >
                    VIEW JOB
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}

export function JobCardSkeleton() {
    return (
        <div className="card-premium animate-pulse">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-secondary" />
                <div className="flex-1 space-y-3 pt-2">
                    <div className="h-4 w-24 bg-secondary rounded-full" />
                    <div className="h-7 w-48 bg-secondary rounded-xl" />
                </div>
            </div>
            <div className="flex gap-4 mb-8">
                <div className="h-5 w-32 bg-secondary rounded-full" />
                <div className="h-5 w-24 bg-secondary rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-border/50">
                <div className="flex gap-2">
                    <div className="h-8 w-16 bg-secondary rounded-full" />
                    <div className="h-8 w-16 bg-secondary rounded-full" />
                </div>
                <div className="h-6 w-24 bg-secondary rounded-full" />
            </div>
        </div>
    );
}
