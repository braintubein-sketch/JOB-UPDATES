'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
        <div className="card">
            <div className="badge">{job.category}</div>
            <h3 className="mb-8 line-clamp-2" style={{ fontSize: '20px', minHeight: '56px' }}>{job.title}</h3>
            <div className="mt-24">
                <div className="text-sm font-semibold">{job.organization}</div>
                <div className="text-secondary text-xs">{job.qualification}</div>
            </div>
            <div className="mt-24 pt-16 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                <Link href={`/jobs/${job.slug}`} className="btn-link text-sm flex items-center gap-1 font-semibold">
                    View Detail <ArrowUpRight size={14} />
                </Link>
                <div className="text-secondary text-xs">
                    {new Date(job.createdAt).toLocaleDateString()}
                </div>
            </div>
            <style jsx>{`
        .pt-16 { padding-top: 16px; }
        .gap-1 { gap: 4px; }
      `}</style>
        </div>
    );
};

export default JobCard;
