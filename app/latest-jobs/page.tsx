import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Search, Filter, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LatestJobsPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        // Updated to use PUBLISHED status and lean() for performance
        jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(100).lean();
    } catch (error) {
        console.error('Latest jobs page error:', error);
    }

    return (
        <div className="container-premium py-12">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3">
                        <Sparkles size={12} /> Live Database
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Latest Openings</h1>
                    <p className="text-slate-500 font-medium text-lg mt-1">Official notifications from Central & State portals.</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 md:w-[350px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search organization or post..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 outline-none transition-all font-bold text-sm"
                        />
                    </div>
                    <button className="btn-action bg-white border border-slate-200 text-slate-600 h-[60px] px-6">
                        <Filter size={20} className="mr-2" /> Filters
                    </button>
                </div>
            </div>

            {/* LISTINGS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.length > 0 ? (
                    jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">No matching updates.</h2>
                        <p className="text-slate-500 font-bold mt-2">The automated scanner is checking official signals 24/7.</p>
                        <Link href="/api/cron/fetch" className="btn-action btn-primary mt-8 px-8">Trigger Scan Now</Link>
                    </div>
                )}
            </div>

        </div>
    );
}
