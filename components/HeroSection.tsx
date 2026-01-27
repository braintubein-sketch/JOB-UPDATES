'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, TrendingUp } from 'lucide-react';

const popularSearches = [
    { label: 'Railway', href: '/latest-jobs?q=railway' },
    { label: 'SSC', href: '/latest-jobs?q=ssc' },
    { label: 'Bank', href: '/latest-jobs?q=bank' },
    { label: 'Police', href: '/latest-jobs?q=police' },
    { label: 'Teaching', href: '/latest-jobs?q=teacher' },
    { label: 'IT / Software', href: '/latest-jobs?q=it' },
];

export default function HeroSection() {
    const router = useRouter();
    const [keyword, setKeyword] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        router.push(`/latest-jobs?${params.toString()}`);
    };

    return (
        <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 py-16 lg:py-20">
            <div className="container-main text-center">

                {/* Headline */}

                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                    Find Government & Private <br className="hidden md:block" />
                    <span className="text-blue-600">Jobs in India</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Search 500+ active recruitment notifications, exam results, and admit cards updated today.
                </p>

                {/* Search Box */}
                <div className="max-w-2xl mx-auto mb-10">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <Search className="absolute left-4 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Job Title, Department, or Qualification..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full h-14 pl-12 pr-32 rounded-full border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-900 dark:text-white dark:bg-slate-900 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full font-bold transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium mr-2">Trending:</span>
                    {popularSearches.map((search) => (
                        <a
                            key={search.label}
                            href={search.href}
                            className="hover:text-blue-600 hover:underline decoration-blue-600 underline-offset-4 transition-all"
                        >
                            {search.label}
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}

