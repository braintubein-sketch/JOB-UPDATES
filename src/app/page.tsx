import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import JobCategories from '@/components/home/JobCategories';
import LatestJobs from '@/components/home/LatestJobs';
import TopCompanies from '@/components/home/TopCompanies';
import TelegramCTA from '@/components/home/TelegramCTA';

export default function HomePage() {
    return (
        <main className="relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-accent/5 blur-[120px] rounded-full" />
            </div>

            <Hero />

            <div className="pb-24">
                <Suspense fallback={<HomeSectionSkeleton />}>
                    <LatestJobs />
                </Suspense>
            </div>
        </main>
    );
}

function HomeSectionSkeleton() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 animate-pulse">
                    <div className="space-y-4">
                        <div className="h-4 w-32 bg-secondary rounded-full" />
                        <div className="h-12 w-64 bg-secondary rounded-2xl" />
                        <div className="h-4 w-96 bg-secondary rounded-full" />
                    </div>
                    <div className="h-12 w-40 bg-secondary rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card-premium h-80 bg-secondary/20 animate-pulse" />
                    ))}
                </div>
            </div>
        </section>
    );
}
