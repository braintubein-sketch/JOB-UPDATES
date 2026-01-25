'use client';

import Link from 'next/link';
import { Calendar, Building2, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface JobCardProps {
    job: {
        id: string;
        slug: string;
        title: string;
        organization: string;
        category: string;
        source: string;
        updatedAt: string;
    };
}

const JobCard = ({ job }: JobCardProps) => {
    return (
        <div className="card-stack h-full flex flex-col group">
            <div className="flex justify-between items-start mb-6">
                <span className={`p-badge ${job.category === 'Govt' ? 'p-badge-govt' : 'p-badge-accent'}`}>
                    {job.category}
                </span>
                <div className="text-secondary opacity-40 group-hover:text-primary group-hover:opacity-100 transition-all">
                    <ShieldCheck size={18} />
                </div>
            </div>

            <Link href={`/jobs/${job.slug}`} className="flex-1">
                <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {job.title}
                </h3>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm font-semibold text-secondary">
                        <Building2 size={16} />
                        <span className="truncate">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-secondary">
                        <MapPin size={16} />
                        <span>All India</span>
                    </div>
                </div>
            </Link>

            <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Released</span>
                    <span className="text-sm font-bold">{new Date(job.updatedAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/jobs/${job.slug}`} className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
