'use client';

import Link from 'next/link';
import { Briefcase, Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-border-light pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                                <Briefcase className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black">Job<span className="text-primary">Updates</span></span>
                        </Link>
                        <p className="text-text-muted text-sm leading-loose mb-8">
                            Premium recruitment discovery platform for 2026 batch. We provide 100% verified official notification alerts across India.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Facebook, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Resources</h4>
                        <ul className="space-y-4">
                            {['Latest Jobs', 'Govt Recruitments', 'Private Sector', 'Freshers 2026', 'State Portals'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-text-muted text-sm hover:text-primary transition-colors font-semibold">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Authority</h4>
                        <ul className="space-y-4">
                            {['Official Sources', 'Privacy Policy', 'Disclaimer', 'Terms of Use', 'About Portal'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-text-muted text-sm hover:text-primary transition-colors font-semibold">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Contact Us</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-sm">
                                <MapPin size={22} className="text-primary shrink-0" />
                                <span className="text-text-muted leading-relaxed font-semibold">Reg. Office: Jubilee Hills, Hyderabad,<br />Telangana 500033</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm">
                                <Mail size={20} className="text-primary shrink-0" />
                                <span className="text-text-muted font-semibold">support@jobupdate.site</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <p className="text-text-muted text-sm font-bold">
                        © {currentYear} jobupdate.site. Crafted with excellence for Indian careers.
                    </p>
                    <div className="flex gap-10">
                        <Link href="/sitemap.xml" className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">Sitemap</Link>
                        <Link href="/rss" className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">RSS Feed</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
