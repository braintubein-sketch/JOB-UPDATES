import { Suspense } from 'react';
import { Metadata } from 'next';
import JobsPageClient from './JobsPageClient';

export const metadata: Metadata = {
    title: 'Browse IT Jobs',
    description: 'Browse 5000+ curated IT jobs from top companies. Software Engineer, AI/ML, Cloud, DevOps, Full Stack & more. Filter by location, experience, and category.',
};

export default function JobsPage() {
    return (
        <Suspense fallback={<JobsPageLoading />}>
            <JobsPageClient />
        </Suspense>
    );
}

function JobsPageLoading() {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-8 w-48 skeleton rounded mb-2" />
                    <div className="h-5 w-64 skeleton rounded" />
                </div>

                {/* Search Skeleton */}
                <div className="h-48 skeleton rounded-2xl mb-8" />

                {/* Jobs Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-xl border border-border p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl skeleton" />
                                <div className="flex-1">
                                    <div className="h-4 w-24 skeleton rounded mb-2" />
                                    <div className="h-6 w-48 skeleton rounded" />
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="h-4 w-36 skeleton rounded" />
                                <div className="h-4 w-40 skeleton rounded" />
                            </div>
                            <div className="flex gap-2 mb-4">
                                <div className="h-6 w-16 skeleton rounded-full" />
                                <div className="h-6 w-20 skeleton rounded-full" />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <div className="flex-1 h-10 skeleton rounded-lg" />
                                <div className="w-24 h-10 skeleton rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
