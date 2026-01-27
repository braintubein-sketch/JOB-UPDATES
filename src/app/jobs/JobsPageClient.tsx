'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, LayoutGrid, List, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '@/components/jobs/SearchBar';
import JobCard, { JobCardSkeleton } from '@/components/jobs/JobCard';
import { Job } from '@/types';

export default function JobsPageClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchParams.toString());
            const res = await fetch(`/api/jobs?${params}`);
            const data = await res.json();

            if (data.success) {
                setJobs(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/jobs?${params}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Search Section */}
            <div className="relative py-12 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
                            Find Your <span className="gradient-text italic">Dream Job</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                            {pagination.total > 0
                                ? `Showing ${pagination.total.toLocaleString()} premium opportunities`
                                : 'Explore positions at the world\'s most innovative companies'}
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto glass p-4 md:p-6 rounded-[2.5rem] shadow-2xl">
                        <SearchBar />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Filters & View Toggle */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 py-6 border-y border-border/50">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="font-bold text-sm">FRESH LISTINGS</span>
                        </div>
                        {pagination.total > 0 && (
                            <span className="text-sm font-bold text-muted-foreground">
                                PAGE {pagination.page} OF {pagination.totalPages}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 bg-secondary/50 p-1.5 rounded-2xl border border-border">
                        <button
                            onClick={() => setView('grid')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            GRID
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            LIST
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`grid gap-8 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <JobCardSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : jobs.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`grid gap-8 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                        >
                            {jobs.map((job, index) => (
                                <JobCard key={job._id} job={job} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 glass rounded-[3rem] border-dashed border-2 border-border"
                        >
                            <div className="w-24 h-24 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <Search className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">No results found</h3>
                            <p className="text-xl text-muted-foreground font-medium mb-10 max-w-md mx-auto">
                                We couldn&apos;t find any jobs matching your current search criteria. Try broadening your reach.
                            </p>
                            <button
                                onClick={() => router.push('/jobs')}
                                className="btn-primary h-16 rounded-3xl"
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-20">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrev}
                            className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center disabled:opacity-30 transition-all hover:bg-secondary/80"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: pagination.totalPages }).map((_, i) => {
                                const pageNum = i + 1;
                                if (
                                    pageNum === 1 ||
                                    pageNum === pagination.totalPages ||
                                    (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-14 h-14 rounded-2xl border font-black transition-all ${pagination.page === pageNum
                                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                    : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    pageNum === pagination.page - 2 ||
                                    pageNum === pagination.page + 2
                                ) {
                                    return <span key={pageNum} className="text-muted-foreground font-black px-2">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNext}
                            className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center disabled:opacity-30 transition-all hover:bg-secondary/80"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
