import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'IT Salary Guide India 2026 | Software Engineer Salary Data',
    description: 'Comprehensive salary data for IT professionals in India 2026. Compare salaries for software engineers, data scientists, DevOps, and more across Bangalore, Hyderabad, Pune, and other cities.',
};

export default function SalaryGuidePage() {
    return (
        <div className="min-h-screen py-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/resources" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Resources
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Salary</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> 12 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">IT Salary Guide India 2026</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    What should you be earning as a tech professional in India? Here&apos;s real salary data across roles, experience levels, and cities.
                </p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Software Engineer Salaries</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Software engineering remains the backbone of India&apos;s tech industry. Here&apos;s what companies are paying in 2026:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-primary/10">
                                        <th className="text-left p-4 font-bold">Experience</th>
                                        <th className="text-left p-4 font-bold">Service Companies</th>
                                        <th className="text-left p-4 font-bold">Product Companies</th>
                                        <th className="text-left p-4 font-bold">FAANG/Startups</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">0-1 years (Fresher)</td>
                                        <td className="p-4">₹3.5 - 5 LPA</td>
                                        <td className="p-4">₹6 - 12 LPA</td>
                                        <td className="p-4">₹15 - 45 LPA</td>
                                    </tr>
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">1-3 years</td>
                                        <td className="p-4">₹5 - 8 LPA</td>
                                        <td className="p-4">₹10 - 18 LPA</td>
                                        <td className="p-4">₹25 - 55 LPA</td>
                                    </tr>
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">3-5 years</td>
                                        <td className="p-4">₹8 - 14 LPA</td>
                                        <td className="p-4">₹18 - 30 LPA</td>
                                        <td className="p-4">₹40 - 75 LPA</td>
                                    </tr>
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">5-8 years</td>
                                        <td className="p-4">₹14 - 22 LPA</td>
                                        <td className="p-4">₹28 - 50 LPA</td>
                                        <td className="p-4">₹60 - 1 Cr+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 italic">
                            *LPA = Lakhs Per Annum. Figures include base salary + bonus. ESOP grants are excluded. Data compiled from job postings and industry surveys.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Data Science & AI/ML Salaries</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            AI and Machine Learning roles command some of the highest premiums in the industry, driven by strong demand and limited supply of qualified professionals.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-primary/10">
                                        <th className="text-left p-4 font-bold">Role</th>
                                        <th className="text-left p-4 font-bold">Fresher</th>
                                        <th className="text-left p-4 font-bold">Mid-Level (3-5 yrs)</th>
                                        <th className="text-left p-4 font-bold">Senior (5+ yrs)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">Data Analyst</td>
                                        <td className="p-4">₹4 - 8 LPA</td>
                                        <td className="p-4">₹10 - 18 LPA</td>
                                        <td className="p-4">₹20 - 35 LPA</td>
                                    </tr>
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">Data Scientist</td>
                                        <td className="p-4">₹8 - 15 LPA</td>
                                        <td className="p-4">₹18 - 35 LPA</td>
                                        <td className="p-4">₹40 - 70 LPA</td>
                                    </tr>
                                    <tr className="border-t border-border">
                                        <td className="p-4 font-medium">ML Engineer</td>
                                        <td className="p-4">₹10 - 18 LPA</td>
                                        <td className="p-4">₹25 - 45 LPA</td>
                                        <td className="p-4">₹50 - 1 Cr+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">City-Wise Salary Comparison</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Location plays a significant role in salary expectations. Here&apos;s how cities compare for a mid-level software engineer (3-5 years experience):
                        </p>
                        <div className="space-y-3">
                            {[
                                { city: 'Bangalore', range: '₹18 - 40 LPA', premium: '(Highest — tech capital)' },
                                { city: 'Hyderabad', range: '₹15 - 35 LPA', premium: '(Growing fast)' },
                                { city: 'Pune', range: '₹14 - 30 LPA', premium: '(Strong IT presence)' },
                                { city: 'Mumbai', range: '₹16 - 35 LPA', premium: '(High cost of living)' },
                                { city: 'Delhi NCR / Gurgaon', range: '₹15 - 35 LPA', premium: '(Startup hub)' },
                                { city: 'Chennai', range: '₹12 - 28 LPA', premium: '(Service company hub)' },
                                { city: 'Remote (India)', range: '₹15 - 50 LPA', premium: '(Varies widely)' },
                            ].map((item) => (
                                <div key={item.city} className="flex items-center justify-between bg-secondary/30 rounded-xl p-4 border border-border">
                                    <div>
                                        <span className="font-bold">{item.city}</span>
                                        <span className="text-xs text-muted-foreground ml-2">{item.premium}</span>
                                    </div>
                                    <span className="text-primary font-bold">{item.range}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">How to Negotiate Your Salary</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Many Indian engineers leave money on the table by accepting the first offer. Here are proven negotiation strategies:
                        </p>
                        <ul className="list-disc list-inside space-y-3 text-muted-foreground mt-4">
                            <li><strong>Research first:</strong> Use this guide and platforms like Glassdoor, AmbitionBox, and Levels.fyi to know your market value.</li>
                            <li><strong>Never reveal your current salary:</strong> When asked, say &quot;I&apos;m looking for a role in the range of ₹X - ₹Y based on my skills and the market rate.&quot;</li>
                            <li><strong>Have competing offers:</strong> Nothing strengthens your position more than having multiple offers.</li>
                            <li><strong>Negotiate the total package:</strong> Consider base salary, bonus, ESOPs, joining bonus, and benefits as a whole.</li>
                            <li><strong>Be professional:</strong> Express enthusiasm for the role while being firm about your expectations.</li>
                        </ul>
                    </section>

                    {/* CTA */}
                    <div className="glass rounded-[2rem] p-8 border-primary/20 text-center mt-12">
                        <h3 className="text-2xl font-black mb-3">Know your worth? Start applying.</h3>
                        <p className="text-muted-foreground mb-6">Find roles that match your skill level and salary expectations.</p>
                        <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-8">
                            Browse Jobs <TrendingUp className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
