'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Moon, Sun, ShieldCheck } from 'lucide-react';

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
        <nav className={`glass-header transition-all duration-500 ${scrolled ? 'py-2 shadow-md' : 'py-4'}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Job Updates India" className="h-10 md:h- 12 w-auto object-contain transition-transform group-hover:scale-105" />
                    <div className="hidden lg:block border-l border-border-hard pl-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary leading-none">Verified</span>
                        <div className="text-[10px] font-bold text-accent">Source Portal</div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold text-secondary hover:text-primary transition-colors tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="flex items-center gap-6 border-l border-border-hard pl-8 ml-2">
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <Link href="/latest-jobs" className="btn-premium btn-primary py-2.5 px-6 text-sm">
                            Search Jobs
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 text-secondary">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-3 bg-primary/5 rounded-xl text-primary">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-[200] bg-white animate-fade-in p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <img src="/logo.png" alt="Logo" className="h-10" />
                        <button onClick={() => setIsOpen(false)} className="p-3 bg-primary/5 rounded-full text-primary">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-3xl font-extrabold tracking-tight"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-12 border-t border-border-soft">
                        <Link href="/latest-jobs" className="btn-premium btn-primary w-full justify-center py-4 text-lg">
                            Get Notifications
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
