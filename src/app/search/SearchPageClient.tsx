'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp, X, Loader2, Sparkles, Zap, Globe } from 'lucide-react';
import JobCard, { JobCardSkeleton } from '@/components/jobs/JobCard';
import { Job } from '@/types';

const popularSearches = [
    'React Developer', 'Python', 'Java', 'AWS', 'Data Scientist', 'DevOps', 'Full Stack', 'Machine Learning', 'Node.js', 'Fresher',
];

const recentSearches = ['Software Engineer Google', 'AI Engineer Bangalore', 'Remote React'];

export default function SearchPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(query);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(!!query);

    const performSearch = useCallback(async (term: string) => {
        if (!term.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/jobs?q=${encodeURIComponent(term)}&limit=20`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (query) {
            performSearch(query);
        }
    }, [query, performSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleQuickSearch = (term: string) => {
        setSearchTerm(term);
        router.push(`/search?q=${encodeURIComponent(term)}`);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setJobs([]);
        setSearched(false);
        router.push('/search');
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="relative py-20 overflow-hidden text-center">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Infinite Search</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-12">
                        Seek & <span className="gradient-text italic">Succeed</span>
                    </h1>

                    {/* Search Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSearch}
                        className="max-w-4xl mx-auto relative glass p-2 rounded-[2rem] md:rounded-full border shadow-2xl overflow-hidden"
                    >
                        <div className="relative flex items-center">
                            <Search className="absolute left-6 w-6 h-6 text-primary" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Job title, company, or skill..."
                                className="w-full h-16 md:h-20 pl-16 pr-32 bg-transparent outline-none text-xl font-bold placeholder:text-muted-foreground/50"
                            />
                            <div className="absolute right-4 flex items-center gap-2">
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="p-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn-primary !h-12 !px-8 rounded-full font-black italic shadow-xl shadow-primary/20"
                                >
                                    HUNT
                                </button>
                            </div>
                        </div>
                    </motion.form>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    {!searched ? (
                        <motion.div
                            key="suggestions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="card-premium !p-8">
                                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-widest text-foreground mb-6">
                                        <Clock className="w-5 h-5 text-primary" />
                                        RETRACING STEPS
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => handleQuickSearch(term)}
                                                className="px-5 py-2.5 bg-secondary border border-border rounded-xl font-bold text-sm hover:border-primary transition-all"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-premium !p-8">
                                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-widest text-foreground mb-6">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        TRENDING NOW
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => handleQuickSearch(term)}
                                                className="tag !px-4 !py-2 !rounded-xl !font-bold hover:bg-primary hover:text-white"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between py-6 border-b border-border/50">
                                <h2 className="text-xl font-black tracking-tight">
                                    {loading ? 'HUNTING...' : `${jobs.length} RESULTS FOR "${query.toUpperCase()}"`}
                                </h2>
                                <button onClick={clearSearch} className="text-sm font-black text-primary hover:underline">
                                    RESET SEARCH
                                </button>
                            </div>

                            <div className="space-y-6">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <JobCardSkeleton key={i} />
                                    ))
                                ) : jobs.length > 0 ? (
                                    jobs.map((job, index) => (
                                        <JobCard key={job._id} job={job} index={index} />
                                    ))
                                ) : (
                                    <div className="text-center py-20 card-premium">
                                        <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                            <Zap className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-4">No Prey Found</h3>
                                        <p className="text-lg text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
                                            The job you are looking for might be elusive. Try adjusting your search query.
                                        </p>
                                        <button onClick={clearSearch} className="btn-secondary !rounded-2xl">
                                            BACK TO EXPLORE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
