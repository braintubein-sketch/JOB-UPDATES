'use client';

import Link from 'next/link';
import { Briefcase, Mail, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-border pt-24 pb-12">
            <div className="container">
                <div className="grid md:grid-cols-4 gap-16 mb-20">

                    {/* COL 1: BRAND */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg">
                                <Briefcase size={22} color="white" />
                            </div>
                            <span className="text-xl font-black uppercase tracking-tight">Job<span className="text-primary">Updates</span></span>
                        </Link>
                        <p className="text-secondary text-sm leading-loose mb-8">
                            Premium recruitment discovery platform for 2026. Official notification alerts delivered across 28 Indian states.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/sources" className="btn-premium btn-primary py-2 px-4 text-[10px] uppercase">Official Sources</Link>
                        </div>
                    </div>

                    {/* COL 2: EXPLORE */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-8">Resources</h4>
                        <ul className="space-y-4">
                            {['Latest Jobs', 'Govt Recruitments', 'Private Sector', 'Results Portal', 'Admit Cards'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-bold text-secondary hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 3: AUTHORITY */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-8">Authority</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Contact Us', 'Privacy Policy', 'Disclaimer', 'Terms of Use'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-bold text-secondary hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 4: CONTACT */}
                    <div className="space-y-8">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-8">Official Desk</h4>
                        <div className="flex items-start gap-4 text-secondary">
                            <MapPin size={22} className="text-primary shrink-0" />
                            <span className="text-sm font-bold leading-relaxed">Jubilee Hills, Road No. 36,<br />Hyderabad, TG 500033</span>
                        </div>
                        <div className="flex items-center gap-4 text-secondary">
                            <Mail size={20} className="text-primary" />
                            <span className="text-sm font-bold truncate">support@jobupdate.site</span>
                        </div>
                    </div>

                </div>

                <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[11px] font-black uppercase tracking-widest text-secondary">
                        © {new Date().getFullYear()} OfficialPath. Crafted for Indian Excellence.
                    </p>
                    <div className="flex gap-10">
                        <Link href="/sitemap.xml" className="text-[11px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">Sitemap</Link>
                        <Link href="/rss" className="text-[11px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">RSS Feed Integration</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
