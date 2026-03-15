import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Resume Tips for IT Freshers in 2026 | Career Guide',
    description: 'Learn how to create an ATS-friendly resume that gets you shortlisted at top tech companies in India. Practical tips for freshers and entry-level engineers.',
};

export default function ResumeTipsPage() {
    return (
        <div className="min-h-screen py-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/resources" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Resources
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Resume</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> 8 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Resume Tips for IT Freshers in 2026</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    Your resume is the first impression you make on a potential employer. Here&apos;s how to make it count — even with zero experience.
                </p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">1. Keep It to One Page</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            As a fresher, there is no reason your resume should exceed one page. Recruiters spend an average of 6-7 seconds scanning a resume. A concise, well-structured one-page document is far more effective than a sprawling two-page resume filled with irrelevant details.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Focus on what matters: your education, technical skills, projects, and any internship or freelance experience. Remove objectives, hobbies (unless tech-related), and generic statements like &quot;hard-working team player.&quot;
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">2. Use an ATS-Friendly Format</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Most large companies in India — TCS, Infosys, Wipro, Amazon, Google — use Applicant Tracking Systems (ATS) to filter resumes before a human ever sees them. An ATS reads your resume as plain text, so fancy graphics, tables, and images will break it.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Use a clean, single-column layout</li>
                            <li>Use standard section headings: &quot;Education&quot;, &quot;Skills&quot;, &quot;Projects&quot;, &quot;Experience&quot;</li>
                            <li>Avoid headers, footers, and text boxes</li>
                            <li>Save as PDF (unless the portal specifically asks for .docx)</li>
                            <li>Use standard fonts like Calibri, Arial, or Times New Roman</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">3. Lead With Projects, Not Just Education</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your college degree gets you in the door, but your projects prove you can actually build things. For each project, include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Project Name</strong> with a brief one-line description</li>
                            <li><strong>Tech Stack</strong> used (e.g., React, Node.js, MongoDB)</li>
                            <li><strong>Your Contribution</strong> — what did YOU specifically build?</li>
                            <li><strong>Impact/Result</strong> — did it solve a problem? How many users?</li>
                            <li><strong>GitHub Link</strong> — always include this if possible</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed">
                            A well-documented GitHub profile with 3-4 solid projects is worth more than a 9.5 CGPA to most tech recruiters.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">4. Tailor Your Skills Section</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Don&apos;t list every technology you&apos;ve ever heard of. Instead, categorize your skills and be honest about your proficiency level:
                        </p>
                        <div className="bg-secondary/50 rounded-2xl p-6 my-4 border border-border">
                            <p className="text-sm font-mono text-foreground">
                                <strong>Languages:</strong> Java, Python, JavaScript, SQL<br />
                                <strong>Frontend:</strong> React.js, HTML5, CSS3, Tailwind CSS<br />
                                <strong>Backend:</strong> Node.js, Express.js, Spring Boot<br />
                                <strong>Databases:</strong> MySQL, MongoDB, PostgreSQL<br />
                                <strong>Tools:</strong> Git, Docker, VS Code, Postman<br />
                                <strong>Cloud:</strong> AWS (EC2, S3), Firebase
                            </p>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Pro tip: Read the job description carefully and mirror the exact keywords they use. If they say &quot;React.js&quot;, don&apos;t write &quot;ReactJS&quot; — match exactly for ATS compatibility.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">5. Quantify Everything</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Numbers make your achievements concrete and credible. Compare these two bullet points:
                        </p>
                        <div className="space-y-3 my-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">❌ &quot;Built a web application for managing tasks&quot;</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">✅ &quot;Built a full-stack task management app using React + Node.js, serving 200+ daily active users with 99.5% uptime&quot;</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Even academic projects can be quantified: number of test cases passed, response time improvements, dataset size, etc.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">6. Include Certifications and Competitive Coding</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For freshers, certifications and coding profiles add significant credibility:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>LeetCode / HackerRank / CodeChef:</strong> Mention your rating and problems solved (e.g., &quot;LeetCode: 400+ problems, Rating 1800+&quot;)</li>
                            <li><strong>AWS Certified Cloud Practitioner:</strong> Highly valued for cloud roles</li>
                            <li><strong>Google Data Analytics Certificate:</strong> Great for data roles</li>
                            <li><strong>Meta Frontend Developer Certificate:</strong> Adds weight to frontend profiles</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">7. Proofread Ruthlessly</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            A single typo can get your resume rejected. Read it backwards (literally, sentence by sentence from bottom to top) to catch errors your brain normally skips. Better yet, have a friend or mentor review it.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Common mistakes to avoid: inconsistent date formats, mismatched bullet points, broken links, and using &quot;Proficient in MS Office&quot; on a software engineering resume.
                        </p>
                    </section>

                    {/* CTA */}
                    <div className="glass rounded-[2rem] p-8 border-primary/20 text-center mt-12">
                        <h3 className="text-2xl font-black mb-3">Got your resume ready?</h3>
                        <p className="text-muted-foreground mb-6">Apply to the latest IT openings across India.</p>
                        <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-8">
                            Browse Jobs <FileText className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
