'use client';

import Link from 'next/link';
import { Calendar, Building2, MapPin, ArrowUpRight, ShieldCheck, Bookmark, Clock, Users, GraduationCap, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface JobCardProps {
    job: {
        id: string;
        slug: string;
        title: string;
        organization: string;
        category: string;
        qualification?: string;
        salary?: string;
        vacancies?: string;
        location?: string;
        lastDate?: string;
        updatedAt: string;
        isFeatured?: boolean;
        isTrending?: boolean;
    };
    showCountdown?: boolean;
}

function getTimeRemaining(lastDate: string) {
    const total = new Date(lastDate).getTime() - Date.now();
    if (total <= 0) return { days: 0, hours: 0, expired: true };
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return { days, hours, expired: false };
}

const JobCard = ({ job, showCountdown = false }: JobCardProps) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, expired: false });

    useEffect(() => {
        if (job.lastDate && showCountdown) {
            const updateTimer = () => setTimeLeft(getTimeRemaining(job.lastDate!));
            updateTimer();
            const interval = setInterval(updateTimer, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [job.lastDate, showCountdown]);

    const badgeClass = job.category === 'Govt' ? 'badge-govt' :
        job.category === 'Result' ? 'badge-result' :
            job.category === 'Railway' ? 'bg-orange-50 text-orange-700' :
                job.category === 'Banking' ? 'bg-green-50 text-green-700' :
                    'badge-private';

    const isUrgent = timeLeft.days <= 3 && !timeLeft.expired;

    return (
        <div className={`card-premium group h-full flex flex-col relative ${job.isFeatured ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
            {/* Featured/Trending Badge */}
            {(job.isFeatured || job.isTrending) && (
                <div className="absolute -top-3 -right-3 z-10">
                    {job.isFeatured && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                            ⭐ FEATURED
                        </span>
                    )}
                    {job.isTrending && !job.isFeatured && (
                        <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                            🔥 TRENDING
                        </span>
                    )}
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
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
                <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                    {job.title}
                </h3>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Building2 size={14} className="text-primary-500 shrink-0" />
                        <span className="truncate">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={14} className="text-primary-500 shrink-0" />
                        <span className="truncate">{job.location || 'All India'}</span>
                    </div>
                    {job.qualification && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <GraduationCap size={14} className="text-primary-500 shrink-0" />
                            <span className="truncate">{job.qualification}</span>
                        </div>
                    )}
                    {job.salary && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Banknote size={14} className="text-primary-500 shrink-0" />
                            <span className="truncate">{job.salary}</span>
                        </div>
                    )}
                    {job.vacancies && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 col-span-2">
                            <Users size={14} className="text-primary-500 shrink-0" />
                            <span>{job.vacancies} Vacancies</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Countdown Timer */}
            {showCountdown && job.lastDate && (
                <div className={`mb-4 p-3 rounded-lg text-center ${timeLeft.expired ? 'bg-red-50 text-red-600' :
                        isUrgent ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold">
                        <Clock size={14} />
                        {timeLeft.expired ? (
                            <span>Application Closed</span>
                        ) : (
                            <span>{timeLeft.days}d {timeLeft.hours}h left to apply</span>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
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
                    className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"
                >
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
