import Link from 'next/link';
import { Briefcase, Mail, Phone, MapPin, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Sources', href: '/sources' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Disclaimer', href: '/disclaimer' },
                { name: 'Terms of Service', href: '/terms' },
            ],
        },
        {
            title: 'Categories',
            links: [
                { name: 'Govt Jobs', href: '/govt-jobs' },
                { name: 'Private Jobs', href: '/private-jobs' },
                { name: 'Results', href: '/results' },
                { name: 'Admit Cards', href: '/admit-cards' },
            ],
        },
    ];

    return (
        <footer className="bg-card-bg border-t border-border pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <img src="/logo.png" alt="Job Updates India" className="h-10 w-auto object-contain" />
                        </Link>
                        <p className="text-secondary text-sm leading-relaxed mb-6">
                            Your trusted destination for official job updates, results, and admit cards. We only fetch data from government and verified official sources.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-border rounded-full hover:bg-primary hover:text-white transition-all">
                                <Twitter size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-border rounded-full hover:bg-primary hover:text-white transition-all">
                                <Linkedin size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-border rounded-full hover:bg-primary hover:text-white transition-all">
                                <Github size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-bold mb-6 text-sm uppercase tracking-wider">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-secondary hover:text-primary text-sm flex items-center gap-1">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-secondary text-xs">
                        © {currentYear} Job Updates India. All rights reserved. Built with Trust & Accuracy.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/sources" className="text-secondary hover:text-primary text-xs flex items-center gap-1">
                            Official Sources <ExternalLink size={12} />
                        </Link>
                        <span className="text-secondary text-xs">Updated: Daily at 9:00 AM IST</span>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
