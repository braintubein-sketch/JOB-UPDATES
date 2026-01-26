export default function AboutPage() {
    return (
        <div className="container-premium py-12 max-w-4xl">
            <div className="card-premium p-8 md:p-12">
                <h1 className="text-3xl font-bold mb-6">About Us</h1>
                <div className="text-lg text-slate-600 leading-relaxed space-y-6">
                    <p>
                        Welcome to <strong>Job Updates</strong>, India's most trusted platform for real-time recruitment news.
                        Our mission is simple: to connect job seekers with legitimate opportunities without the noise.
                    </p>
                    <p>
                        In an era of fake news and spam, we verify every single listing. Our automated systems monitor
                        over 500+ official government portals and trusted news outlets to bring you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Latest Sarkari Naukri</strong> (Central & State Govt)</li>
                        <li><strong>Admit Cards & Hall Tickets</strong> (Instant Alerts)</li>
                        <li><strong>Results & Merit Lists</strong></li>
                        <li><strong>Private Sector Openings</strong> (MNCs & Startups)</li>
                    </ul>
                    <p>
                        We believe that access to employment information should be free, fast, and transparent.
                    </p>
                </div>
            </div>
        </div>
    );
}
