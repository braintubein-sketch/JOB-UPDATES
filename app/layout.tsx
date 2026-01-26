import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "JobUpdates - Find Government & Private Jobs in India",
  description: "India's trusted job portal for government and private job notifications. Access verified recruitment updates, results, and admit cards from official sources. Updated 24/7.",
  keywords: "government jobs, private jobs, sarkari result, job updates, recruitment, admit cards, results, SSC, Railway, Bank Jobs",
  authors: [{ name: "JobUpdates" }],
  creator: "JobUpdates",
  publisher: "JobUpdates",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jobupdate.site',
    siteName: 'JobUpdates',
    title: 'JobUpdates - Find Government & Private Jobs in India',
    description: 'Access verified government and private job notifications. Updated 24/7 from official sources.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobUpdates - Find Government & Private Jobs in India',
    description: 'Access verified government and private job notifications. Updated 24/7 from official sources.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* GOOGLE ADSENSE */}
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2703338145574896"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
