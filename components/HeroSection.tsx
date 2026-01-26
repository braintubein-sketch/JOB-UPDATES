'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, TrendingUp, Building2, Award } from 'lucide-react';

const popularSearches = [
    { label: 'Railway Jobs', href: '/latest-jobs?q=railway' },
    { label: 'SSC', href: '/latest-jobs?q=ssc' },
    { label: 'Bank Jobs', href: '/latest-jobs?q=bank' },
    { label: 'Police', href: '/latest-jobs?q=police' },
    { label: 'Teacher', href: '/latest-jobs?q=teacher' },
    { label: 'IT Jobs', href: '/latest-jobs?q=it' },
];

const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '500+' },
    { icon: Building2, label: 'Companies', value: '200+' },
    { icon: Award, label: 'Results Posted', value: '1000+' },
];

export default function HeroSection() {
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (location) params.set('location', location);
        router.push(`/latest-jobs?${params.toString()}`);
    };

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 md:py-24 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-20" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-10" />
            </div>

            <div className="container-main relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
                        <TrendingUp size={16} />
                        2026 Batch Recruitment Updates
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        Find Your <span className="text-blue-600">Dream Career</span>
                        <br className="hidden md:block" /> in Official Portals
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                        Access verified government and private job notifications. Updated 24/7 from official sources.
                    </p>
                </div>

                {/* Search Box - Optimized for Mobile */}
                <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-10 px-2 md:px-0">
                    <div className="bg-white dark:bg-slate-900 p-2 md:p-3 rounded-2xl md:rounded-full border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row items-stretch gap-2">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                            <Search size={20} className="text-blue-600" />
                            <input
                                type="text"
                                placeholder="Job title or keyword"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0">
                            <MapPin size={20} className="text-blue-600" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <button type="submit" className="btn-primary py-4 md:py-2 px-8 rounded-xl md:rounded-full">
                            Search Jobs
                        </button>
                    </div>
                </form>

                {/* Popular Searches */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <span className="text-sm text-slate-500 dark:text-slate-400 mr-3">Popular:</span>
                    <div className="inline-flex flex-wrap gap-2 justify-center">
                        {popularSearches.map((search) => (
                            <a key={search.label} href={search.href} className="chip">
                                {search.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 md:gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-3">
                                <stat.icon size={24} />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
