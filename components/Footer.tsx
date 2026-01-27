'use client';

import Link from 'next/link';
import { Briefcase, Mail, MapPin, Phone, Send, ExternalLink, ShieldCheck, FileText, Info } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="container-main">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & Mission */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                                J
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                Job<span className="text-blue-600">Updates</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            India's leading platform for verified job alerts. We provide authentic information collected from official government gazettes and corporate career portals.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://t.me/jobupdatesite" className="text-blue-600 hover:text-blue-700 transition-colors">
                                <Send size={20} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <ShieldCheck size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Career Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Job Categories</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Latest Jobs', href: '/latest-jobs' },
                                { name: 'Govt Jobs', href: '/govt-jobs' },
                                { name: 'Private Jobs', href: '/private-jobs' },
                                { name: 'Results', href: '/results' },
                                { name: 'Admit Cards', href: '/admit-cards' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 text-sm flex items-center gap-2 transition-colors">
                                        <ChevronRight size={12} />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Resources</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact Info', href: '/contact' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Terms & Disclaimer', href: '/disclaimer' },
                                { name: 'Sitemap', href: '/sitemap.xml' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                                <Mail className="text-blue-600 shrink-0" size={18} />
                                <span>support@jobupdates.site</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                                <Info className="text-blue-600 shrink-0" size={18} />
                                <span>Verified updates served 24/7 across India.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs text-center md:text-left">
                        © {currentYear} JobUpdates. The information provided here is for educational purposes. Please verify with official notifications.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Made with ❤️ for aspirants</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Internal minimal icon for footer
const ChevronRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

export default Footer;
