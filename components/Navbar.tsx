'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, Bell, Briefcase, Building2, Award, FileText, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const mainNav = [
        { name: 'Jobs', href: '/latest-jobs', icon: Briefcase },
        { name: 'Govt Jobs', href: '/govt-jobs', icon: Building2 },
        { name: 'Results', href: '/results', icon: Award },
        { name: 'Admit Cards', href: '/admit-cards', icon: FileText },
        { name: 'Blog', href: '/blog', icon: BookOpen },
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
                                    className={`nav-link flex items-center gap-1.5 ${pathname === item.href ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
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

                            <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
                                Login
                            </Link>

                            <Link href="/register" className="btn-primary px-4 py-2 text-sm">
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

                {/* Mobile Menu (Top Dropdown) */}
                {isOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-fade-in-up">
                        <div className="container-main py-4">
                            <nav className="flex flex-col gap-1">
                                {mainNav.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === item.href
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <item.icon size={20} className={pathname === item.href ? 'text-blue-600' : 'text-slate-400'} />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                                <Link href="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center py-3">
                                    Login
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center py-3">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Navigation - App Style */}
            <nav className="mobile-nav safe-area-inset-bottom">
                <div className="flex justify-around items-center h-full max-w-md mx-auto">
                    <Link href="/" className={pathname === '/' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Briefcase size={22} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
                    </Link>
                    <Link href="/latest-jobs" className={pathname === '/latest-jobs' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Search size={22} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Search</span>
                    </Link>
                    <Link href="/govt-jobs" className={pathname === '/govt-jobs' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Building2 size={22} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Govt</span>
                    </Link>
                    <Link href="/results" className={pathname === '/results' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <Award size={22} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Results</span>
                    </Link>
                    <Link href="/login" className={pathname === '/login' ? 'mobile-nav-item-active' : 'mobile-nav-item'}>
                        <User size={22} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Profile</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
