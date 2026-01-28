import Link from 'next/link';
import {
    Briefcase,
    Send,
    Github,
    Twitter,
    Linkedin,
    Mail,
    MapPin,
    Heart,
    Globe,
    Shield,
} from 'lucide-react';

const footerLinks = {
    'Categories': [
        { label: 'Software Engineer', href: '/jobs?category=Software+Engineer' },
        { label: 'Data Science', href: '/jobs?category=Data+Science' },
        { label: 'DevOps', href: '/jobs?category=DevOps' },
        { label: 'Frontend', href: '/jobs?category=Frontend' },
        { label: 'Backend', href: '/jobs?category=Backend' },
    ],
    'Resources': [
        { label: 'Fresher Jobs', href: '/jobs?expMin=0&expMax=1' },
        { label: 'Internships', href: '/jobs?type=Internship' },
        { label: 'Remote Only', href: '/jobs?location=Remote' },
        { label: 'Telegram Bot', href: '/telegram' },
    ],
    'Support': [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-border bg-background pt-20 pb-32 md:pb-0 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-mesh opacity-50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* NewsLetter / CTA Banner */}
                <div className="glass rounded-[2rem] p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 border-primary/20">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black mb-2 tracking-tighter">Stay Ahead of the Curve</h2>
                        <p className="text-muted-foreground font-medium">Join 50k+ tech professionals getting instant job alerts.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <Link
                            href="/telegram"
                            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-3 px-10"
                        >
                            <Send className="w-5 h-5" />
                            JOIN TELEGRAM
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 pb-16">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">
                                JOB <span className="text-primary italic">UPDATES</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground font-medium mb-8 max-w-sm leading-relaxed">
                            India&apos;s most trusted destination for premium tech careers.
                            We bridge the gap between elite talent and global opportunities.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Send, href: 'https://t.me/jobupdatesite' },
                                { icon: Twitter, href: 'https://twitter.com/jobupdatesite' },
                                { icon: Github, href: 'https://github.com/jobupdatesite' },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-secondary border border-border hover:border-primary hover:text-primary transition-all duration-300"
                                >
                                    <item.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="col-span-1">
                            <h3 className="text-lg font-black uppercase tracking-widest text-foreground mb-6 text-xs">{title}</h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary font-bold transition-all duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                        <span>© {currentYear} JOB UPDATES.</span>
                        <span className="flex items-center gap-1.5 ml-4">
                            MADE WITH <Heart className="w-4 h-4 text-primary fill-primary" /> IN INDIA
                        </span>
                    </div>
                    <div className="flex items-center gap-8 text-sm font-bold">
                        <div className="flex items-center gap-2 text-muted-foreground underline underline-offset-4 decoration-primary/30">
                            <Shield className="w-4 h-4" />
                            SECURE
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground underline underline-offset-4 decoration-primary/30">
                            <Globe className="w-4 h-4" />
                            GLOBAL
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
