'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

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
    }, [query, handleSearch]);

    const clearSearch = () => {
        setQuery('');
        setFilters({ category: '', state: '', sortBy: 'latest' });
    };

    return (
        <div className="w-full space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search jobs by title, organization, or keywords..."
                        className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-base transition-all"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-5 py-4 border rounded-xl flex items-center gap-2 font-semibold transition-all ${showFilters ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 hover:border-primary-500'
                        }`}
                >
                    <Filter size={18} />
                    Filters
                    <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All Categories</option>
                                {(categories.length > 0 ? categories : defaultCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">State</label>
                            <select
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All States</option>
                                {(states.length > 0 ? states : defaultStates).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="latest">Latest First</option>
                                <option value="lastDate">Last Date Soon</option>
                                <option value="salary">Highest Salary</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={clearSearch}
                            className="text-sm font-semibold text-slate-500 hover:text-primary-600"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
