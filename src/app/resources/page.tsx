import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, TrendingUp, FileText, Users, Lightbulb, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Career Resources | IT Job Tips, Salary Guide & Interview Prep',
    description: 'Free career resources for IT professionals in India. Resume tips, salary negotiation guide, interview preparation, and career growth strategies for software engineers.',
    keywords: ['IT career tips', 'software engineer salary India', 'tech interview preparation', 'resume tips for freshers', 'career growth in IT'],
};

const resources = [
    {
        slug: 'resume-tips-for-freshers',
        icon: FileText,
        title: 'Resume Tips for IT Freshers in 2026',
        description: 'Learn how to craft a standout resume that gets you shortlisted at top tech companies. Includes ATS-friendly templates and real examples.',
        readTime: '8 min read',
        category: 'Resume',
    },
    {
        slug: 'salary-guide-india-2026',
        icon: TrendingUp,
        title: 'IT Salary Guide India 2026: What You Should Be Earning',
        description: 'Comprehensive salary data for software engineers, data scientists, DevOps engineers, and more across major Indian cities.',
        readTime: '12 min read',
        category: 'Salary',
    },
    {
        slug: 'crack-tech-interview',
        icon: Lightbulb,
        title: 'How to Crack Your First Tech Interview',
        description: 'Step-by-step guide to preparing for technical interviews at product companies. Covers DSA, system design, and behavioral rounds.',
        readTime: '15 min read',
        category: 'Interview',
    },
    {
        slug: 'top-skills-2026',
        icon: GraduationCap,
        title: 'Top 10 In-Demand Tech Skills for 2026',
        description: 'The most sought-after technical skills by employers in India. From AI/ML to cloud computing, discover what to learn next.',
        readTime: '6 min read',
        category: 'Skills',
    },
    {
        slug: 'career-switch-to-tech',
        icon: Users,
        title: 'How to Switch Your Career to Tech in 2026',
        description: 'A practical guide for non-tech professionals looking to transition into IT. Covers bootcamps, certifications, and portfolio building.',
        readTime: '10 min read',
        category: 'Career',
    },
    {
        slug: 'linkedin-optimization',
        icon: BookOpen,
        title: 'LinkedIn Profile Optimization for Tech Professionals',
        description: 'Make recruiters come to you. Expert tips on optimizing your LinkedIn profile, headline, summary, and skills section.',
        readTime: '7 min read',
        category: 'Networking',
    },
];

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="py-24 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-8 border border-primary/20">
                        <Sparkles className="w-4 h-4 fill-primary" />
                        <span>Free Resources</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                        Level Up Your <br />
                        <span className="gradient-text italic">Tech Career</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Expert guides, salary insights, and practical tips to help you land your dream IT job in India.
                        Written by industry professionals.
                    </p>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource) => (
                        <Link
                            key={resource.slug}
                            href={`/resources/${resource.slug}`}
                            className="card-premium !p-8 group hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <resource.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black tracking-widest text-primary uppercase">{resource.category}</span>
                            </div>
                            <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{resource.title}</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{resource.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-medium">{resource.readTime}</span>
                                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 max-w-4xl mx-auto px-4 text-center">
                <div className="glass rounded-[2rem] p-12 border-primary/20">
                    <h2 className="text-3xl font-black tracking-tighter mb-4">Ready to Apply?</h2>
                    <p className="text-muted-foreground mb-8 font-medium">Browse hundreds of curated IT jobs from top companies across India.</p>
                    <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-8">
                        Browse Jobs <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
