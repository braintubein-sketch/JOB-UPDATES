import { mockJobs, mockResults, mockAdmitCards } from '@/lib/mock-data';
import Link from 'next/link';
import { Share2, ArrowLeft, Calendar, Building2, MapPin, Download, ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import CopyJobDetails from '@/components/CopyJobDetails';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function JobDetailsPage({ params }: { params: { slug: string } }) {
    // Combine all mock data to search for the slug
    const allItems = [...mockJobs, ...mockResults, ...mockAdmitCards];
    const job = allItems.find(j => j.slug === params.slug);

    if (!job) {
        // In a real app, this would be a 404. For this frontend demo, we strictly look for mock data.
        return notFound();
    }

    // Extended mock details (since the lightweight list selection didn't have them)
    // In a real app, this comes from the DB. Here we enrich the mock data for the view.
    const isResult = job.category === 'Result' || (job as any).category === 'Result';
    const isAdmitCard = job.category === 'Admit Card' || (job as any).category === 'Admit Card';

    const detailedJob = {
        ...job,
        postName: job.title.split('-')[0].trim(),
        totalVacancies: (job as any).vacancies || 'Various Posts',
        startDate: '2026-01-10',
        lastDate: (job as any).lastDate || '2026-02-28',
        fee: 'General/OBC: ₹100/-, SC/ST: Nil',
        ageLimit: (job as any).ageLimit || '18-27 Years',
        selectionProcess: 'Written Exam, Physical Test, Medical Exam',
        payScale: (job as any).salary || 'Rs. 21,700 - 69,100/-',
        qualification: (job as any).qualification || '10th/12th Pass',
        applyLink: '#',
        notificationLink: '#',
        officialSite: '#',
        description: `The ${job.organization} has released a ${isResult ? 'result' : isAdmitCard ? 'admit card' : 'recruitment notification'} for the post of ${job.title}. ${isResult ? 'Candidates can check their results now.' : isAdmitCard ? 'Candidates can download their admit card.' : 'Interested and eligible candidates can apply online before the last date.'}`
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
            {/* Breadcrumb / Back */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
                <div className="container-main py-3 flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
                        <ArrowLeft size={16} /> Home
                    </Link>
                    <span>/</span>
                    <span className="truncate max-w-[200px]">{detailedJob.organization}</span>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate">Details</span>
                </div>
            </div>

            <div className="container-main py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content - Article Style */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Title Header */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`badge ${detailedJob.category === 'Govt' ? 'badge-blue' : detailedJob.category === 'Private' ? 'badge-green' : 'badge-gray'}`}>
                                {detailedJob.category || 'Update'}
                            </span>
                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                <Clock size={14} /> Posted: Jan 26, 2026
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                            {detailedJob.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                            <div className="flex items-center gap-1.5">
                                <Building2 size={16} className="text-blue-600" />
                                {detailedJob.organization}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-green-600" />
                                {(detailedJob as any).location || 'All India'}
                            </div>
                        </div>

                        {/* Social Share & Copy */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                            <CopyJobDetails job={{ ...detailedJob, slug: params.slug }} />
                        </div>
                    </div>

                    {/* Job Overview Table */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <CheckCircle className="text-blue-600" size={20} />
                            Job Overview
                        </h2>
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-sm text-left border-collapse">
                                <tbody>
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                                            Organization Name
                                        </th>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                            {detailedJob.organization}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                                            Post Name
                                        </th>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                            {detailedJob.postName}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                                            Total Vacancies
                                        </th>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                            {detailedJob.totalVacancies}
                                        </td>
                                    </tr>
                                    {detailedJob.payScale && (
                                        <tr className="border-b border-slate-200 dark:border-slate-800">
                                            <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                                                Salary
                                            </th>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                                {detailedJob.payScale}
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                                            Job Location
                                        </th>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                            {(detailedJob as any).location || 'All India'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                                            Official Website
                                        </th>
                                        <td className="py-3 px-4 text-blue-600">
                                            <a href="#" target="_blank" className="hover:underline">Click Here to Visit</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Important Dates */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
                            <Calendar size={20} />
                            Important Dates
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 text-sm md:text-base">
                            <li><strong>Application Start Date:</strong> {detailedJob.startDate}</li>
                            <li><strong>Last Date to Apply:</strong> <span className="text-red-600 font-bold">{detailedJob.lastDate}</span></li>
                            <li><strong>Exam Date:</strong> Notify Later</li>
                            <li><strong>Admit Card Release:</strong> Before Exam</li>
                        </ul>
                    </div>

                    {/* Application Fee */}
                    {!isResult && !isAdmitCard && (
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Application Fee</h2>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    <li>General / OBC / EWS: <strong>₹100/-</strong></li>
                                    <li>SC / ST / PH: <strong>Nil</strong></li>
                                    <li>All Category Female: <strong>Nil</strong></li>
                                    <li>Payment Mode: Online (Net Banking, Debit Card, Credit Card, UPI)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Age Limit & Qualification */}
                    {!isResult && !isAdmitCard && (
                        <div className="card">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Age Limit</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">As on 01/01/2026</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                        <li>Minimum Age: <strong>18 Years</strong></li>
                                        <li>Maximum Age: <strong>{detailedJob.ageLimit.replace(' Years', '')} Years</strong></li>
                                        <li>Age Relaxation applicable as per rules.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Qualification</h2>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                        <li>Candidates must have passed <strong>{detailedJob.qualification}</strong> from a recognized Board/University.</li>
                                        <li>Read official notification for post-wise eligibility details.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vacancy Details Table */}
                    {!isResult && !isAdmitCard && (
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Vacancy Details</h2>
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-sm text-center">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                        <tr>
                                            <th className="py-3 px-4 border-b dark:border-slate-700">Post Name</th>
                                            <th className="py-3 px-4 border-b dark:border-slate-700">Total Post</th>
                                            <th className="py-3 px-4 border-b dark:border-slate-700">Eligibility</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="py-3 px-4 border-b dark:border-slate-800">{detailedJob.postName}</td>
                                            <td className="py-3 px-4 border-b dark:border-slate-800">{detailedJob.totalVacancies}</td>
                                            <td className="py-3 px-4 border-b dark:border-slate-800">{detailedJob.qualification}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Important Links Section - The CTA Area */}
                    <div className="card border-blue-200 dark:border-blue-900 shadow-lg shadow-blue-500/5">
                        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">Important Links</h2>
                        <div className="grid gap-3 max-w-2xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="font-bold text-slate-700 dark:text-slate-300 mb-2 md:mb-0">
                                    {isResult ? 'Check Result' : isAdmitCard ? 'Download Admit Card' : 'Apply Online'}
                                </span>
                                <a href="#" className="btn-primary btn-sm flex items-center gap-2">
                                    Click Here <ExternalLink size={16} />
                                </a>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="font-bold text-slate-700 dark:text-slate-300 mb-2 md:mb-0">Download Notification</span>
                                <a href="#" className="btn-secondary btn-sm flex items-center gap-2">
                                    Click Here <Download size={16} />
                                </a>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="font-bold text-slate-700 dark:text-slate-300 mb-2 md:mb-0">Official Website</span>
                                <a href="#" className="btn-secondary btn-sm flex items-center gap-2">
                                    Click Here <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar (Optional) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="card bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                        <h3 className="text-xl font-bold mb-2">Join Telegram Channel</h3>
                        <p className="text-blue-100 text-sm mb-4">Get the latest job updates, results, and admit cards directly on your phone.</p>
                        <a href="https://t.me/jobupdatesite" target="_blank" className="btn bg-white text-blue-700 w-full hover:bg-blue-50 px-4 py-2 border-none">
                            Join Now
                        </a>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-500" />
                            Related Jobs
                        </h3>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mockJobs.slice(0, 4).map(j => (
                                <Link key={j.id} href={`/jobs/${j.slug}`} className="block py-3 hover:text-blue-600">
                                    <p className="font-semibold text-sm line-clamp-2">{j.title}</p>
                                    <span className="text-xs text-slate-500">Last Date: {j.lastDate || 'Soon'}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
