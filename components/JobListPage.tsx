import JobListItem from '@/components/JobListItem';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // Revalidate every 30 mins

interface JobListPageProps {
    title: string;
    description?: string;
    category?: string; // 'Govt', 'Private', 'IT', etc. to filter
}

async function getJobs(category?: string) {
    try {
        await dbConnect();
        const query: any = { status: 'PUBLISHED' };

        if (category) {
            if (category === 'IT') {
                query.category = 'IT';
            } else if (category === 'Govt') {
                query.category = { $in: ['Govt', 'PSU', 'Railway', 'Teaching', 'Police', 'Defence', 'Banking'] };
            } else if (category === 'Private') {
                query.category = { $in: ['Private', 'IT'] };
            } else {
                query.category = category;
            }
        }

        const jobs = await Job.find(query)
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(50)
            .lean();

        return JSON.parse(JSON.stringify(jobs));
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

export default async function JobListPage({ title, description, category }: JobListPageProps) {
    const jobs = await getJobs(category);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12">
                <div className="container-main text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* List Content */}
            <div className="container-main py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main List */}
                    <div className="lg:col-span-8">
                        <div className="list-item-container shadow-sm">
                            {jobs.map((job: any) => (
                                <JobListItem key={job._id} job={job} />
                            ))}
                            {jobs.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    No jobs found in this category.
                                </div>
                            )}
                        </div>

                        {/* Pagination Placeholder */}
                        {jobs.length > 0 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button className="btn-secondary btn-sm" disabled>Previous</button>
                                <button className="btn-primary btn-sm">1</button>
                                <button className="btn-secondary btn-sm" disabled>Next</button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Filters (Mock Visual) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="card sticky top-24">
                            <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Filter Jobs</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                    <select className="select w-full text-sm">
                                        <option>All India</option>
                                        <option>Delhi</option>
                                        <option>Mumbai</option>
                                        <option>Bangalore</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Qualification</label>
                                    <select className="select w-full text-sm">
                                        <option>All</option>
                                        <option>10th Pass</option>
                                        <option>12th Pass</option>
                                        <option>Graduate</option>
                                        <option>Post Graduate</option>
                                    </select>
                                </div>

                                <button className="btn-primary w-full mt-2">Apply Filters</button>
                            </div>
                        </div>

                        {/* Ad Slot */}
                        <div className="w-full h-[300px] bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-400 font-bold p-6 text-center">
                            Google AdSense Space
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

