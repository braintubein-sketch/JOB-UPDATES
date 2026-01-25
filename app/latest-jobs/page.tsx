import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Search, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LatestJobsPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        jobs = await Job.find({ status: 'APPROVED' }).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('Latest jobs page error:', error);
    }

    return (
        <div className="section-premium">
            <div className="container-premium">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Latest Recruitments</h1>
                        <p className="text-slate-500 text-lg">Daily curated official updates from across Indian departments.</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-3">
                        <div className="flex-1 md:w-80 flex items-center px-4 border border-slate-200 rounded-xl bg-white">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter results..."
                                className="w-full py-3 text-sm bg-transparent outline-none ml-3"
                            />
                        </div>
                        <button className="w-12 h-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-premium py-16 text-center border-dashed border-2">
                            <p className="text-slate-500">No jobs found. The automation will populate this section.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
