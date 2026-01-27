'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Briefcase, Building2, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const mainNav = [
        { name: 'Latest Jobs', href: '/latest-jobs' },
        { name: 'Govt Jobs', href: '/govt-jobs' },
        { name: 'Private Jobs', href: '/private-jobs' },
        { name: 'Results', href: '/results' },
        { name: 'Admit Card', href: '/admit-cards' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <header className="nav-header">
                <div className="container-main">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                                <Briefcase size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Job<span className="text-blue-600">Updates</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {mainNav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`nav-link ${pathname === item.href ? 'nav-link-active' : ''}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Right Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <ThemeToggle />
                            {/* Optional: Add search icon or login if needed, keeping it simple for now */}
                        </div>

                        {/* Mobile Right Actions */}
                        <div className="flex lg:hidden items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200"
                                aria-label="Toggle Menu"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg">
                        <nav className="flex flex-col py-2">
                            {mainNav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wide border-b border-slate-50 dark:border-slate-800 last:border-0 ${pathname === item.href
                                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Navigation - Sticky */}
            <nav className="mobile-nav safe-area-inset-bottom">
                <div className="flex justify-around items-center">
                    <Link href="/" className={pathname === '/' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Briefcase size={20} />
                        <span className="text-[10px] font-bold mt-1">Home</span>
                    </Link>
                    <Link href="/latest-jobs" className={pathname === '/latest-jobs' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Search size={20} />
                        <span className="text-[10px] font-bold mt-1">Search</span>
                    </Link>
                    <Link href="/govt-jobs" className={pathname === '/govt-jobs' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Building2 size={20} />
                        <span className="text-[10px] font-bold mt-1">Govt</span>
                    </Link>
                    <Link href="/login" className={pathname === '/login' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <User size={20} />
                        <span className="text-[10px] font-bold mt-1">Profile</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
