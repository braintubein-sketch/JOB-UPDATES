'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Moon, Sun, Briefcase, FileText, CreditCard, ChevronDown } from 'lucide-react';

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
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Job Updates India" className="h-10 md:h-12 w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 border-l pl-6 border-border">
                        <button onClick={toggleTheme} className="p-2 hover:bg-border rounded-full transition-colors">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="p-2 hover:bg-border rounded-full transition-colors">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden glass absolute top-full left-0 w-full p-4 border-t border-border animate-fade-in">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium py-2 border-b border-border"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
        nav {
          display: flex;
          flex-direction: column;
        }
        .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\:flex { display: flex; }
          .md\:hidden { display: none; }
        }
        .text-xl { font-size: 1.25rem; }
        .font-bold { font-weight: 700; }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .p-1\.5 { padding: 0.375rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .text-white { color: white; }
        .w-6 { width: 1.5rem; }
        .h-6 { height: 1.5rem; }
        .text-sm { font-size: 0.875rem; }
        .font-medium { font-weight: 500; }
        .hover\:text-primary:hover { color: var(--primary); }
        .transition-colors { transition: color 0.2s, background-color 0.2s; }
        .sticky { position: sticky; }
        .top-0 { top: 0; }
        .z-50 { z-index: 50; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .border-l { border-left-width: 1px; }
        .pl-6 { padding-left: 1.5rem; }
        .border-border { border-color: var(--border); }
        .rounded-full { border-radius: 9999px; }
        .p-2 { padding: 0.5rem; }
        .hover\:bg-border:hover { background-color: var(--border); }
        .md\:hidden { display: flex; }
      `}</style>
        </nav>
    );
};

export default Navbar;
