'use client';

import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="section" style={{ borderTop: '1px solid var(--border)', padding: '80px 0 40px' }}>
            <div className="container">
                <div className="grid grid-3" style={{ marginBottom: '80px' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>JobUpdates</div>
                        <p className="text-secondary text-sm" style={{ maxWidth: '240px' }}>
                            The official discovery platform for 2026 recruitments across India.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--muted)' }}>Portals</div>
                        <Link href="/govt-jobs" className="nav-link text-sm">Government Jobs</Link>
                        <Link href="/private-jobs" className="nav-link text-sm">Private Sector</Link>
                        <Link href="/results" className="nav-link text-sm">Results</Link>
                        <Link href="/admit-cards" className="nav-link text-sm">Admit Cards</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--muted)' }}>Company</div>
                        <Link href="/about" className="nav-link text-sm">About Us</Link>
                        <Link href="/privacy" className="nav-link text-sm">Privacy Policy</Link>
                        <Link href="/disclaimer" className="nav-link text-sm">Disclaimer</Link>
                        <Link href="/sources" className="nav-link text-sm">Official Sources</Link>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-24" style={{ borderTop: '1px solid var(--border)', opacity: 0.5 }}>
                    <div className="text-xs">© {new Date().getFullYear()} JobUpdates India.</div>
                    <div className="text-xs">Built for Excellence.</div>
                </div>
            </div>
            <style jsx>{`
                .gap-2 { gap: 8px; }
                .pt-24 { padding-top: 24px; }
            `}</style>
        </footer>
    );
};

export default Footer;
