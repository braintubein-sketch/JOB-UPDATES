export default function AboutPage() {
    return (
        <div className="container-premium py-20 max-w-4xl">
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Real People. Real Results.</h1>
                <p className="text-slate-500 font-medium text-lg mt-2">The team behind India's most trusted recruitment alert portal.</p>
            </div>

            <div className="job-card !cursor-default p-8 md:p-16">
                <div className="text-lg text-slate-700 leading-[1.8] space-y-8">
                    <p>
                        Welcome to <span className="font-black text-primary-600">Job Updates</span>, India's most trusted platform for real-time recruitment news.
                        Our mission is simple: to connect job seekers with legitimate opportunities without the noise.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-8 py-4">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-3xl font-black text-primary-600 mb-1">500+</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Official Portals Monitored</div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-3xl font-black text-emerald-600 mb-1">100%</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Verified Notifications</div>
                        </div>
                    </div>

                    <p>
                        In an era of fake news and spam, we verify every single listing. Our automated systems work 24/7 to deliver direct links to
                        Sarkari Naukri (Central & State), Admit Cards, Result Merit Lists, and MNC openings.
                    </p>

                    <p className="font-bold border-l-4 border-primary-600 pl-6 italic text-slate-500">
                        "We believe that access to employment information should be free, fast, and transparent for every Indian citizen."
                    </p>
                </div>
            </div>
        </div>
    );
}
