'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = ['All', 'Govt', 'Private', 'Result', 'Admit Card'];
const locations = ['All India', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Gujarat'];
const experiences = ['Freshers', '1-2 Years', '2-5 Years', '5+ Years'];
const qualifications = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'ITI'];

export default function JobFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

    const applyFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'All' || value === 'All India') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/latest-jobs?${params.toString()}`);
    };

    return (
        <div className="card">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-6">Filters</h3>

            {/* Category Filter */}
            <div className="filter-group">
                <div className="filter-title">Category</div>
                <div className="space-y-1">
                    {categories.map((cat) => (
                        <label key={cat} className="filter-option">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === cat}
                                onChange={() => {
                                    setSelectedCategory(cat);
                                    applyFilter('category', cat);
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
                <div className="filter-title">Location</div>
                <select
                    className="select text-sm"
                    defaultValue={searchParams.get('location') || ''}
                    onChange={(e) => applyFilter('location', e.target.value)}
                >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* Experience Filter */}
            <div className="filter-group">
                <div className="filter-title">Experience</div>
                <div className="space-y-1">
                    {experiences.map((exp) => (
                        <label key={exp} className="filter-option">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            {exp}
                        </label>
                    ))}
                </div>
            </div>

            {/* Qualification Filter */}
            <div className="filter-group border-b-0 pb-0 mb-0">
                <div className="filter-title">Qualification</div>
                <div className="space-y-1">
                    {qualifications.map((qual) => (
                        <label key={qual} className="filter-option">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            {qual}
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => router.push('/latest-jobs')}
                className="w-full mt-6 text-sm font-medium text-blue-600 hover:underline"
            >
                Clear All Filters
            </button>
        </div>
    );
}
