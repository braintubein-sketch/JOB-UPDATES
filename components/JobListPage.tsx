'use client';

import { prisma } from '@/lib/prisma';
import JobCard from '@/components/JobCard';
import { Search } from 'lucide-react';

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
        <div className="section">
            <div className="container">
                <div className="mb-24">
                    <h1 className="section-title mb-8">{title}</h1>
                    <p className="hero-subtitle" style={{ margin: 0, textAlign: 'left', fontSize: '20px' }}>{description}</p>
                </div>

                <div className="mb-24 flex items-center gap-4" style={{ maxWidth: '400px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    <Search size={16} className="text-secondary" />
                    <input
                        type="text"
                        placeholder="Search within these results..."
                        className="w-full text-sm"
                        style={{ background: 'none', border: 'none', outline: 'none', color: 'inherit' }}
                    />
                </div>

                <div className="grid grid-3">
                    {jobs.map((job: any) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>

                {jobs.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '100px 0', borderStyle: 'dashed' }}>
                        <p className="text-secondary italic">Stay tuned. Verified updates for this category will appear here shortly.</p>
                    </div>
                )}
            </div>
            <style jsx>{`
        .mb-24 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 8px; }
        .gap-4 { gap: 16px; }
      `}</style>
        </div>
    );
}
