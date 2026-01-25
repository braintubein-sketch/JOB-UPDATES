'use client';

import Link from 'next/link';
import { Calendar, Building2, MapPin, ArrowUpRight, ShieldCheck, Bookmark } from 'lucide-react';

interface JobCardProps {
    job: {
        id: string;
        slug: string;
        title: string;
        organization: string;
        category: string;
        state?: string;
        updatedAt: string;
    };
}

const JobCard = ({ job }: JobCardProps) => {
    const badgeClass = job.category === 'Govt' ? 'badge-govt' :
        job.category === 'Result' ? 'badge-result' : 'badge-private';

    return (
        <div className="card-premium group h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <span className={`badge ${badgeClass}`}>
                    <ShieldCheck size={12} />
                    {job.category}
                </span>
                <button className="text-slate-400 hover:text-primary-600 transition-colors">
                    <Bookmark size={18} />
                </button>
            </div>

            {/* Title */}
            <Link href={`/jobs/${job.slug}`} className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                    {job.title}
                </h3>

                {/* Meta Info */}
                <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                        <Building2 size={15} className="text-primary-500" />
                        <span className="truncate font-medium">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin size={15} className="text-primary-500" />
                        <span>{job.state || 'All India'}</span>
                    </div>
                </div>
            </Link>

            {/* Footer */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={13} />
                    <span className="font-medium">
                        {new Date(job.updatedAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short'
                        })}
                    </span>
                </div>
                <Link
                    href={`/jobs/${job.slug}`}
                    className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"
                >
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
