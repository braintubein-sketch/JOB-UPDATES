import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Sparkles, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FreshersPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        // Looking for jobs with 'Freshers' or low experience
        jobs = await Job.find({
            status: 'PUBLISHED',
            $or: [
                { qualification: /Freshers/i },
                { experience: /None|0|Fresh/i },
                { title: /Freshers/i }
            ]
        }).sort({ createdAt: -1 }).limit(100).lean();
    } catch (error) {
        console.error('Freshers page error:', error);
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Page Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12">
                <div className="container-main">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} /> Entry Level
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Jobs for <span className="text-blue-600">Freshers</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-2 max-w-2xl">
                        Begin your professional journey with the best entry-level opportunities from top companies and government departments.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container-main py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}

                    {jobs.length === 0 && (
                        <div className="col-span-full py-24 text-center card">
                            <Search size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No active fresher jobs found.</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Checking for fresh graduate opportunities. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
