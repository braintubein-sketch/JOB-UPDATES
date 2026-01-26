import Link from 'next/link';
import { MapPin, Calendar, Building2, Banknote, Clock, Briefcase, ChevronRight } from 'lucide-react';

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
        salary?: string;
        createdAt?: string | Date;
    };
}

export default function JobCard({ job }: JobCardProps) {
    const formattedDate = job.lastDate
        ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const postedDate = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : 'Recently';

    const categoryColors: Record<string, string> = {
        'Govt': 'badge-blue',
        'Private': 'badge-green',
        'Result': 'badge-orange',
        'Admit Card': 'badge-red',
    };

    return (
        <Link href={`/jobs/${job.slug}`} className="job-card group block">
            {/* Top Row: Category & Posted Date */}
            <div className="flex items-center justify-between mb-4">
                <span className={categoryColors[job.category] || 'badge-gray'}>
                    {job.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {postedDate}
                </span>
            </div>

            {/* Job Title */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {job.title}
            </h3>

            {/* Organization */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <span className="font-medium truncate">{job.organization}</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 dark:text-slate-400 mb-5">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{job.location || 'India'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="shrink-0" />
                    <span className="truncate">{job.experience || 'Freshers'}</span>
                </div>
                {job.salary && (
                    <div className="flex items-center gap-2 col-span-2">
                        <Banknote size={14} className="shrink-0" />
                        <span className="truncate">{job.salary}</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                {formattedDate ? (
                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Last Date</span>
                        <span className="text-sm font-semibold text-red-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {formattedDate}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">View Details →</span>
                )}

                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 transition-all">
                    <ChevronRight size={18} />
                </div>
            </div>
        </Link>
    );
}
