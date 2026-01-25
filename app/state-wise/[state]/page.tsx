import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';

export default async function StateJobsPage({ params }: { params: { state: string } }) {
    await dbConnect();
    const stateName = params.state.charAt(0).toUpperCase() + params.state.slice(1);
    const jobs = await Job.find({
        status: 'APPROVED',
        state: { $regex: new RegExp(`^${params.state}$`, 'i') }
    }).sort({ createdAt: -1 }).limit(50).lean();

    return (
        <div className="section">
            <div className="container">
                <div className="mb-16">
                    <h1 className="display-2 mb-4">Jobs in {stateName}</h1>
                    <p className="text-secondary text-lg">Verified government and private sector recruitments specifically for {stateName}.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-stack py-24 text-center border-dashed">
                            <p className="text-secondary italic">No active listings for {stateName} at the moment. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
