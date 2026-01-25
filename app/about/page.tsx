import { Info, ShieldCheck, Mail, Globe, CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container py-20 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold mb-6">About Job Updates India</h1>
                <p className="text-secondary text-lg leading-relaxed">
                    The most trusted destination for official Indian recruitment notifications.
                </p>
            </div>

            <div className="space-y-12">
                <section className="glass p-8 rounded-2xl border border-border">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <ShieldCheck className="text-primary" /> Our Mission
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        In an era of misinformation and clickbait, Job Updates India was born with a single mission: to provide job seekers with 100% accurate, verified, and official information. We believe that every aspirant deserves a fair chance at their career without being misled by unverified sources.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card-bg p-8 rounded-2xl border border-border">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Globe size={20} className="text-primary" /> Official Sources Only
                        </h3>
                        <p className="text-sm text-secondary leading-relaxed">
                            We only fetch information from official government portals (.gov.in, .nic.in), official social media handles of departments, and physical Employment News.
                        </p>
                    </div>
                    <div className="bg-card-bg p-8 rounded-2xl border border-border">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-primary" /> Quality Over Quantity
                        </h3>
                        <p className="text-sm text-secondary leading-relaxed">
                            We don't aim to post 100 jobs a day. We aim to post relevant, active, and high-quality job opportunities that can actually shape your future.
                        </p>
                    </div>
                </div>

                <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                    <h2 className="text-2xl font-bold mb-6">Our Process</h2>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">1</span>
                            <div>
                                <h4 className="font-bold">Automated Discovery</h4>
                                <p className="text-sm text-secondary">Our systems monitor official feeds and portals 24/7 for new notifications.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">2</span>
                            <div>
                                <h4 className="font-bold">Manual Verification</h4>
                                <p className="text-sm text-secondary">A human editor verifies the source, dates, and authenticity of the notification PDF.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">3</span>
                            <div>
                                <h4 className="font-bold">Quick Publishing</h4>
                                <p className="text-sm text-secondary">Once approved, the update is published with a unique summary and SEO schema.</p>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
