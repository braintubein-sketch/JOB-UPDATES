import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';

export const dynamic = 'force-dynamic';

export default async function StateJobsPage({ params }: { params: { state: string } }) {
    let jobs: any[] = [];
    const stateName = params.state.charAt(0).toUpperCase() + params.state.slice(1).replace('-', ' ');

    try {
        await dbConnect();
        jobs = await Job.find({
            status: 'APPROVED',
            state: { $regex: new RegExp(params.state.replace('-', ' '), 'i') }
        }).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('State jobs page error:', error);
    }

    return (
        <div className="section-premium">
            <div className="container-premium">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Jobs in {stateName}</h1>
                    <p className="text-slate-500 text-lg">Verified recruitments for {stateName}.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-premium py-16 text-center border-dashed border-2">
                            <p className="text-slate-500">No jobs available for {stateName}. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
