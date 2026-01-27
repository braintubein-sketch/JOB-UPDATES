'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
    Briefcase,
    Search,
    Building2,
    Send,
    Menu,
    X,
    Sun,
    Moon,
    LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const navLinks = [
    { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/search', label: 'Search', icon: Search },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                        ? 'p-4'
                        : 'p-6'
                    }`}
            >
                <div className={`max-w-7xl mx-auto transition-all duration-500 ${isScrolled
                        ? 'glass rounded-[2rem] px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                        : 'bg-transparent px-2'
                    }`}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-extrabold tracking-tighter leading-none">
                                    JOB <span className="text-primary italic">UPDATES</span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                    Premium Portal
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${isActive
                                            ? 'text-white'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-secondary hover:bg-secondary/80 border border-border transition-all"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>
                            )}

                            <Link
                                href={user ? "/admin/dashboard" : "/admin"}
                                className="hidden sm:flex btn-primary !py-2.5 !px-6 text-sm"
                            >
                                {user ? (
                                    <>
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </>
                                ) : "Post Jobs"}
                            </Link>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[110] p-4 md:hidden"
                    >
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" onClick={() => setIsOpen(false)} />
                        <div className="relative h-full glass rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between mb-12">
                                <span className="text-2xl font-black italic tracking-tighter">MENU</span>
                                <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-secondary">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-6 rounded-3xl bg-secondary/50 border border-border text-lg font-bold hover:bg-primary hover:text-white transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <link.icon className="w-5 h-5" />
                                        </div>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto">
                                <Link
                                    href={user ? "/admin/dashboard" : "/admin"}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full btn-primary h-16 rounded-[2rem] text-lg font-black"
                                >
                                    {user ? "GO TO DASHBOARD" : "POST A JOB"}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer for content */}
            {!pathname.startsWith('/admin') && <div className="h-28" />}
        </>
    );
}
