'use client';

import { prisma } from '@/lib/prisma';
import JobCard from '@/components/JobCard';
import { Search, Filter } from 'lucide-react';

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

    const jobs = await (prisma as any).job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 30,
    }).catch(() => []);

    return (
        <div className="py-20">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-medium">
                        <h1 className="hero-title mb-4" style={{ fontSize: '40px' }}>{title}</h1>
                        <p className="text-secondary">{description}</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="flex-1 md:w-80 flex items-center px-4 gap-2" style={{ backgroundColor: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <Search size={18} className="text-secondary" />
                            <input type="text" placeholder="Filter by keyword..." className="w-full py-3" style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: 'inherit' }} />
                        </div>
                        <button className="flex items-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer', color: 'inherit' }}>
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>

                {jobs.length === 0 && (
                    <div className="card-premium text-center py-24" style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}>
                        <p className="text-secondary italic">Stay tuned! Verified updates for this category will appear here shortly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
