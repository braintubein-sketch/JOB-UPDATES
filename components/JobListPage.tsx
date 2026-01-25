import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import { Search } from 'lucide-react';

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

        // Create query
        const query: any = { status: 'APPROVED' };
        if (category) query.category = category;

        jobs = await Job.find(query).sort({ createdAt: -1 }).limit(50).lean();
    } catch (error) {
        console.error('Job list page error:', error);
    }

    return (
        <div className="section">
            <div className="container">
                <div className="mb-16">
                    <h1 className="display-2 mb-4">{title}</h1>
                    <p className="text-secondary text-lg">{description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {jobs.map((job: any) => (
                        <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-3 card-stack py-24 text-center border-dashed">
                            <p className="text-secondary italic">Stay Tuned. Official updates are appearing here shortly.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
