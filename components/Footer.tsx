'use client';

import Link from 'next/link';
import { Briefcase, Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-20" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="container">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={16} color="white" />
                            </div>
                            <span className="font-heading" style={{ fontSize: '18px', fontWeight: 800 }}>JobUpdates</span>
                        </Link>
                        <p className="text-secondary text-sm mb-6 leading-relaxed">
                            Official recruitment discovery platform for 2026. Fetching verified job notifications directly from government sources.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Facebook, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" className="flex items-center justify-center hover:text-primary transition-colors" style={{ width: '36px', height: '36px', border: '1px solid var(--border)', borderRadius: '50%', color: 'var(--secondary)' }}>
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading mb-6" style={{ fontSize: '16px' }}>Resources</h4>
                        <ul className="flex flex-col gap-3" style={{ listStyle: 'none' }}>
                            {['Latest Jobs', 'Govt Jobs', 'Private Jobs', 'Results', 'Admit Cards'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-secondary hover:text-primary transition-colors" style={{ textDecoration: 'none' }}>{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading mb-6" style={{ fontSize: '16px' }}>Support</h4>
                        <ul className="flex flex-col gap-3" style={{ listStyle: 'none' }}>
                            {['Official Sources', 'Privacy Policy', 'Disclaimer', 'Terms of Use', 'About Us'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-secondary hover:text-primary transition-colors" style={{ textDecoration: 'none' }}>{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-heading mb-6" style={{ fontSize: '16px' }}>Contact</h4>
                        <div className="flex items-start gap-3 text-sm text-secondary">
                            <MapPin size={18} className="text-primary mt-1" />
                            <span>Hyderabad, Telangana, India</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-secondary">
                            <Mail size={18} className="text-primary" />
                            <span>support@jobupdate.site</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-xs text-secondary">
                        © {new Date().getFullYear()} jobupdate.site. Crafted for excellence in Indian careers.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/sitemap.xml" className="text-xs text-secondary hover:text-primary transition-colors" style={{ textDecoration: 'none' }}>Sitemap</Link>
                        <Link href="/rss" className="text-xs text-secondary hover:text-primary transition-colors" style={{ textDecoration: 'none' }}>RSS Feed</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
