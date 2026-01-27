import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
    title: 'Search IT Jobs',
    description: 'Search through thousands of IT jobs. Find software, data, AI/ML, cloud, and DevOps opportunities matching your skills.',
};

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchPageLoading />}>
            <SearchPageClient />
        </Suspense>
    );
}

function SearchPageLoading() {
    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="h-8 w-48 skeleton rounded mb-4" />
                <div className="h-14 skeleton rounded-xl mb-8" />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-32 skeleton rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
