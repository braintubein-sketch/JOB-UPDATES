'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Moon, Sun, Briefcase, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const navLinks = [
        { name: 'Latest Jobs', href: '/latest-jobs' },
        { name: 'Govt Jobs', href: '/govt-jobs' },
        { name: 'Private Jobs', href: '/private-jobs' },
        { name: 'Results', href: '/results' },
        { name: 'Admit Cards', href: '/admit-cards' },
    ];

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 glass shadow-premium' : 'py-8'}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                        <Briefcase className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight leading-none">Job<span className="text-primary">Updates</span></span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-text-muted mt-1 opacity-60">Verified Portal</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-8 pr-10 border-r border-border-light">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-text-muted hover:text-primary transition-colors tracking-wide relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center hover:bg-white transition-all shadow-soft">
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <Link href="/latest-jobs" className="btn-luxury btn-lux-primary py-2.5 px-6 text-sm">
                            Quick Search
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 text-text-muted">
                        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 rounded-2xl bg-surface border border-border-light flex items-center justify-center text-primary shadow-soft">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-[200] bg-surface animate-fade-in p-8 flex flex-col justify-center">
                    <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 p-3 bg-primary/10 rounded-full text-primary">
                        <X size={28} />
                    </button>

                    <div className="flex flex-col gap-8 text-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-4xl font-black tracking-tight hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 border-t border-border-light pt-10">
                        <Link href="/latest-jobs" className="btn-luxury btn-lux-primary w-full justify-center py-5 text-xl">
                            Search Vacancies
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
