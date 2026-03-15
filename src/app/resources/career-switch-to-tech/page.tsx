import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'How to Switch Your Career to Tech in 2026 | Complete Guide',
    description: 'A practical guide for non-tech professionals looking to transition into IT in India. Covers learning paths, bootcamps, certifications, and portfolio building.',
};

export default function CareerSwitchPage() {
    return (
        <div className="min-h-screen py-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/resources" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Resources
                </Link>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Career</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> 10 min read</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">How to Switch Your Career to Tech in 2026</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    It&apos;s never too late to enter the tech industry. Here&apos;s a practical, no-nonsense guide for career changers in India.
                </p>
                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Is It Really Possible?</h2>
                        <p className="text-muted-foreground leading-relaxed">Absolutely. India&apos;s tech industry added over 5 lakh new jobs in 2025 alone. Companies like TCS, Infosys, and hundreds of startups actively hire career changers — especially those with domain expertise combined with tech skills. A mechanical engineer who learns Python and data analytics, or a banker who picks up SQL and business intelligence, brings a unique combination that pure-tech candidates lack.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Step 1: Choose Your Path</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">Not all tech roles require a CS degree. Here are the most accessible entry points for career changers:</p>
                        <div className="space-y-3">
                            {[
                                { path: 'Frontend Development', time: '3-6 months', tools: 'HTML, CSS, JavaScript, React' },
                                { path: 'Data Analytics', time: '2-4 months', tools: 'Excel, SQL, Python, Power BI / Tableau' },
                                { path: 'QA / Software Testing', time: '2-3 months', tools: 'Selenium, Postman, JIRA, Manual Testing' },
                                { path: 'DevOps / Cloud', time: '4-6 months', tools: 'AWS, Docker, Linux, CI/CD, Terraform' },
                                { path: 'Product Management', time: '3-5 months', tools: 'Figma, Analytics, JIRA, Communication Skills' },
                            ].map((item) => (
                                <div key={item.path} className="bg-secondary/30 rounded-xl p-4 border border-border">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">{item.path}</span>
                                        <span className="text-xs text-primary font-bold">{item.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Learn: {item.tools}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Step 2: Learn For Free (or Cheap)</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>freeCodeCamp:</strong> Free full-stack curriculum with projects and certifications</li>
                            <li><strong>The Odin Project:</strong> Open-source web development curriculum</li>
                            <li><strong>CS50 (Harvard):</strong> The best free CS course on the internet</li>
                            <li><strong>Google Certificates (Coursera):</strong> Data Analytics, Project Management, UX Design — ₹1,500-3,000/month</li>
                            <li><strong>YouTube:</strong> Channels like Nana Janashia (DevOps), Traversy Media (Web Dev), and CodeWithHarry (Hindi) are excellent</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Step 3: Build a Portfolio</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            A portfolio is more important than a degree for career changers. Build 3-5 real projects that demonstrate your skills. Deploy them on platforms like Vercel, Netlify, or Heroku. Create a personal website showcasing your work. Contribute to open-source projects on GitHub. Every project should solve a real problem — even a simple one.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Step 4: Network Aggressively</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            In India, referrals account for over 40% of all tech hires. Optimize your LinkedIn profile (see our LinkedIn guide), attend local tech meetups, join communities on Discord and Twitter, and don&apos;t be afraid to reach out to people in your target company. Most engineers are happy to help genuine career changers.
                        </p>
                    </section>
                    <div className="glass rounded-[2rem] p-8 border-primary/20 text-center mt-12">
                        <h3 className="text-2xl font-black mb-3">Start your tech journey today.</h3>
                        <p className="text-muted-foreground mb-6">Explore entry-level and fresher-friendly IT roles.</p>
                        <Link href="/jobs?expMin=0&expMax=1" className="btn-primary inline-flex items-center gap-2 px-8">
                            View Fresher Jobs <Users className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
