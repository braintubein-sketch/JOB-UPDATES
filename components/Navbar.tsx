'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, Bell, ChevronDown, Briefcase, Building2, Award, FileText } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState<string | null>(null);

    const mainNav = [
        { name: 'Jobs', href: '/latest-jobs', icon: Briefcase },
        { name: 'Govt Jobs', href: '/govt-jobs', icon: Building2 },
        { name: 'Results', href: '/results', icon: Award },
        { name: 'Admit Cards', href: '/admit-cards', icon: FileText },
    ];

    return (
        <>
            <header className="nav-header">
                <div className="container-main">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Briefcase className="text-white" size={20} />
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                                    Job<span className="text-blue-600">Updates</span>
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Official Portal</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {mainNav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="nav-link flex items-center gap-1.5"
                                >
                                    <item.icon size={16} />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Right Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <ThemeToggle />

                            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                                <Bell size={18} />
                            </button>

                            <Link href="/login" className="btn-secondary btn-sm">
                                Login
                            </Link>

                            <Link href="/register" className="btn-primary btn-sm">
                                Register
                            </Link>
                        </div>

                        {/* Mobile Right Actions */}
                        <div className="flex lg:hidden items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                {isOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-fade-in-up">
                        <div className="container-main py-4">
                            <nav className="flex flex-col gap-1">
                                {mainNav.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <item.icon size={20} className="text-blue-600" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                                <Link href="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center">
                                    Login
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav safe-area-inset-bottom">
                <div className="flex justify-around">
                    <Link href="/" className="mobile-nav-item-active">
                        <Briefcase size={20} />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link href="/latest-jobs" className="mobile-nav-item">
                        <Search size={20} />
                        <span className="text-[10px] font-medium">Search</span>
                    </Link>
                    <Link href="/govt-jobs" className="mobile-nav-item">
                        <Building2 size={20} />
                        <span className="text-[10px] font-medium">Govt</span>
                    </Link>
                    <Link href="/results" className="mobile-nav-item">
                        <Award size={20} />
                        <span className="text-[10px] font-medium">Results</span>
                    </Link>
                    <Link href="/login" className="mobile-nav-item">
                        <User size={20} />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
