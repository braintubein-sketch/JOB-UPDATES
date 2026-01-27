
import { mockJobs } from '@/lib/mock-data';
import JobListItem from '@/components/JobListItem';
import { Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: { q?: string; category?: string; location?: string };
}

export default function LatestJobsPage({ searchParams }: Props) {
    let jobs = mockJobs;

    // Filter Logic (Mock)
    if (searchParams.q) {
        const query = searchParams.q.toLowerCase();
        jobs = jobs.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.organization.toLowerCase().includes(query)
        );
    }

    if (searchParams.category) {
        jobs = jobs.filter(job => job.category === searchParams.category);
    }

    if (searchParams.location) {
        jobs = jobs.filter(job => (job as any).location?.toLowerCase().includes(searchParams.location?.toLowerCase()));
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Page Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20">
                <div className="container-main py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                                {searchParams.q ? `Results for "${searchParams.q}"` : 'Latest Job Updates'}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Showing {jobs.length} Jobs
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={searchParams.q}
                                    placeholder="Search by keywords..."
                                    className="input py-2 pl-9 text-sm"
                                />
                            </div>
                            <button type="submit" className="btn-primary btn-sm">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-main py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Filters Sidebar (Desktop) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="card sticky top-36">
                            <div className="flex items-center gap-2 font-bold mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <Filter size={18} /> Filters
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Category</label>
                                    <div className="space-y-2">
                                        <Link href="/latest-jobs" className={`block text-sm ${!searchParams.category ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>All Jobs</Link>
                                        <Link href="/latest-jobs?category=Govt" className={`block text-sm ${searchParams.category === 'Govt' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>Govt Jobs</Link>
                                        <Link href="/latest-jobs?category=Private" className={`block text-sm ${searchParams.category === 'Private' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>Private Jobs</Link>
                                        <Link href="/latest-jobs?category=Bank" className={`block text-sm ${searchParams.category === 'Bank' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>Bank Jobs</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job List */}
                    <div className="lg:col-span-9">
                        <div className="list-item-container shadow-sm mb-8">
                            {jobs.map((job: any) => (
                                <JobListItem key={job.id} job={job} />
                            ))}
                            {jobs.length === 0 && (
                                <div className="p-12 text-center">
                                    <Search className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria</p>
                                    <Link href="/latest-jobs" className="btn-secondary mt-4 inline-flex items-center gap-2">
                                        Clear Search
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination (Visual Only) */}
                        {jobs.length > 0 && (
                            <div className="flex justify-center gap-2">
                                <button className="btn-secondary btn-sm" disabled>Prev</button>
                                <button className="btn-primary btn-sm">1</button>
                                <button className="btn-secondary btn-sm">2</button>
                                <button className="btn-secondary btn-sm">3</button>
                                <button className="btn-secondary btn-sm">Next</button>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}
