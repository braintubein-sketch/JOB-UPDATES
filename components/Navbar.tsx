'use client';

import Link from 'next/link';
import { Search, Briefcase } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="nav">
            <div className="container flex items-center justify-between w-full">
                <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Briefcase size={18} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>JobUpdates</span>
                </Link>

                <div className="nav-links">
                    <Link href="/latest-jobs" className="nav-link">Latest</Link>
                    <Link href="/govt-jobs" className="nav-link">Government</Link>
                    <Link href="/private-jobs" className="nav-link">Private</Link>
                    <Link href="/results" className="nav-link">Results</Link>
                    <Link href="/admit-cards" className="nav-link">Admit Cards</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="btn-link" style={{ fontSize: '12px' }}>
                        <Search size={16} />
                    </button>
                </div>
            </div>
            <style jsx>{`
                .gap-2 { gap: 8px; }
                .gap-4 { gap: 16px; }
            `}</style>
        </nav>
    );
};

export default Navbar;
