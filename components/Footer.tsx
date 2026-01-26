'use client';

import Link from 'next/link';
import { Briefcase, Mail, MapPin, Twitter, Linkedin, Youtube, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="container-premium">
                <div className="grid md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xl font-display font-bold">JobUpdates</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Premium recruitment discovery platform for 2026 batch.
                            Official notification alerts across 28 Indian states.
                        </p>
                        <div className="flex gap-3">
                            {[Twitter, Linkedin, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-display font-bold mb-6">Resources</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Latest Jobs', href: '/latest-jobs' },
                                { name: 'Government Jobs', href: '/govt-jobs' },
                                { name: 'Private Jobs', href: '/private-jobs' },
                                { name: 'Results', href: '/results' },
                                { name: 'Admit Cards', href: '/admit-cards' }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Authority */}
                    <div>
                        <h4 className="font-display font-bold mb-6">Authority</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Official Sources', href: '/sources' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Disclaimer', href: '/disclaimer' },
                                { name: 'Contact Us', href: '/contact' }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-bold mb-6">Contact</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary-500 shrink-0 mt-0.5" />
                                <span className="text-slate-400 text-sm">
                                    Hyderabad, Telangana<br />India - 500033
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-primary-500" />
                                <span className="text-slate-400 text-sm">support@jobupdate.site</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} JobUpdates. Crafted for excellence in Indian careers.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/sitemap.xml" className="text-slate-500 hover:text-white text-xs transition-colors">
                            Sitemap
                        </Link>
                        <Link href="/sources" className="text-slate-500 hover:text-white text-xs transition-colors">
                            Official Sources
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
