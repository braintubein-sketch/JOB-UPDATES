'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, Briefcase, Bell } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Latest Jobs', href: '/latest-jobs' },
        { name: 'Govt Jobs', href: '/govt-jobs' },
        { name: 'Private Jobs', href: '/private-jobs' },
        { name: 'Results', href: '/results' },
        { name: 'Admit Cards', href: '/admit-cards' },
    ];

    return (
        <nav className={`fixed w-full z-[1000] transition-all duration-500 ${scrolled ? 'glass py-2 shadow-lg' : 'py-6'}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-2xl text-white shadow-xl group-hover:rotate-12 transition-transform">
                        <Briefcase size={26} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tight leading-none uppercase italic">Official<span className="text-primary NOT-italic">Path</span></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Verified Updates</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-10">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors py-2 relative group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 border-l border-border pl-8">
                        <button className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                            <Bell size={18} />
                        </button>
                        <Link href="/latest-jobs" className="btn-premium btn-primary py-3 px-8 text-sm">
                            Get Notification
                        </Link>
                    </div>
                </div>

                <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden glass absolute top-full left-0 w-full p-8 flex flex-col gap-6 shadow-2xl animate-fade-in">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-black uppercase tracking-tight border-b border-border pb-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
