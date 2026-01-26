'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Latest Jobs', href: '/latest-jobs' },
        { name: 'Govt Jobs', href: '/govt-jobs' },
        { name: 'Private Jobs', href: '/private-jobs' },
        { name: 'Results', href: '/results' },
        { name: 'Admit Cards', href: '/admit-cards' },
    ];

    return (
        <header className="glass-header">
            <div className="container-premium flex items-center justify-between h-[80px]">
                {/* BRAND LOGO - High click visibility */}
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700 p-1">
                        <img src="/favicon.png" alt="Job Updates Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                            Job<span className="text-primary-600">Updates</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Official Portal</span>
                    </div>
                </Link>

                {/* DESKTOP NAV - Standard Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="nav-link"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
                    <ThemeToggle />
                    <Link href="/contact" className="btn-action bg-slate-900 dark:bg-primary-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-slate-800">
                        Join Community
                    </Link>
                </nav>

                {/* MOBILE ACTIONS */}
                <div className="lg:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-900 dark:text-white ring-primary/10 transition-all active:bg-slate-50"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* MOBILE OVERLAY MENU - Fixed Z-Index & Clickability */}
            {isOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[80px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-[200] p-6 animate-premium">
                    <ul className="flex flex-col gap-6">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between text-lg font-extrabold text-slate-800 dark:text-slate-100 active:text-primary-600"
                                >
                                    {item.name}
                                    <ChevronDown size={20} className="-rotate-90 text-slate-300 dark:text-slate-600" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="btn-action btn-primary text-sm py-4">
                            Contact Us
                        </Link>
                        <Link href="/admin" onClick={() => setIsOpen(false)} className="btn-action btn-outline text-sm py-4">
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
