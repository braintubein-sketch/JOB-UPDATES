'use client';

import Link from 'next/link';
import { Calendar, Building2, ExternalLink, ChevronRight, MapPin } from 'lucide-react';

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
    return (
        <div className="card-premium h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <span className={`badge ${job.category === 'Govt' ? 'badge-govt' : 'badge-private'}`}>
                    {job.category}
                </span>
                <div className="text-secondary" style={{ opacity: 0.5 }}>
                    <ExternalLink size={14} />
                </div>
            </div>

            <Link href={`/jobs/${job.slug}`} className="flex-1" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 className="mb-4 line-clamp-2" style={{ fontSize: '18px', fontWeight: 700, minHeight: '52px' }}>
                    {job.title}
                </h3>

                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <Building2 size={14} />
                        <span className="font-medium truncate">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <MapPin size={14} />
                        <span>All India</span>
                    </div>
                </div>
            </Link>

            <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <Calendar size={12} />
                    {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <Link href={`/jobs/${job.slug}`} className="flex items-center gap-1 text-sm font-bold" style={{ textDecoration: 'none', color: 'var(--primary)' }}>
                    Details <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
