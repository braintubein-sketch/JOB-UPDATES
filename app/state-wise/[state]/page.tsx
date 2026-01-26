import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { MapPin, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StateJobsPage({ params }: { params: { state: string } }) {
    let jobs: any[] = [];
    const stateNameRaw = params.state.replace('-', ' ');
    const stateName = stateNameRaw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    try {
        await dbConnect();
        jobs = await Job.find({
            status: 'PUBLISHED',
            $or: [
                { state: { $regex: new RegExp(stateNameRaw, 'i') } },
                { location: { $regex: new RegExp(stateNameRaw, 'i') } }
            ]
        }).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('State jobs page error:', error);
    }

    return (
        <div className="container-premium py-12">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3">
                    <MapPin size={12} /> Regional Alerts
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Jobs in {stateName}</h1>
                <p className="text-slate-500 font-medium text-lg mt-1">Official state government and local center recruitments.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job: any) => (
                    <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                        <Search size={32} className="text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-slate-900">No jobs listed for {stateName} yet.</h2>
                        <p className="text-slate-500 font-bold mt-2">Checking state PSC and district boards for updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
