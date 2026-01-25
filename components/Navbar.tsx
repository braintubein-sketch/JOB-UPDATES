'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, Briefcase } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
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
        <nav className="nav-sticky">
            <div className="container flex items-center justify-between" style={{ height: '72px' }}>
                <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="flex items-center justify-center bg-primary" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                        <Briefcase size={20} color="white" />
                    </div>
                    <span className="font-heading" style={{ fontSize: '20px', fontWeight: 800 }}>
                        Job<span style={{ color: 'var(--primary)' }}>Updates</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold hover:text-primary transition-colors"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="flex items-center justify-center hover:bg-primary-soft transition-colors" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'inherit' }}>
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <button className="md:hidden flex items-center justify-center transition-colors" style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link href="/latest-jobs" className="btn btn-primary hidden md:flex">
                        Explore
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col gap-4 py-6 px-4" style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/latest-jobs"
                        className="btn btn-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        Explore Opportunities
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
