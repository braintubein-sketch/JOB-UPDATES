'use client';

import Link from 'next/link';
import { Briefcase, Mail, MapPin, Phone, Twitter, Linkedin, Youtube, Send, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Latest Jobs', href: '/latest-jobs' },
        { name: 'Government Jobs', href: '/govt-jobs' },
        { name: 'Private Jobs', href: '/private-jobs' },
        { name: 'Results', href: '/results' },
        { name: 'Career Blog', href: '/blog' },
    ];

    const companyLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/disclaimer' },
        { name: 'Official Sources', href: '/sources' },
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Youtube, href: '#', label: 'YouTube' },
        { icon: Send, href: 'https://t.me/jobupdatesite', label: 'Telegram' },
    ];

    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 hidden lg:block">
            <div className="container-main">
                {/* Main Footer */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <span className="text-xl font-bold">JobUpdates</span>
                                <span className="block text-xs text-slate-400">Official Portal</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            India's trusted platform for verified government and private job notifications. Updated 24/7 from official sources.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-slate-400">
                                    Hyderabad, Telangana<br />India - 500033
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-blue-500" size={18} />
                                <span className="text-slate-400">support@jobupdate.site</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-blue-500" size={18} />
                                <span className="text-slate-400">+91 9000 000 000</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {currentYear} JobUpdates. All rights reserved. Built with ❤️ for Indian job seekers.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/sitemap.xml" className="text-slate-500 hover:text-white transition-colors">
                                Sitemap
                            </Link>
                            <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/disclaimer" className="text-slate-500 hover:text-white transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
