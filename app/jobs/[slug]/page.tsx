import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Building2, MapPin, GraduationCap, Calendar, Users, Banknote,
    ArrowLeft, ExternalLink, ShieldCheck, Download, FileText,
    Clock, CheckCircle, AlertCircle, BookOpen, ClipboardList, Briefcase
} from 'lucide-react';
import CopyJobDetails from '@/components/CopyJobDetails';

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
        job = await Job.findOneAndUpdate(
            { slug: params.slug },
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (job) {
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
    const isUrgent = timeLeft && !timeLeft.expired && timeLeft.days <= 3;

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
        "baseSalary": job.salary ? {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary
            }
        } : undefined
    };

    return (
        <div className="flex flex-col w-full pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HEADER */}
            <section className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 py-12">
                <div className="container-premium">
                    <Link href="/latest-jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-600 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to All Jobs
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`badge ${job.category === 'Govt' ? 'badge-govt' : job.category === 'Result' ? 'badge-result' : 'badge-private'}`}>
                                    <ShieldCheck size={12} />
                                    {job.category}
                                </span>
                                {job.isFeatured && (
                                    <span className="badge bg-amber-100 text-amber-700">⭐ Featured</span>
                                )}
                                {isUrgent && (
                                    <span className="badge bg-red-100 text-red-700">🔥 Closing Soon</span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display leading-tight mb-4">
                                {job.title}
                            </h1>
                            <p className="text-lg text-slate-600 flex items-center gap-2">
                                <Building2 size={18} className="text-primary-600" />
                                {job.organization}
                            </p>
                        </div>

                        {/* Countdown Timer */}
                        {timeLeft && (
                            <div className={`p-6 rounded-2xl text-center min-w-[200px] ${timeLeft.expired ? 'bg-red-100 text-red-700' :
                                isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                <Clock size={24} className="mx-auto mb-2" />
                                {timeLeft.expired ? (
                                    <div className="font-bold text-lg">Application Closed</div>
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold">{timeLeft.days}d {timeLeft.hours}h</div>
                                        <div className="text-sm font-semibold">Time Left to Apply</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-12">
                <div className="container-premium grid lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* KEY INFO CARDS */}
                        <div className="grid grid-cols-2 md:grid-cols-3 and lg:grid-cols-4 gap-4">
                            <InfoCard icon={<Users />} label="Vacancies" value={job.vacancies || 'Check PDF'} />
                            <InfoCard icon={<GraduationCap />} label="Qualification" value={job.qualification || 'Refer PDF'} />
                            <InfoCard icon={<Briefcase />} label="Experience" value={job.experience || 'Not Required'} />
                            <InfoCard icon={<MapPin />} label="Location" value={job.location || 'All India'} />
                            <InfoCard icon={<Banknote />} label="Salary" value={job.salary || 'As per norms'} />
                            <InfoCard icon={<Calendar />} label="Age Limit" value={job.ageLimit || '18-35 Years'} />
                            <InfoCard icon={<Calendar />} label="Last Date" value={job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'Check PDF'} />
                        </div>

                        {/* OVERVIEW */}
                        <div className="card-premium">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <FileText className="text-primary-600" size={24} /> Recruitment Overview
                            </h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {job.description || `The ${job.organization} has officially released the notification for the post of ${job.postName || job.title}. Eligible candidates are invited to apply through official channels before the last date.`}
                                </p>
                            </div>
                        </div>

                        {/* IMPORTANT DATES */}
                        {(job.startDate || job.lastDate || job.examDate) && (
                            <div className="card-premium">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Calendar className="text-primary-600" size={22} /> Important Dates
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <tbody className="divide-y divide-slate-100">
                                            {job.startDate && (
                                                <tr>
                                                    <td className="py-3 text-slate-600">Application Start Date</td>
                                                    <td className="py-3 font-semibold text-right">{new Date(job.startDate).toLocaleDateString('en-IN')}</td>
                                                </tr>
                                            )}
                                            {job.lastDate && (
                                                <tr className={isUrgent ? 'bg-red-50' : ''}>
                                                    <td className="py-3 text-slate-600">Last Date to Apply</td>
                                                    <td className="py-3 font-bold text-right text-red-600">{new Date(job.lastDate).toLocaleDateString('en-IN')}</td>
                                                </tr>
                                            )}
                                            {job.examDate && (
                                                <tr>
                                                    <td className="py-3 text-slate-600">Exam Date</td>
                                                    <td className="py-3 font-semibold text-right">{new Date(job.examDate).toLocaleDateString('en-IN')}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ELIGIBILITY */}
                        {job.eligibility && (
                            <div className="card-premium">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <CheckCircle className="text-primary-600" size={22} /> Eligibility Criteria
                                </h2>
                                <p className="text-slate-600 whitespace-pre-line">{job.eligibility}</p>
                            </div>
                        )}

                        {/* SELECTION PROCESS */}
                        {job.selectionProcess && (
                            <div className="card-premium">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <ClipboardList className="text-primary-600" size={22} /> Selection Process
                                </h2>
                                <p className="text-slate-600 whitespace-pre-line">{job.selectionProcess}</p>
                            </div>
                        )}

                        {/* HOW TO APPLY */}
                        {job.howToApply && (
                            <div className="card-premium">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <BookOpen className="text-primary-600" size={22} /> How to Apply
                                </h2>
                                <p className="text-slate-600 whitespace-pre-line">{job.howToApply}</p>
                            </div>
                        )}

                        {/* CTA BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {job.applyLink && (
                                <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn-premium btn-primary flex-1 justify-center py-4 text-lg">
                                    Apply Now (Official) <ExternalLink size={20} />
                                </a>
                            )}
                            {job.notificationPdf && (
                                <a href={job.notificationPdf} target="_blank" rel="noopener noreferrer" className="btn-premium btn-outline flex-1 justify-center py-4 text-lg">
                                    Download PDF <Download size={20} />
                                </a>
                            )}
                        </div>

                        {/* SHARE & COPY */}
                        <div className="card-premium">
                            <h3 className="font-bold mb-4">Share this Job</h3>
                            <CopyJobDetails job={{
                                title: job.title,
                                organization: job.organization,
                                qualification: job.qualification,
                                salary: job.salary,
                                lastDate: job.lastDate?.toISOString(),
                                applyLink: job.applyLink,
                                location: job.location
                            }} />
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="space-y-6">

                        {/* TRUST BANNER */}
                        <div className="card-premium bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck size={28} />
                                <h3 className="text-xl font-bold">Trust Verified</h3>
                            </div>
                            <p className="text-primary-100 text-sm leading-relaxed mb-4">
                                This content is fetched directly from official government portals. We never modify dates, fees, or eligibility details.
                            </p>
                            <Link href="/sources" className="text-white font-bold text-sm hover:underline flex items-center gap-1">
                                View Source Policy <ArrowLeft size={14} className="rotate-180" />
                            </Link>
                        </div>

                        {/* APPLICATION FEE */}
                        {job.applicationFee && (
                            <div className="card-premium">
                                <h3 className="font-bold mb-3">Application Fee</h3>
                                <p className="text-slate-600 whitespace-pre-line text-sm">{job.applicationFee}</p>
                            </div>
                        )}

                        {/* RELATED JOBS */}
                        {relatedJobs.length > 0 && (
                            <div className="card-premium">
                                <h3 className="font-bold mb-4">Related Jobs</h3>
                                <div className="space-y-4">
                                    {relatedJobs.map((relJob: any) => (
                                        <Link key={relJob._id.toString()} href={`/jobs/${relJob.slug}`} className="block p-3 rounded-lg border border-slate-100 hover:border-primary-300 hover:bg-primary-50 transition-all">
                                            <h4 className="font-semibold text-sm line-clamp-2">{relJob.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{relJob.organization}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AD PLACEHOLDER */}
                        <div className="card-premium bg-slate-100 border-dashed text-center py-12">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Advertisement</p>
                        </div>

                    </aside>

                </div>
            </section>
        </div>
    );
}

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="card-premium p-4 flex flex-col items-center text-center">
            <div className="text-primary-600 mb-2">{icon}</div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{label}</span>
            <span className="font-bold text-sm">{value}</span>
        </div>
    );
}
