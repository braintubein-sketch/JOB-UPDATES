import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Search, Filter } from 'lucide-react';

export default async function LatestJobsPage() {
    await dbConnect();
    const jobs = await Job.find({ status: 'APPROVED' }).sort({ createdAt: -1 }).limit(50).lean();

    return (
        <div className="section">
            <div className="container">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <h1 className="display-2 mb-4">Latest Recruitments</h1>
                        <p className="text-secondary text-lg">Daily curated official updates from across Indian departments.</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="flex-1 md:w-80 flex items-center px-6 border border-border rounded-xl bg-surface">
                            <Search size={18} className="text-secondary" />
                            <input
                                type="text"
                                placeholder="Filter results..."
                                className="w-full py-4 text-sm font-bold bg-transparent outline-none ml-4"
                            />
                        </div>
                        <button className="w-14 h-14 border border-border rounded-xl flex items-center justify-center hover:text-primary">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-stack py-24 text-center border-dashed">
                            <p className="text-secondary italic">Stay Tuned. Our crawler is currently fetching new official notifications.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
