import { prisma } from '@/lib/prisma';
import JobCard from '@/components/JobCard';
import { Search, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface JobListPageProps {
    title: string;
    description: string;
    category?: string;
    subCategory?: string;
    state?: string;
}

export default async function JobListPage({ title, description, category, subCategory, state }: JobListPageProps) {
    const where: any = { status: 'APPROVED' };
    if (category) where.category = category;
    if (subCategory) where.subCategory = subCategory;
    if (state) where.state = state;

    const jobs = await prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 30,
    }).catch(() => []);

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className="text-secondary">{description}</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="flex-1 md:w-80 flex items-center px-4 gap-2 bg-card-bg rounded-xl border border-border">
                        <Search size={18} className="text-secondary" />
                        <input type="text" placeholder="Filter jobs..." className="w-full py-3 bg-transparent outline-none text-sm" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {jobs.length === 0 && (
                <div className="text-center py-20 bg-card-bg rounded-2xl border border-dashed border-border">
                    <p className="text-secondary italic">Stay tuned! Official updates for this category will appear here soon.</p>
                </div>
            )}
        </div>
    );
}
