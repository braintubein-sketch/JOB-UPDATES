import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'LinkedIn Profile Optimization for Tech Professionals | Guide',
    description: 'Optimize your LinkedIn profile to attract recruiters. Expert tips on headline, summary, skills, and networking strategies for software engineers in India.',
};

export default function LinkedInOptimizationPage() {
    return (
        <div className="min-h-screen py-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/resources" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Resources
                </Link>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Networking</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> 7 min read</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">LinkedIn Profile Optimization for Tech Professionals</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    Make recruiters come to you. Here&apos;s how to optimize every section of your LinkedIn profile for maximum visibility.
                </p>
                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Why LinkedIn Matters in India</h2>
                        <p className="text-muted-foreground leading-relaxed">India has over 130 million LinkedIn users — the second largest market after the US. Over 85% of tech recruiters in India use LinkedIn as their primary sourcing tool. If your profile is not optimized, you are invisible to thousands of opportunities.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Optimize Your Headline</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">Your headline is the single most important text on your profile. It appears in search results, connection requests, and comments. Never leave it as the default &quot;Software Engineer at XYZ.&quot;</p>
                        <div className="space-y-3">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">❌ &quot;Software Engineer at TCS&quot;</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">✅ &quot;Full-Stack Engineer | React, Node.js, AWS | Building scalable web applications | Open to opportunities&quot;</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mt-4">Include your key skills as keywords — recruiters search by these terms.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Write a Compelling About Section</h2>
                        <p className="text-muted-foreground leading-relaxed">Your About section should be a 3-4 paragraph story, not a list of skills. Use this structure:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Paragraph 1:</strong> What you do and what drives you (your passion statement)</li>
                            <li><strong>Paragraph 2:</strong> Your key expertise and achievements with specific numbers</li>
                            <li><strong>Paragraph 3:</strong> What technologies you work with (keyword-rich for search)</li>
                            <li><strong>Paragraph 4:</strong> A call to action — &quot;Feel free to connect for opportunities in [your field]&quot;</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Skills & Endorsements</h2>
                        <p className="text-muted-foreground leading-relaxed">LinkedIn allows up to 50 skills. Add your top technical skills first and pin the top 3. Ask colleagues and batch-mates to endorse you — profiles with 5+ endorsements per skill rank significantly higher in recruiter searches.</p>
                        <p className="text-muted-foreground leading-relaxed mt-3">Recommended skills to add for a software engineer: JavaScript, React.js, Node.js, Python, SQL, Git, AWS, System Design, REST APIs, Agile/Scrum.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Post Content Regularly</h2>
                        <p className="text-muted-foreground leading-relaxed">The LinkedIn algorithm heavily favors active users. Post 2-3 times per week about:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Technical learnings — &quot;Today I learned about...&quot;</li>
                            <li>Project showcases with screenshots and GitHub links</li>
                            <li>Career reflections and interview experiences</li>
                            <li>Industry news and your opinion on it</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-3">Even if your posts get just 10-20 likes initially, consistency builds your personal brand over time. Many engineers have landed dream jobs entirely through LinkedIn content.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Turn On &quot;Open to Work&quot; (The Right Way)</h2>
                        <p className="text-muted-foreground leading-relaxed">LinkedIn lets you signal &quot;Open to Work&quot; to recruiters privately (without the green banner). Go to your profile → Click &quot;Open to&quot; → &quot;Finding a new job&quot; → Set visibility to &quot;Recruiters only&quot;. This dramatically increases your appearance in recruiter searches without alerting your current employer.</p>
                    </section>
                    <div className="glass rounded-[2rem] p-8 border-primary/20 text-center mt-12">
                        <h3 className="text-2xl font-black mb-3">Profile ready? Start applying.</h3>
                        <p className="text-muted-foreground mb-6">Browse hundreds of curated tech roles across India.</p>
                        <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-8">
                            Browse Jobs <BookOpen className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
