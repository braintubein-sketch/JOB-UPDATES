'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Briefcase,
    X,
    ChevronDown,
    Zap,
} from 'lucide-react';
import { JOB_CATEGORIES, POPULAR_LOCATIONS, EXPERIENCE_LEVELS } from '@/types';

interface SearchBarProps {
    sticky?: boolean;
    compact?: boolean;
}

export default function SearchBar({ sticky = false, compact = false }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');

    const [showLocations, setShowLocations] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    const locationRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setShowLocations(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setShowCategories(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (location) params.set('location', location);
        if (category) params.set('category', category);
        router.push(`/jobs?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className={`w-full ${sticky ? 'sticky top-24 md:top-32 z-[90]' : ''}`}>
            <div className="flex flex-col lg:flex-row items-stretch gap-2 bg-secondary/30 p-2 md:p-3 rounded-3xl md:rounded-[2.5rem] border border-border/50 backdrop-blur-md shadow-2xl">

                {/* Keyword Input */}
                <div className="flex-1 relative min-w-[200px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <input
                        type="text"
                        placeholder="Search IT jobs, skills..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-14 md:h-16 bg-transparent pl-14 pr-6 rounded-full outline-none font-bold text-foreground placeholder:text-muted-foreground/60 focus:bg-white/5 transition-colors"
                    />
                </div>

                <div className="hidden lg:block w-px h-10 bg-border/50 self-center" />

                {/* Location Selector */}
                <div className="relative flex-1" ref={locationRef}>
                    <button
                        onClick={() => setShowLocations(!showLocations)}
                        className="w-full h-14 md:h-16 flex items-center justify-between px-6 rounded-2xl md:rounded-full hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                            <span className={`font-bold ${location ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                                {location || 'All Locations'}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <AnimatePresence>
                        {showLocations && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-3 p-3 bg-card border border-border rounded-3xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                            >
                                <button
                                    onClick={() => { setLocation(''); setShowLocations(false); }}
                                    className="w-full p-4 text-left font-bold rounded-2xl hover:bg-secondary transition-colors"
                                >
                                    All Locations
                                </button>
                                {POPULAR_LOCATIONS.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => { setLocation(loc); setShowLocations(false); }}
                                        className={`w-full p-4 text-left font-bold rounded-2xl transition-colors ${location === loc ? 'bg-primary text-white' : 'hover:bg-secondary text-muted-foreground'}`}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="hidden lg:block w-px h-10 bg-border/50 self-center" />

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="h-14 md:h-16 px-10 btn-primary rounded-2xl md:rounded-full flex items-center justify-center gap-3 shadow-xl"
                >
                    <Zap className="w-5 h-5 fill-white" />
                    <span className="font-black italic">HUNT</span>
                </button>
            </div>
        </div>
    );
}
