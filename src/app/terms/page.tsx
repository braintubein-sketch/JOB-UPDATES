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
                        Last updated: February 2026
                    </p>

                    <p className="text-muted-foreground">
                        Please read these Terms of Service (&quot;Terms&quot;) carefully before using the <strong>jobupdate.site</strong> website (the &quot;Service&quot;) operated by JOB UPDATES (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing and using JOB UPDATES, you accept and agree to be bound by these Terms of Service and our Privacy Policy.
                            If you do not agree to these terms, please do not use our services. Your access to and
                            use of the Service is conditioned on your acceptance of and compliance with these Terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">2. Description of Service</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES is a free IT jobs aggregation and curation platform that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Curates and lists IT and technology job opportunities from various publicly available sources including company career pages, job boards, and RSS feeds</li>
                            <li>Provides job search, filtering, and categorization capabilities</li>
                            <li>Offers instant job alerts via Telegram channel</li>
                            <li>Redirects users to official employer application pages for job applications</li>
                        </ul>
                        <p className="text-muted-foreground">
                            We act as a job aggregator and do not directly employ, recruit, or hire candidates. All applications are submitted directly to the respective employers through their official channels.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">3. User Responsibilities</h2>
                        <p className="text-muted-foreground">
                            By using this Service, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Provide accurate information when contacting us</li>
                            <li>Use the Service for lawful purposes only</li>
                            <li>Not attempt to scrape, copy, or reproduce our content without written permission</li>
                            <li>Not interfere with the proper operation of the Service</li>
                            <li>Not use automated means to access the Service in a manner that could overload our infrastructure</li>
                            <li>Verify job listing details on official company websites before applying</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">4. Job Listings Disclaimer</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES aggregates job listings from various publicly available sources. Please note:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>We do not guarantee the accuracy, completeness, or timeliness of job information</li>
                            <li>We are not responsible for hiring decisions made by employers</li>
                            <li>We do not guarantee job placement or application success</li>
                            <li>Job listings may be removed or updated by employers without notice to us</li>
                            <li>We strongly recommend verifying all job details on official company career pages before applying</li>
                            <li>We are not an employer and do not make hiring decisions</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">5. Third-Party Links and Content</h2>
                        <p className="text-muted-foreground">
                            Our Service contains links to third-party websites, including employer career pages, job application portals, and partner sites. These third-party sites have separate and independent privacy policies and terms of service. We have no responsibility or liability for the content or activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">6. Advertising</h2>
                        <p className="text-muted-foreground">
                            Our Service may display advertisements provided by third-party advertising partners, including Google AdSense.
                            These advertisements may use cookies and similar technologies to display relevant ads based on your browsing history.
                            We do not endorse or guarantee the products or services advertised on our website. By using the Service,
                            you acknowledge that third-party advertisers may place cookies on your browser.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">7. Intellectual Property</h2>
                        <p className="text-muted-foreground">
                            The Service and its original content (excluding content provided by users or sourced from third parties), features, and functionality are and will remain the exclusive property of JOB UPDATES. The Service is protected by copyright, trademark, and other laws of India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of JOB UPDATES.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">8. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. In no event shall JOB UPDATES, its directors, employees, partners, agents, suppliers, or affiliates be liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                            <li>Actions taken based on information on our platform</li>
                            <li>Any interruption, suspension, or discontinuance of the Service</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">9. Governing Law</h2>
                        <p className="text-muted-foreground">
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">10. Changes to Terms</h2>
                        <p className="text-muted-foreground">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                            If a revision is material, we will try to provide at least 30 days notice prior to any new
                            terms taking effect. What constitutes a material change will be determined at our sole discretion.
                            By continuing to access or use our Service after those revisions become effective, you agree to
                            be bound by the revised terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">11. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>By email: <a href="mailto:contact@braintube.in" className="text-primary underline">contact@braintube.in</a></li>
                            <li>By visiting the Contact page on our website: <a href="/contact" className="text-primary underline">jobupdate.site/contact</a></li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
