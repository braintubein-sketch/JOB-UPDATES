import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="container-premium py-12 max-w-4xl">
            <div className="card-premium p-8 md:p-12">
                <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Effective Date: January 26, 2026</p>
                    <p>Welcome to Job Updates ("we", "our", "us"). We are committed to protecting your privacy and ensuring your data is handled securely.</p>

                    <h3>1. Information We Collect</h3>
                    <p>We do not collect personal information like names or emails unless you voluntarily subscribe to our newsletter. We may use cookies for:</p>
                    <ul>
                        <li>Analyzing website traffic (Google Analytics)</li>
                        <li>Serving personalized advertisements (Google AdSense)</li>
                        <li>Remembering your preferences (Dark mode, etc.)</li>
                    </ul>

                    <h3>2. Job Information Disclaimer</h3>
                    <p>All job listings on this website are for informational purposes only. We fetch data from official government sources and trustworthy news outlets. However, users are strictly advised to verify details with the official notification PDF before applying.</p>

                    <h3>3. Third-Party Links</h3>
                    <p>Our website contains links to external official websites (e.g., upsc.gov.in, ibps.in). We are not responsible for the content or privacy practices of these third-party sites.</p>

                    <h3>4. Cookies & Ads</h3>
                    <p>We use Google AdSense to serve ads. Google may use cookies (DART cookie) to serve ads based on your visit to this and other sites. You can opt-out of personalized advertising by visiting Google Ad Settings.</p>

                    <h3>5. Contact Us</h3>
                    <p>If you have any questions regarding this policy, please contact us at: support@jobupdate.site</p>
                </div>
            </div>
        </div>
    );
}
