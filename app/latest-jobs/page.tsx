import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import { Search, SlidersHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: { q?: string; category?: string; location?: string; experience?: string };
}

export default async function LatestJobsPage({ searchParams }: Props) {
    let jobs: any[] = [];
    let totalJobs = 0;

    try {
        await dbConnect();

        const query: any = { status: 'PUBLISHED' };

        if (searchParams.q) {
            query.$or = [
                { title: { $regex: searchParams.q, $options: 'i' } },
                { organization: { $regex: searchParams.q, $options: 'i' } },
                { description: { $regex: searchParams.q, $options: 'i' } }
            ];
        }

        if (searchParams.category) {
            query.category = searchParams.category;
        }

        if (searchParams.location) {
            query.location = { $regex: searchParams.location, $options: 'i' };
        }

        totalJobs = await Job.countDocuments(query);
        jobs = await Job.find(query).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('Latest jobs page error:', error);
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 lg:pb-0">
            {/* Page Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8">
                <div className="container-main">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                {searchParams.q ? `Results for "${searchParams.q}"` : 'Latest Jobs'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                {totalJobs} jobs found
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form className="flex gap-3 max-w-md w-full md:w-auto">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={searchParams.q}
                                    placeholder="Search jobs..."
                                    className="input pl-11"
                                />
                            </div>
                            <button type="submit" className="btn-primary">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-main py-8">
                <div className="flex gap-8">
                    {/* Left Sidebar - Filters (Desktop) */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <JobFilters />
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <main className="flex-1">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-6">
                            <button className="btn-secondary w-full flex items-center justify-center gap-2">
                                <SlidersHorizontal size={18} />
                                Filters
                            </button>
                        </div>

                        {/* Jobs Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {jobs.map((job: any) => (
                                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {jobs.length === 0 && (
                            <div className="card text-center py-16">
                                <Search className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
                            </div>
                        )}

                        {/* Pagination Placeholder */}
                        {jobs.length >= 50 && (
                            <div className="mt-8 text-center">
                                <button className="btn-secondary">Load More Jobs</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
