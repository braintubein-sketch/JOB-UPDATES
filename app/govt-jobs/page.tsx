import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Landmark, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GovtJobsPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        jobs = await Job.find({ status: 'PUBLISHED', category: 'Govt' }).sort({ createdAt: -1 }).limit(100).lean();
    } catch (error) {
        console.error('Govt jobs page error:', error);
    }

    return (
        <div className="container-premium py-12">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                    <Landmark size={12} /> Central & State
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Government Jobs</h1>
                <p className="text-slate-500 font-medium text-lg mt-1">Verified recruitments from official department portals.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job: any) => (
                    <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                        <Search size={32} className="text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-slate-900">No govt jobs at the moment.</h2>
                        <p className="text-slate-500 font-bold mt-2">Checking official portals for fresh notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
