
import Link from 'next/link';
import { Calendar, Briefcase, ChevronRight, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface JobListItemProps {
    job: {
        id: string;
        title: string;
        organization: string;
        lastDate?: string | Date;
        slug: string;
        category: string;
        qualification?: string;
        vacancies?: string;
    };
}

export default function JobListItem({ job }: JobListItemProps) {
    const isNew = new Date(job.lastDate || '').getTime() > new Date().getTime(); // Simple check, real logic might differ

    return (
        <div className="list-item">
            <Link href={`/jobs/${job.slug}`} className="flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${job.category === 'Govt' ? 'badge-blue' : job.category === 'Private' ? 'badge-green' : 'badge-gray'}`}>
                            {job.category}
                        </span>
                        {/* Mobile Date */}
                        <span className="md:hidden text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {job.lastDate ? formatDate(job.lastDate) : 'No Date'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1">
                        {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Briefcase size={14} className="text-slate-400" />
                            {job.organization}
                        </span>
                        {job.qualification && (
                            <span className="flex items-center gap-1">
                                <GraduationCap size={14} className="text-slate-400" />
                                {job.qualification}
                            </span>
                        )}
                        {job.vacancies && (
                            <span className="hidden sm:inline bg-slate-100 dark:bg-slate-800 px-2 rounded text-xs text-slate-500">
                                {job.vacancies}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Side - Date & Action */}
                <div className="flex bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 md:bg-transparent md:p-0 items-center justify-between md:flex-col md:items-end md:justify-center md:gap-1 md:min-w-[120px] shrink-0">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Last Date</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {job.lastDate ? formatDate(job.lastDate) : 'N/A'}
                        </span>
                    </div>

                    <div className="md:hidden flex flex-col">
                        <span className="text-xs font-bold text-slate-500">View Details</span>
                    </div>

                    <button className="btn-primary btn-sm rounded-full flex items-center gap-1 text-xs md:mt-2">
                        View Details <ChevronRight size={14} />
                    </button>
                </div>
            </Link>
        </div>
    );
}
