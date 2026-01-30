import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const pjs = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-pjs' });

export const metadata: Metadata = {
    metadataBase: new URL('https://jobupdate.site'),
    title: {
        default: 'JOB UPDATES - Premium IT Jobs Portal | India\'s #1 Tech Career Hub',
        template: '%s | JOB UPDATES',
    },
    description:
        'JOB UPDATES is India\'s premium IT job portal. Find curated tech jobs from top companies, startups, and giants. Software, AI/ML, DevOps, Cloud & more.',
    keywords: [
        'JOB UPDATES',
        'IT jobs India',
        'tech careers',
        'software engineer jobs',
        'developer jobs Bangalore',
        'remote tech jobs',
        'fresher IT jobs',
        'AI jobs',
        'DevOps roles',
    ],
    authors: [{ name: 'JOB UPDATES' }],
    creator: 'JOB UPDATES',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://jobupdate.site',
        siteName: 'JOB UPDATES',
        title: 'JOB UPDATES - Unlock Your Next Tech Chapter',
        description: 'Elite IT jobs for the top 1% tech talent. Browse curated opportunities now.',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'JOB UPDATES' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JOB UPDATES - Premium IT Jobs',
        description: 'Find your dream tech career with curated IT jobs from top companies.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        'google-adsense-account': 'ca-pub-2703338145574896',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="theme-color" content="#0a0a0a" />
                <meta name="google-adsense-account" content="ca-pub-2703338145574896" />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2703338145574896"
                    crossOrigin="anonymous"
                ></script>
            </head>
            <body className={`${pjs.variable} font-sans antialiased`}>
                <AuthProvider>
                    <ThemeProvider>
                        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
                            <Navbar />
                            <main className="flex-1 relative z-10 pb-28 md:pb-0">{children}</main>
                            <MobileBottomNav />
                            <Footer />
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
