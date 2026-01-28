'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    Briefcase,
    Search,
    Building2,
    LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Jobs', icon: Briefcase, href: '/jobs' },
    { label: 'Search', icon: Search, href: '/search' },
    { label: 'Companies', icon: Building2, href: '/companies' },
];

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Only show on mobile
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4">
            <div className="glass rounded-[2rem] p-2 flex items-center justify-around shadow-[0_-8px_32px_rgba(0,0,0,0.3)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center gap-1 p-3 min-w-[64px]"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNav"
                                    className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <Icon className={`w-6 h-6 z-10 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-tighter z-10 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

            </div>
        </div>
    );
}
