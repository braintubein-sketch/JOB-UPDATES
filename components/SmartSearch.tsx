'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface SmartSearchProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    categories?: string[];
    states?: string[];
}

interface SearchFilters {
    category: string;
    state: string;
    sortBy: string;
}

export default function SmartSearch({ onSearch, categories = [], states = [] }: SmartSearchProps) {
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        category: '',
        state: '',
        sortBy: 'latest'
    });

    const defaultCategories = ['Govt', 'Private', 'Railway', 'Banking', 'Defence', 'Teaching', 'PSU', 'Result', 'Admit Card'];
    const defaultStates = ['All India', 'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];

    const handleSearch = useCallback(() => {
        onSearch(query, filters);
    }, [query, filters, onSearch]);

    useEffect(() => {
        const debounce = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounce);
    }, [query, filters, handleSearch]);

    const clearSearch = () => {
        setQuery('');
        setFilters({ category: '', state: '', sortBy: 'latest' });
    };

    return (
        <div className="w-full space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search jobs, organizations, or keywords..."
                        className="input pl-12 pr-12 py-4 text-base"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn px-5 py-4 flex items-center gap-2 ${showFilters
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'btn-secondary border border-slate-200 dark:border-slate-800'
                        }`}
                >
                    <SlidersHorizontal size={18} />
                    Filters
                    <ChevronDown size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="card bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="select text-sm"
                            >
                                <option value="">All Categories</option>
                                {(categories.length > 0 ? categories : defaultCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">State</label>
                            <select
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                                className="select text-sm"
                            >
                                <option value="">All States</option>
                                {(states.length > 0 ? states : defaultStates).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="select text-sm"
                            >
                                <option value="latest">Latest First</option>
                                <option value="lastDate">Last Date Soon</option>
                                <option value="salary">Highest Salary</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <button
                            onClick={clearSearch}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
