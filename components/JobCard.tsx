'use client';

import Link from 'next/link';
import { Calendar, Building2, ExternalLink, GraduationCap, ChevronRight, Bookmark } from 'lucide-react';

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
        <div className="premium-card h-full flex flex-col group">
            <div className="flex justify-between items-start mb-6">
                <span className={`p-badge ${job.category === 'Govt' ? 'p-badge-govt' : 'p-badge-accent'}`}>
                    {job.category}
                </span>
                <button className="text-secondary hover:text-primary transition-colors">
                    <Bookmark size={18} />
                </button>
            </div>

            <Link href={`/jobs/${job.slug}`} className="flex-1">
                <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {job.title}
                </h3>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-secondary text-sm">
                        <Building2 size={16} />
                        <span className="font-medium truncate">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-3 text-secondary text-sm">
                        <GraduationCap size={16} />
                        <span className="font-medium truncate">{job.qualification}</span>
                    </div>
                    <div className="flex items-center gap-3 text-secondary text-sm">
                        <Calendar size={16} />
                        <span className="font-medium">{dateStr}</span>
                    </div>
                </div>
            </Link>

            <div className="pt-6 border-t border-border-soft flex items-center justify-between mt-auto">
                <Link href={`/jobs/${job.slug}`} className="btn-premium btn-outline text-xs px-4 py-2 flex items-center gap-1 group/btn">
                    View Notification
                    <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={14} className="text-primary" />
                </div>
            </div>
        </div>
    );
};

export default JobCard;
