export default function DisclaimerPage() {
    return (
        <div className="container py-20 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-red-600">Disclaimer</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-secondary leading-relaxed">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="bg-red-50 p-6 rounded-xl border border-red-100 italic">
                    <p className="text-red-900">Job Updates India is an independent information portal. We are NOT affiliated with any government department, UPSC, SSC, or any other official recruitment body.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">No Guarantee of Accuracy</h2>
                    <p>While we make every effort to verify information from official sources, we do not guarantee the completeness, reliability, or accuracy of the information. Users are strongly advised to cross-check all details with the official government notification before taking any action.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">Official Sources</h2>
                    <p>All trademarks and logos of government departments used on this site are the property of their respective owners. We use them for informational purposes only to help candidates identify the official source of the job update.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                    <p>In no event shall Job Updates India be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>
                </section>
            </div>
        </div>
    );
}
