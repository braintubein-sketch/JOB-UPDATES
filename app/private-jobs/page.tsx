import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Briefcase, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PrivateJobsPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        jobs = await Job.find({ status: 'PUBLISHED', category: 'Private' }).sort({ createdAt: -1 }).limit(100).lean();
    } catch (error) {
        console.error('Private jobs page error:', error);
    }

    return (
        <div className="container-premium py-12">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                    <Briefcase size={12} /> Career Opportunities
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Private Sector</h1>
                <p className="text-slate-500 font-medium text-lg mt-1">Latest vacancies from top MNCs and IT companies.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job: any) => (
                    <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                        <Search size={32} className="text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-slate-900">No private listings yet.</h2>
                        <p className="text-slate-500 font-bold mt-2">Check back soon for MNC openings.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
