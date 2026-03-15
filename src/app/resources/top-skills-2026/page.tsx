import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Top 10 In-Demand Tech Skills for 2026 | Career Guide',
    description: 'Discover the most in-demand technical skills for 2026 in India. From AI/ML to cloud computing, learn what employers are looking for.',
};

export default function TopSkillsPage() {
    const skills = [
        { rank: 1, name: 'Artificial Intelligence & Machine Learning', demand: 'Very High', why: 'Every industry is adopting AI. Companies need engineers who can build and deploy ML models, work with LLMs, and implement AI-powered features. Knowledge of Python, TensorFlow, PyTorch, and generative AI frameworks is critical.' },
        { rank: 2, name: 'Cloud Computing (AWS, Azure, GCP)', demand: 'Very High', why: 'As companies migrate to the cloud, engineers who can architect, deploy, and manage cloud infrastructure are in massive demand. AWS remains the market leader in India, but Azure is growing fast in enterprise sectors.' },
        { rank: 3, name: 'Full-Stack Development (React + Node.js)', demand: 'High', why: 'The MERN (MongoDB, Express, React, Node.js) and Next.js stacks dominate the Indian startup ecosystem. Full-stack developers who can build end-to-end products independently are highly valued.' },
        { rank: 4, name: 'DevOps & CI/CD', demand: 'High', why: 'Tools like Docker, Kubernetes, Jenkins, GitHub Actions, and Terraform are now expected knowledge for most engineering roles. DevOps engineers bridge the gap between development and operations.' },
        { rank: 5, name: 'Cybersecurity', demand: 'High', why: 'With increasing digital threats, companies are investing heavily in security. Skills in penetration testing, SIEM tools, cloud security, and compliance frameworks (ISO 27001, SOC 2) are in demand.' },
        { rank: 6, name: 'Data Engineering', demand: 'High', why: 'Building data pipelines, working with tools like Apache Kafka, Spark, Airflow, and managing data warehouses (Snowflake, BigQuery) is critical for companies making data-driven decisions.' },
        { rank: 7, name: 'Mobile Development (React Native / Flutter)', demand: 'Medium-High', why: 'Cross-platform mobile development is preferred over native for most startups. Flutter has seen explosive growth in India, while React Native remains strong in the enterprise space.' },
        { rank: 8, name: 'System Design', demand: 'Medium-High', why: 'Not just for interviews — understanding distributed systems, scalability patterns, microservices architecture, and database design is essential for mid-level and senior roles.' },
        { rank: 9, name: 'Blockchain & Web3', demand: 'Medium', why: 'While the hype has normalized, companies building fintech, supply chain, and identity solutions still need Solidity developers and blockchain architects. India has a strong Web3 developer community.' },
        { rank: 10, name: 'Low-Code / No-Code Platforms', demand: 'Growing', why: 'Tools like Retool, Appsmith, and Power Platform are being adopted for internal tools. Engineers who can bridge traditional development with low-code solutions command unique value.' },
    ];

    return (
        <div className="min-h-screen py-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/resources" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Resources
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Skills</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> 6 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Top 10 In-Demand Tech Skills for 2026</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    The tech landscape evolves rapidly. Here are the skills that Indian employers are actively hiring for in 2026.
                </p>

                <div className="prose prose-invert max-w-none space-y-6">
                    {skills.map((skill) => (
                        <div key={skill.rank} className="bg-secondary/30 rounded-2xl p-6 border border-border">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shrink-0 text-sm">
                                    #{skill.rank}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-lg font-bold">{skill.name}</h2>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            skill.demand === 'Very High' ? 'bg-green-500/20 text-green-400' :
                                            skill.demand === 'High' ? 'bg-blue-500/20 text-blue-400' :
                                            skill.demand === 'Medium-High' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-purple-500/20 text-purple-400'
                                        }`}>
                                            {skill.demand}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{skill.why}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="glass rounded-[2rem] p-8 border-primary/20 text-center mt-12">
                        <h3 className="text-2xl font-black mb-3">Build skills, then apply.</h3>
                        <p className="text-muted-foreground mb-6">Find roles that match your skillset today.</p>
                        <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-8">
                            Browse Jobs <GraduationCap className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
