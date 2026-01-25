'use client';

import Link from 'next/link';
import { Calendar, Building2, ExternalLink, GraduationCap, ChevronRight, Bookmark, ArrowUpRight } from 'lucide-react';

interface Job {
    id: string;
    slug: string;
    title: string;
    organization: string;
    qualification: string;
    category: string;
    createdAt: string;
}

const JobCard = ({ job }: { job: Job }) => {
    const dateStr = new Date(job.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="premium-card h-full flex flex-col group relative overflow-hidden">
            {/* Decorative Gradient Background on Hover */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-8">
                <span className={`lux-badge ${job.category === 'Govt' ? 'lux-badge-primary' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                    {job.category}
                </span>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-bg-color hover:text-primary transition-all">
                    <Bookmark size={20} />
                </button>
            </div>

            <Link href={`/jobs/${job.slug}`} className="flex-1">
                <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {job.title}
                </h3>

                <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-text-muted">
                        <div className="w-8 h-8 rounded-lg bg-bg-color flex items-center justify-center">
                            <Building2 size={16} />
                        </div>
                        <span className="font-semibold text-sm truncate">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted">
                        <div className="w-8 h-8 rounded-lg bg-bg-color flex items-center justify-center">
                            <GraduationCap size={16} />
                        </div>
                        <span className="font-semibold text-sm truncate">{job.qualification}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted">
                        <div className="w-8 h-8 rounded-lg bg-bg-color flex items-center justify-center">
                            <Calendar size={16} />
                        </div>
                        <span className="font-semibold text-sm">{dateStr}</span>
                    </div>
                </div>
            </Link>

            <div className="pt-8 border-t border-border-light flex items-center justify-between">
                <Link href={`/jobs/${job.slug}`} className="text-sm font-bold text-primary flex items-center gap-1 group/btn">
                    Detailed Full Profile
                    <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </Link>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <ExternalLink size={18} />
                </div>
            </div>
        </div>
    );
};

export default JobCard;
