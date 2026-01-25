export default function PrivacyPage() {
    return (
        <div className="container py-20 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-secondary leading-relaxed">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                    <p>We do not collect any personal information from you unless you voluntarily provide it through our contact form. We may collect non-personal information such as browser type, IP address, and pages visited for analytics purposes.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">2. Use of Cookies</h2>
                    <p>We use cookies to improve your browsing experience. Cookies are small files stored on your device that help us analyze web traffic and customize our content.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">3. Third-Party Links</h2>
                    <p>Our website contains links to external official government websites. We are not responsible for the privacy practices or the content of these external sites.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">4. AdSense & Advertising</h2>
                    <p>We may use Google AdSense to show advertisements. Google use cookies to serve ads based on a user's prior visits to your website or other websites. You may opt out of personalized advertising by visiting Google Ads Settings.</p>
                </section>
            </div>
        </div>
    );
}
