import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';

export const dynamic = 'force-dynamic';

export default async function FreshersJobsPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        jobs = await Job.find({ status: 'APPROVED' }).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('Freshers jobs page error:', error);
    }

    return (
        <div className="section-premium">
            <div className="container-premium">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Freshers Jobs 2026</h1>
                    <p className="text-slate-500 text-lg">Entry-level opportunities for recent graduates.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-premium py-16 text-center border-dashed border-2">
                            <p className="text-slate-500">No freshers jobs available. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
