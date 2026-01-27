import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Building2, MapPin, GraduationCap, Calendar, Users, Banknote,
    ArrowLeft, ExternalLink, ShieldCheck, Download, FileText,
    Clock, Briefcase, ChevronRight
} from 'lucide-react';
import CopyJobDetails from '@/components/CopyJobDetails';
import JobTabs from '@/components/JobTabs';

export const dynamic = 'force-dynamic';

function getTimeRemaining(lastDate: Date) {
    const total = new Date(lastDate).getTime() - Date.now();
    if (total <= 0) return { days: 0, hours: 0, expired: true };
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return { days, hours, expired: false };
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
    let job: any = null;
    let relatedJobs: any[] = [];

    try {
        await dbConnect();
        console.log('Fetching job with slug:', params.slug);
        job = await Job.findOneAndUpdate(
            { slug: params.slug },
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!job) {
            console.log('Job NOT found in DB for slug:', params.slug);
        } else {
            console.log('Job found:', job.title);
            relatedJobs = await Job.find({
                _id: { $ne: job._id },
                category: job.category,
                status: 'PUBLISHED'
            }).limit(3).lean();
        }
    } catch (error) {
        console.error('Job detail page DB error:', error);
    }

    if (!job) return notFound();

    const timeLeft = job.lastDate ? getTimeRemaining(job.lastDate) : null;
    const isUrgent = !!(timeLeft && !timeLeft.expired && timeLeft.days <= 3);

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description || job.title,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.organization,
        },
        "datePosted": job.createdAt,
        "validThrough": job.lastDate || job.expiresAt,
        "employmentType": job.category === 'Govt' ? 'FULL_TIME' : 'OTHER',
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location || 'India',
                "addressCountry": "IN"
            }
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 lg:pb-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/\//g, '\\/') }}
            />

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container-main py-6">
                    <Link href="/latest-jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors">
                        <ArrowLeft size={16} />
                        Back to All Jobs
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Left: Job Info */}
                        <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`badge ${job.category === 'Govt' ? 'badge-blue' :
                                    job.category === 'IT' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' :
                                        job.category === 'Result' ? 'badge-orange' :
                                            job.category === 'Admit Card' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' :
                                                'badge-green'
                                    }`}>
                                    <ShieldCheck size={12} />
                                    {job.category}
                                </span>
                                {job.isFeatured && (
                                    <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">⭐ Featured</span>
                                )}
                                {isUrgent && (
                                    <span className="badge-red">🔥 Closing Soon</span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                {job.title}
                            </h1>

                            {/* Organization */}
                            <div className="flex items-center gap-2 text-lg text-slate-600 dark:text-slate-400">
                                <Building2 size={20} className="text-blue-600" />
                                <span className="font-medium">{job.organization}</span>
                            </div>
                        </div>

                        {/* Right: Countdown Timer */}
                        {timeLeft && (
                            <div className={`shrink-0 p-6 rounded-2xl text-center min-w-[180px] ${timeLeft.expired
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                : isUrgent
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                }`}>
                                <Clock size={24} className="mx-auto mb-2" />
                                {timeLeft.expired ? (
                                    <div className="font-bold text-lg">Application Closed</div>
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold">{timeLeft.days}d {timeLeft.hours}h</div>
                                        <div className="text-sm font-medium opacity-80">Time Left to Apply</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-main py-8">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Key Info Cards - Specialized by Category */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {job.category === 'IT' ? (
                                <>
                                    <InfoCard icon={<Building2 size={20} />} label="Company" value={job.organization} highlight />
                                    <InfoCard icon={<Banknote size={20} />} label="Salary" value={job.salary || 'Best in Industry'} highlight />
                                    <InfoCard icon={<Briefcase size={20} />} label="Experience" value={job.experience || 'Freshers'} highlight />
                                    <InfoCard icon={<MapPin size={20} />} label="Job Location" value={job.location || 'India'} />
                                    <InfoCard icon={<GraduationCap size={20} />} label="Skills" value={job.qualification || 'Developer'} />
                                    <InfoCard icon={<Calendar size={20} />} label="Joining" value="Immediate" />
                                </>
                            ) : job.category === 'Result' ? (
                                <>
                                    <InfoCard icon={<Users size={20} />} label="Status" value="Declared" highlight />
                                    <InfoCard icon={<Calendar size={20} />} label="Announced" value={job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'Recently'} highlight />
                                    <InfoCard icon={<Building2 size={20} />} label="Board" value={job.organization} />
                                    <InfoCard icon={<MapPin size={20} />} label="Region" value={job.location || 'All India'} />
                                </>
                            ) : job.category === 'Admit Card' ? (
                                <>
                                    <InfoCard icon={<Calendar size={20} />} label="Exam Date" value={job.examDate ? new Date(job.examDate).toLocaleDateString('en-IN') : 'Check Notice'} highlight />
                                    <InfoCard icon={<Download size={20} />} label="Availability" value="Live Now" highlight />
                                    <InfoCard icon={<Building2 size={20} />} label="Organizer" value={job.organization} />
                                    <InfoCard icon={<MapPin size={20} />} label="Centers" value={job.location || 'All India'} />
                                </>
                            ) : (
                                <>
                                    <InfoCard
                                        icon={<Users size={20} />}
                                        label="Vacancies"
                                        value={job.vacancies || 'Check PDF'}
                                        highlight={job.category === 'IT'}
                                    />
                                    <InfoCard
                                        icon={<GraduationCap size={20} />}
                                        label="Qualification"
                                        value={job.qualification || 'Refer PDF'}
                                    />
                                    <InfoCard
                                        icon={<Briefcase size={20} />}
                                        label="Experience"
                                        value={job.experience || 'Not Required'}
                                        highlight={job.category === 'IT'}
                                    />
                                    <InfoCard
                                        icon={<MapPin size={20} />}
                                        label="Location"
                                        value={job.location || 'All India'}
                                    />
                                    <InfoCard
                                        icon={<Banknote size={20} />}
                                        label="Salary"
                                        value={job.salary || 'As per norms'}
                                        highlight={job.category === 'IT'}
                                    />
                                    <InfoCard icon={<Calendar size={20} />} label="Age Limit" value={job.ageLimit || '18-35 Years'} />
                                    <InfoCard
                                        icon={<Calendar size={20} />}
                                        label="Last Date"
                                        value={job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'Check PDF'}
                                        highlight={isUrgent}
                                    />
                                </>
                            )}
                        </div>

                        {/* Interactive Tabs Content */}
                        <JobTabs job={{
                            category: job.category,
                            description: job.description,
                            eligibility: job.eligibility,
                            selectionProcess: job.selectionProcess,
                            howToApply: job.howToApply,
                            organization: job.organization,
                            title: job.title,
                            postName: job.postName,
                            notificationPdf: job.notificationPdf || job.source || job.applyLink,
                            importantDates: [
                                job.startDate && { label: 'Application Start Date', date: new Date(job.startDate).toLocaleDateString('en-IN') },
                                job.lastDate && { label: job.category === 'Result' ? 'Result Declared On' : 'Last Date to Apply', date: new Date(job.lastDate).toLocaleDateString('en-IN'), isUrgent },
                                job.examDate && { label: 'Exam Date', date: new Date(job.examDate).toLocaleDateString('en-IN') }
                            ].filter(Boolean) as any
                        }} />

                        {/* CTA Buttons - Using DEEP SCRAPED Official Links */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {job.category === 'Result' ? (
                                job.applyLink && (
                                    <a
                                        href={job.applyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn bg-orange-600 hover:bg-orange-700 text-white flex-1 justify-center py-4 text-lg shadow-lg shadow-orange-600/20"
                                    >
                                        Check Your Result Now
                                        <ExternalLink size={20} className="ml-2" />
                                    </a>
                                )
                            ) : job.category === 'Admit Card' ? (
                                <a
                                    href={job.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-purple-600 hover:bg-purple-700 text-white flex-1 justify-center py-4 text-lg shadow-lg shadow-purple-600/20"
                                >
                                    Login & Download Admit Card
                                    <Download size={20} className="ml-2" />
                                </a>
                            ) : job.category === 'IT' ? (
                                <a
                                    href={job.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex-1 justify-center py-4 text-lg shadow-lg shadow-indigo-600/20"
                                >
                                    Apply on Official Company Portal
                                    <ExternalLink size={20} className="ml-2" />
                                </a>
                            ) : (
                                job.applyLink && (
                                    <a
                                        href={job.applyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary flex-1 justify-center py-4 text-lg"
                                    >
                                        Direct Official Application
                                        <ExternalLink size={20} className="ml-2" />
                                    </a>
                                )
                            )}
                            {job.source && (
                                <a
                                    href={job.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary flex-1 justify-center py-4 text-lg"
                                >
                                    News Source
                                    <FileText size={20} className="ml-2" />
                                </a>
                            )}
                        </div>

                        {/* Share */}
                        <div className="card">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                                Share this {job.category === 'Result' ? 'Result' : job.category === 'Admit Card' ? 'Admit Card' : 'Job'}
                            </h3>
                            <CopyJobDetails job={{
                                title: job.title,
                                organization: job.organization,
                                qualification: job.qualification,
                                salary: job.salary,
                                lastDate: job.lastDate?.toISOString(),
                                slug: job.slug,
                                location: job.location,
                                category: job.category
                            }} />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-6">

                        {/* Trust Banner */}
                        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck size={28} />
                                <h3 className="text-xl font-bold">Trust Verified</h3>
                            </div>
                            <p className="text-green-100 text-sm leading-relaxed mb-4">
                                This content is fetched directly from official government portals. We never modify dates, fees, or eligibility details.
                            </p>
                            <Link href="/sources" className="text-white font-semibold text-sm hover:underline flex items-center gap-1">
                                View Source Policy <ChevronRight size={16} />
                            </Link>
                        </div>

                        {/* Application Fee */}
                        {job.applicationFee && (
                            <div className="card">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Application Fee</h3>
                                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line text-sm">{job.applicationFee}</p>
                            </div>
                        )}

                        {/* Related Jobs */}
                        {relatedJobs.length > 0 && (
                            <div className="card">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Related Jobs</h3>
                                <div className="space-y-3">
                                    {relatedJobs.map((relJob: any) => (
                                        <Link
                                            key={relJob._id.toString()}
                                            href={`/jobs/${relJob.slug}`}
                                            className="block p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                                        >
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">{relJob.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{relJob.organization}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ad Placeholder */}
                        <div className="ad-slot py-12">
                            Advertisement
                        </div>
                    </aside>
                </div>
            </div>

            {/* Sticky Mobile CTA Bar - Category Aware */}
            {(job.applyLink || job.notificationPdf) && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50">
                    <a
                        href={job.applyLink || job.notificationPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn w-full py-4 text-lg justify-center ${job.category === 'Result'
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : job.category === 'Admit Card'
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'btn-primary'
                            }`}
                    >
                        {job.category === 'Result' ? 'View Result' : job.category === 'Admit Card' ? 'Download Admit Card' : 'Apply Now Online'}
                        {job.category === 'Admit Card' ? <Download size={20} className="ml-2" /> : <ExternalLink size={20} className="ml-2" />}
                    </a>
                </div>
            )}
        </div>
    );
}

function InfoCard({ icon, label, value, highlight }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
    return (
        <div className={`card p-4 text-center transition-all ${highlight ? 'ring-2 ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
            <div className={`${highlight ? 'text-blue-600' : 'text-slate-400'} dark:text-blue-400 mb-2 flex justify-center`}>{icon}</div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">{label}</span>
            <span className={`font-bold text-sm ${highlight ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>{value}</span>
        </div>
    );
}
