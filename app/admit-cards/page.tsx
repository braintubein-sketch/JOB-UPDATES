import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';

export const dynamic = 'force-dynamic';

export default async function AdmitCardsPage() {
    let jobs: any[] = [];

    try {
        await dbConnect();
        jobs = await Job.find({ status: 'APPROVED', category: 'Admit Card' }).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('Admit cards page error:', error);
    }

    return (
        <div className="section-premium">
            <div className="container-premium">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Download Admit Cards</h1>
                    <p className="text-slate-500 text-lg">Official hall tickets and admit card download links.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-premium py-16 text-center border-dashed border-2">
                            <p className="text-slate-500">No admit cards available. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
