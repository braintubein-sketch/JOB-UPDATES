import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';

export const dynamic = 'force-dynamic';

interface JobListPageProps {
    title: string;
    description: string;
    category?: string;
    type?: string;
}

export default async function JobListPage({ title, description, category, type }: JobListPageProps) {
    let jobs: any[] = [];

    try {
        await dbConnect();
        const query: any = { status: 'APPROVED' };
        if (category) query.category = category;
        jobs = await Job.find(query).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('Job list page error:', error);
    }

    return (
        <div className="section-premium">
            <div className="container-premium">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">{title}</h1>
                    <p className="text-slate-500 text-lg">{description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-premium py-16 text-center border-dashed border-2">
                            <p className="text-slate-500">No listings available. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
