import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'JOB UPDATES Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 2025
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">1. Information We Collect</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES collects information to provide better services to our users. We collect information in the following ways:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Information you provide directly (contact forms, newsletter signup)</li>
                            <li>Usage data (pages visited, time spent, clicks)</li>
                            <li>Device information (browser type, IP address, device type)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">2. How We Use Information</h2>
                        <p className="text-muted-foreground">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Send job alerts and notifications (if subscribed)</li>
                            <li>Analyze usage patterns to improve user experience</li>
                            <li>Protect against fraud and abuse</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">3. Information Sharing</h2>
                        <p className="text-muted-foreground">
                            We do not sell your personal information. We may share information with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Service providers who assist in our operations</li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">4. Cookies</h2>
                        <p className="text-muted-foreground">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Remember your preferences</li>
                            <li>Understand how you use our site</li>
                            <li>Improve our services</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">5. Data Security</h2>
                        <p className="text-muted-foreground">
                            We implement appropriate security measures to protect your personal information.
                            However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">6. Your Rights</h2>
                        <p className="text-muted-foreground">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">7. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-primary">contact@JOB UPDATES.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

