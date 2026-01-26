import Link from 'next/link';
import { MapPin, Calendar, Building2, ChevronRight, Briefcase } from 'lucide-react';

interface JobCardProps {
    job: {
        id: string;
        title: string;
        organization: string;
        location: string;
        lastDate?: string | Date;
        slug: string;
        category: string;
        qualification?: string;
        experience?: string;
    };
    showCountdown?: boolean;
}

export default function JobCard({ job }: JobCardProps) {
    const formattedDate = job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }) : 'Click to see';

    return (
        <div className="job-card group animate-premium overflow-hidden">
            {/* Category Badge */}
            <span className={`badge-premium ${job.category === 'Govt' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                job.category === 'Private' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                {job.category}
            </span>

            {/* Main Link - This makes the ENTIRE card clickable */}
            <Link href={`/jobs/${job.slug}`} className="card-anchor">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                    {job.title}
                </h3>
            </Link>

            <div className="flex flex-col gap-3 mt-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-primary-600 dark:text-primary-400" />
                    <span className="font-bold uppercase tracking-tight text-slate-700 dark:text-slate-300">{job.organization}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="shrink-0" />
                        <span className="truncate">{job.location || 'India'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase size={16} className="shrink-0" />
                        <span className="truncate">{job.experience || 'Not Required'}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Last Date to Apply</span>
                    <span className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                        <Calendar size={14} /> {formattedDate}
                    </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-primary-600/5 dark:bg-primary-400/10 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 dark:group-hover:bg-primary-400 group-hover:text-white dark:group-hover:text-slate-950 transition-all duration-300">
                    <ChevronRight size={20} />
                </div>
            </div>
        </div>
    );
}
