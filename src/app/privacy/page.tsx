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
                        Last updated: February 2026
                    </p>

                    <p className="text-muted-foreground">
                        JOB UPDATES (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website <strong>jobupdate.site</strong>. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">1. Information We Collect</h2>
                        <p className="text-muted-foreground">
                            We collect information to provide better services to our users. We collect information in the following ways:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, such as your name and email address (via our contact form).</li>
                            <li><strong>Usage Data:</strong> We collect information on how the Service is accessed and used, including pages visited, time spent, referring URLs, and browser information.</li>
                            <li><strong>Cookies and Tracking Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. See Section 4 for more details.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">2. How We Use Information</h2>
                        <p className="text-muted-foreground">
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>To provide, maintain, and improve our job listing services</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information so that we can improve our Service</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent, and address technical issues</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">3. Information Sharing and Disclosure</h2>
                        <p className="text-muted-foreground">
                            We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates for the purposes outlined above.
                        </p>
                        <p className="text-muted-foreground">We may disclose your personal information:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>To comply with a legal obligation</li>
                            <li>To protect and defend the rights or property of JOB UPDATES</li>
                            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                            <li>To protect the personal safety of users of the Service or the public</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">4. Cookies and Tracking Technologies</h2>
                        <p className="text-muted-foreground">
                            We use cookies and similar tracking technologies to track the activity on our Service. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                        </p>
                        <p className="text-muted-foreground">Types of cookies we use:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off in our systems.</li>
                            <li><strong>Analytics Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                            <li><strong>Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners (including Google AdSense). They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.</li>
                        </ul>
                        <p className="text-muted-foreground">
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">5. Third-Party Advertising</h2>
                        <p className="text-muted-foreground">
                            We use Google AdSense to serve ads on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
                        </p>
                        <p className="text-muted-foreground">
                            You may opt out of personalised advertising by visiting{' '}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a>.
                            Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalised advertising by visiting{' '}
                            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.aboutads.info</a>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">6. Third-Party Links</h2>
                        <p className="text-muted-foreground">
                            Our Service contains links to other websites (including employer career pages and job application portals) that are not operated by us. If you click on a third-party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">7. Data Security</h2>
                        <p className="text-muted-foreground">
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">8. Your Data Protection Rights</h2>
                        <p className="text-muted-foreground">
                            Depending on your location, you may have the following data protection rights:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                            <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                        </ul>
                        <p className="text-muted-foreground">
                            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email: <a href="mailto:contact@braintube.in" className="text-primary underline">contact@braintube.in</a>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">9. Children&apos;s Privacy</h2>
                        <p className="text-muted-foreground">
                            Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">10. Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">11. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us:
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
