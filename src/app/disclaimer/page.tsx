import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description: 'JOB UPDATES Disclaimer - Important information about the nature of job listings and content on our platform.',
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>

                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-lg text-muted-foreground">
                        Last updated: February 2026
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">General Disclaimer</h2>
                        <p className="text-muted-foreground">
                            The information provided on <strong>jobupdate.site</strong> (&quot;JOB UPDATES&quot;) is for general informational purposes only. All information on the Site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">Job Listing Disclaimer</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES is a <strong>job aggregation platform</strong> that collects and curates job listings from various publicly available sources, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Company career pages and official job portals</li>
                            <li>Publicly available RSS feeds from job sites</li>
                            <li>Third-party job APIs and job boards</li>
                        </ul>
                        <p className="text-muted-foreground">
                            <strong>Important:</strong> We do not create, verify, or guarantee the accuracy of individual job listings. Job details such as roles, salaries, locations, qualifications, and application deadlines are sourced from third parties and may change without notice. <strong>We strongly recommend that you verify all job details directly on the official company career page before applying.</strong>
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">Not a Recruiter or Employer</h2>
                        <p className="text-muted-foreground">
                            JOB UPDATES is <strong>not a recruiting agency, staffing firm, or employer</strong>. We do not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Guarantee any job offers, callbacks, or placements</li>
                            <li>Have any involvement in the hiring process</li>
                            <li>Charge any fees to job seekers for job listings</li>
                            <li>Make hiring or salary decisions on behalf of employers</li>
                            <li>Share your personal data with employers unless you apply through their portal</li>
                        </ul>
                        <p className="text-muted-foreground">
                            When you click &quot;Apply Now&quot; on our site, you are redirected to the employer&apos;s official application portal. Your interaction from that point onward is directly with the employer.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">External Links Disclaimer</h2>
                        <p className="text-muted-foreground">
                            The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">Advertising Disclaimer</h2>
                        <p className="text-muted-foreground">
                            This Site is monetized through third-party advertising, including Google AdSense. Advertisements are provided by third-party ad networks and are not endorsed by JOB UPDATES. The products and services advertised on this site are not necessarily recommended or endorsed by us. We are not responsible for the content of any advertisements, and clicking on ads is at your own risk.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">Errors and Omissions Disclaimer</h2>
                        <p className="text-muted-foreground">
                            While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, JOB UPDATES is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this site is provided &quot;as is&quot;, with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">Fair Use Disclaimer</h2>
                        <p className="text-muted-foreground">
                            This site may contain copyrighted material, the use of which has not always been specifically authorised by the copyright owner. Such material is made available on this site to help job seekers find employment opportunities. We believe this constitutes a &quot;fair use&quot; of any such copyrighted material as provided for in the applicable copyright law. If you wish to use copyrighted material from this site for purposes of your own that go beyond &quot;fair use&quot;, you must obtain permission from the copyright owner.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold gradient-text">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any concerns or questions about this Disclaimer, please contact us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>By email: <a href="mailto:contact@braintube.in" className="text-primary underline">contact@braintube.in</a></li>
                            <li>By visiting our <Link href="/contact" className="text-primary underline">Contact page</Link></li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
