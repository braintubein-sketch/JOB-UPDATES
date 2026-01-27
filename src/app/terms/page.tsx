import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'JOB UPDATES Terms of Service - Rules and guidelines for using our IT jobs platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 2025
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing and using JOB UPDATES, you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">2. Description of Service</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES is an IT jobs aggregation platform that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Lists IT and technology job opportunities from various sources</li>
                            <li>Provides job search and filtering capabilities</li>
                            <li>Offers job alerts via Telegram</li>
                            <li>Redirects users to official application pages</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">3. User Responsibilities</h2>
                        <p className="text-muted-foreground">
                            Users agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Provide accurate information when contacting us</li>
                            <li>Use the service for lawful purposes only</li>
                            <li>Not attempt to scrape, copy, or reproduce our content without permission</li>
                            <li>Not interfere with the proper operation of the service</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">4. Job Listings Disclaimer</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES aggregates job listings from various sources. We:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Do not guarantee the accuracy of job information</li>
                            <li>Are not responsible for hiring decisions made by employers</li>
                            <li>Do not guarantee job placement or application success</li>
                            <li>Recommend verifying information on official company websites</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">5. Intellectual Property</h2>
                        <p className="text-muted-foreground">
                            All content on JOB UPDATES, including text, graphics, logos, and software,
                            is owned by JOB UPDATES or its content suppliers and protected by intellectual property laws.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">6. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Any indirect, incidental, or consequential damages</li>
                            <li>Loss of data or business interruption</li>
                            <li>Actions taken based on information on our platform</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">7. Changes to Terms</h2>
                        <p className="text-muted-foreground">
                            We reserve the right to modify these terms at any time. Continued use of the service
                            after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">8. Contact</h2>
                        <p className="text-muted-foreground">
                            For questions about these Terms, please contact us at:
                        </p>
                        <p className="text-primary">contact@JOB UPDATES.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

