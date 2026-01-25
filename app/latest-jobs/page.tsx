import { prisma } from '@/lib/prisma';
import JobCard from '@/components/JobCard';
import { Search, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LatestJobsPage() {
    const jobs = await prisma.job.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 20,
    }).catch(() => []);

    // Fallback to mock data if DB is empty for demo
    const displayJobs = jobs.length > 0 ? jobs : [
        {
            id: '1', slug: 'upsc-2026', title: 'UPSC Civil Services 2026', organization: 'UPSC',
            qualification: 'Graduate', category: 'Govt', createdAt: new Date().toISOString()
        },
        {
            id: '2', slug: 'ssc-cgl', title: 'SSC CGL 2026 Notification', organization: 'SSC',
            qualification: 'Graduate', category: 'Govt', createdAt: new Date().toISOString()
        },
    ];

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Latest Job Updates</h1>
                    <p className="text-secondary">Explore all active job notifications from across India.</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="flex-1 md:w-80 flex items-center px-4 gap-2 bg-card-bg rounded-xl border border-border">
                        <Search size={18} className="text-secondary" />
                        <input type="text" placeholder="Filter by keyword..." className="w-full py-3 bg-transparent outline-none text-sm" />
                    </div>
                    <button className="btn btn-outline">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayJobs.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
