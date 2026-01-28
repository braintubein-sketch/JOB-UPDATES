import { Metadata } from 'next';
import Link from 'next/link';
import { Send, Users, Bell, Zap, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Join Our Telegram Channel',
    description: 'Get instant IT job alerts on Telegram. Join 50K+ IT professionals and never miss a tech job opportunity from top companies.',
};

const benefits = [
    {
        icon: Bell,
        title: 'Instant Job Alerts',
        description: 'Get notified immediately when new IT jobs are posted',
    },
    {
        icon: Zap,
        title: 'First to Apply',
        description: 'Be among the first applicants with real-time notifications',
    },
    {
        icon: CheckCircle,
        title: 'Verified Jobs Only',
        description: 'All jobs are verified from official company sources',
    },
    {
        icon: Shield,
        title: 'No Spam',
        description: 'Only quality IT job postings, no promotional content',
    },
    {
        icon: Clock,
        title: 'Daily Updates',
        description: '10-20 curated IT jobs posted every day',
    },
    {
        icon: Users,
        title: 'Active Community',
        description: 'Join 50K+ IT professionals in our community',
    },
];

const stats = [
    { value: '50K+', label: 'Subscribers' },
    { value: '500+', label: 'Jobs/Week' },
    { value: '100+', label: 'Companies' },
    { value: '95%', label: 'Satisfaction' },
];

export default function TelegramPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                <div className="absolute inset-0 bg-grid opacity-30" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Telegram Icon */}
                    <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
                        <Send className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Get IT Jobs Delivered to
                        <br />
                        <span className="gradient-text">Your Telegram</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join India&apos;s largest IT jobs Telegram channel. Get instant notifications for
                        Software, AI/ML, Cloud, DevOps, and more tech opportunities.
                    </p>

                    {/* CTA Button */}
                    <a
                        href="https://t.me/jobupdatesite"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <Send className="w-6 h-6" />
                        Join @jobupdatesite Channel
                        <ArrowRight className="w-6 h-6" />
                    </a>

                    <p className="text-sm text-muted-foreground mt-4">
                        Free to join • No spam • Unsubscribe anytime
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Why Join Our <span className="gradient-text">Telegram Channel</span>?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Stay ahead in your job search with instant notifications and curated opportunities
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <benefit.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sample Message Section */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Sample <span className="gradient-text">Job Alert</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Here&apos;s how our job alerts look on Telegram
                        </p>
                    </div>

                    <div className="bg-[#1c2733] rounded-2xl p-6 max-w-md mx-auto shadow-2xl">
                        {/* Telegram Message Header */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <Send className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-white">JOB UPDATES</div>
                                <div className="text-xs text-gray-400">Channel • 50,234 subscribers</div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="text-white space-y-2">
                            <p className="font-bold text-lg">🚀 Google is Hiring!</p>
                            <div className="space-y-1 text-gray-300">
                                <p>💼 <strong>Role:</strong> Software Engineer III</p>
                                <p>🎓 <strong>Qualification:</strong> B.Tech/M.Tech in CS/IT</p>
                                <p>📍 <strong>Location:</strong> Bangalore, Hyderabad</p>
                                <p>🧠 <strong>Experience:</strong> 3-5 Years</p>
                            </div>
                            <p className="text-blue-400 hover:underline cursor-pointer mt-4">
                                🔗 Apply Now →
                            </p>
                            <p className="text-gray-500 text-sm mt-4 italic font-medium">
                                No hashtags, just high-quality job alerts.
                            </p>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right text-xs text-gray-500 mt-4">
                            10:30 AM
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Never Miss a <span className="gradient-text">Tech Job</span>?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join our Telegram channel now and get your next job opportunity delivered straight to your phone.
                    </p>

                    <a
                        href="https://t.me/jobupdatesite"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                    >
                        <Send className="w-6 h-6" />
                        Join Telegram Channel
                    </a>
                </div>
            </section>
        </div>
    );
}

