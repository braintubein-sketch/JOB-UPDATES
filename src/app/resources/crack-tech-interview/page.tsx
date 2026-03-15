import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
    title: 'How to Crack Your First Tech Interview | Interview Guide 2026',
    description: 'Complete guide to cracking technical interviews at top companies in India. Covers DSA preparation, system design basics, HR rounds, and common mistakes to avoid.',
};

export default function InterviewGuidePage() {
    return (
        <div className="min-h-screen py-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/resources" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Resources
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Interview</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> 15 min read</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">How to Crack Your First Tech Interview</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    A step-by-step roadmap to preparing for and clearing technical interviews at Indian product companies and MNCs.
                </p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Understanding the Interview Process</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Most tech companies in India follow a structured interview process. Understanding each stage gives you a strategic advantage:
                        </p>
                        <div className="space-y-4 my-6">
                            {[
                                { step: '1', title: 'Online Assessment (OA)', desc: 'Usually 2-3 coding problems on platforms like HackerRank or Codility. Time limit: 60-90 minutes. Focus: Arrays, Strings, Sorting, Basic DP.' },
                                { step: '2', title: 'Technical Round 1 (DSA)', desc: 'Live coding round with a senior engineer. Expect 1-2 medium difficulty problems. You must think out loud and communicate your approach.' },
                                { step: '3', title: 'Technical Round 2 (System Design / Deep Dive)', desc: 'For freshers: LLD (Low-Level Design) or a project deep-dive. For experienced: HLD (High-Level Design) like designing a URL shortener or chat system.' },
                                { step: '4', title: 'HR / Managerial Round', desc: 'Behavioral questions, salary discussion, and culture fit assessment. Often underestimated but can be a dealbreaker.' },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4 bg-secondary/30 rounded-xl p-5 border border-border">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shrink-0">{item.step}</div>
                                    <div>
                                        <h3 className="font-bold mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">The 90-Day DSA Preparation Plan</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You do not need to solve 1000 LeetCode problems. A focused preparation of 150-200 carefully chosen problems is far more effective. Here&apos;s a proven plan:
                        </p>

                        <h3 className="text-lg font-bold mb-2 mt-6">Month 1: Build Foundations</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Week 1-2:</strong> Arrays, Strings, and Hashing — practice 20 problems each</li>
                            <li><strong>Week 3:</strong> Linked Lists and Two Pointers technique</li>
                            <li><strong>Week 4:</strong> Stacks, Queues, and Sliding Window</li>
                        </ul>

                        <h3 className="text-lg font-bold mb-2 mt-6">Month 2: Core Algorithms</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Week 5-6:</strong> Binary Search (on arrays and on answer) and Sorting algorithms</li>
                            <li><strong>Week 7:</strong> Trees (BFS, DFS, BST) and Recursion</li>
                            <li><strong>Week 8:</strong> Graphs (BFS, DFS, Dijkstra, Topological Sort)</li>
                        </ul>

                        <h3 className="text-lg font-bold mb-2 mt-6">Month 3: Advanced Topics + Mock Interviews</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><strong>Week 9-10:</strong> Dynamic Programming (start with easy ones, then medium)</li>
                            <li><strong>Week 11:</strong> Greedy algorithms, Tries, and Bit Manipulation</li>
                            <li><strong>Week 12:</strong> Mock interviews on Pramp or with friends — simulate real conditions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Top Resources for Preparation</h2>
                        <div className="space-y-3">
                            {[
                                { name: 'Striver A2Z DSA Sheet', desc: 'Most popular DSA sheet in India. Covers 450+ problems organized by topic.' },
                                { name: 'NeetCode 150', desc: 'Curated list of 150 LeetCode problems covering all major patterns.' },
                                { name: 'LeetCode', desc: 'The standard platform for practicing coding problems. Focus on Medium difficulty.' },
                                { name: 'GeeksforGeeks', desc: 'Great for learning concepts and reading editorial solutions in multiple languages.' },
                                { name: 'System Design Primer (GitHub)', desc: 'Free, comprehensive guide to system design concepts for beginners.' },
                            ].map((resource) => (
                                <div key={resource.name} className="bg-secondary/30 rounded-xl p-4 border border-border">
                                    <span className="font-bold">{resource.name}</span>
                                    <p className="text-sm text-muted-foreground mt-1">{resource.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Common Mistakes to Avoid</h2>
                        <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                            <li><strong>Jumping to code immediately:</strong> Always spend 3-5 minutes understanding the problem, clarifying edge cases, and explaining your approach first.</li>
                            <li><strong>Ignoring time complexity:</strong> Always analyze and state the time and space complexity of your solution. Interviewers expect this.</li>
                            <li><strong>Not practicing out loud:</strong> Technical interviews are verbal. Practice explaining your thought process while coding.</li>
                            <li><strong>Only solving, never reviewing:</strong> After solving a problem, read the optimal solution and understand WHY it works.</li>
                            <li><strong>Neglecting the HR round:</strong> Prepare your &quot;Tell me about yourself&quot;, &quot;Why this company?&quot;, and &quot;Where do you see yourself in 5 years?&quot; answers in advance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold gradient-text mb-4">Day-Of Tips</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Join the call 2 minutes early and test your mic/camera</li>
                            <li>Keep a glass of water nearby</li>
                            <li>Have pen and paper for rough work</li>
                            <li>If stuck, tell the interviewer — they will often give hints</li>
                            <li>Thank the interviewer at the end and ask one thoughtful question about the team/product</li>
                        </ul>
                    </section>

                    {/* CTA */}
                    <div className="glass rounded-[2rem] p-8 border-primary/20 text-center mt-12">
                        <h3 className="text-2xl font-black mb-3">Ready to put your skills to the test?</h3>
                        <p className="text-muted-foreground mb-6">Apply to IT roles at top companies across India.</p>
                        <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-8">
                            Browse Jobs <Lightbulb className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
