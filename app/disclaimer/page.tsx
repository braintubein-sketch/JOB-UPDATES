export default function DisclaimerPage() {
    return (
        <div className="container-premium py-12 max-w-4xl">
            <div className="card-premium p-8 md:p-12">
                <h1 className="text-3xl font-bold mb-8 text-red-600">Disclaimer</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="font-bold">Please read this disclaimer carefully before using Job Updates.</p>

                    <h3>1. Not a Government Website</h3>
                    <p><strong>Job Updates is NOT an official government website.</strong> We are a private information portal that aggregates job news from various official sources. We have no affiliation with any government ministry or department.</p>

                    <h3>2. Information Accuracy</h3>
                    <p>While we strive for accuracy, we cannot guarantee that every piece of information (dates, fees, vacancies) is 100% error-free. Recruitment rules change frequently. <strong>Always check the official URL</strong> provided in our job posts before making any payment or application.</p>

                    <h3>3. No Liability</h3>
                    <p>We are not responsible for any loss, damage, or missed opportunity resulting from the use of this website. Users apply for jobs at their own risk.</p>

                    <h3>4. External Links</h3>
                    <p>Links to third-party websites (e.g., Application Forms) are provided for convenience. We do not control these sites and endorse their content solely for information purposes.</p>
                </div>
            </div>
        </div>
    );
}
