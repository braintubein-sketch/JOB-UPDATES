import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Send, Linkedin, Twitter, Github, Globe, Shield, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About JOB UPDATES | India\'s Premier Tech Job Portal',
    description: 'Learn about JOB UPDATES - the most trusted destination for premium IT job opportunities in India. 100% verified, curated tech roles.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-24 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-8 border border-primary/20">
                        <Sparkles className="w-4 h-4 fill-primary" />
                        <span>Our Origin Story</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                        The Future of <br />
                        <span className="gradient-text italic">Tech Hiring</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        JOB UPDATES was born from a simple observation: the IT job market in India is cluttered.
                        We exist to filter the noise and deliver pure, premium opportunities.
                    </p>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "100% Verified", desc: "Every single post is hand-verified against official career portals. No bots, no spam." },
                        { icon: Zap, title: "Speed Matters", desc: "Get real-time alerts via Telegram. Be the first to apply to high-demand roles." },
                        { icon: Globe, title: "India Focused", desc: "Dedicated to the Indian tech ecosystem, from Bangalore to remote-first startups." },
                    ].map((val, i) => (
                        <div key={i} className="card-premium !p-10 group">
                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                                <val.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">{val.title}</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 bg-secondary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
                                Curated for the <br />
                                <span className="text-primary italic">Elite 1%</span>
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
                                We don&apos;t just post jobs; we curate careers. Our platform is designed specifically for software engineers,
                                data scientists, architects, and visionaries who are ready for their next big challenge.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {['Software Engineering', 'AI & Machine Learning', 'Cloud & DevOps', 'Cyber Security', 'Product Management', 'Full Stack Tech'].map((tag) => (
                                    <div key={tag} className="flex items-center gap-3 font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="card-premium !p-0 overflow-hidden relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                                    alt="Tech Team"
                                    className="w-full h-[500px] object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10">
                                    <div className="text-4xl font-black text-white italic">#INDIA_TECH</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16 leading-none">
                    Let&apos;s Build <br />
                    <span className="gradient-text italic">Together</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-start text-left">
                    <div className="space-y-12">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-[2rem] bg-secondary border border-border flex items-center justify-center text-primary shadow-xl">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs font-black tracking-widest text-muted-foreground uppercase mb-1">Direct Contact</div>
                                <a href="mailto:contact@braintube.in" className="text-2xl font-black hover:text-primary transition-colors">contact@braintube.in</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-[2rem] bg-secondary border border-border flex items-center justify-center text-primary shadow-xl">
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs font-black tracking-widest text-muted-foreground uppercase mb-1">Fastest Support</div>
                                <a href="https://t.me/JOB_UPDATES" className="text-2xl font-black hover:text-primary transition-colors">@JOB_UPDATES</a>
                            </div>
                        </div>
                    </div>

                    <div className="glass !p-10 rounded-[3rem] border-primary/20">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" placeholder="Full Name" className="input-premium !rounded-2xl" />
                                <input type="email" placeholder="Work Email" className="input-premium !rounded-2xl" />
                            </div>
                            <input type="text" placeholder="Subject" className="input-premium !rounded-2xl" />
                            <textarea placeholder="Your Message" className="input-premium !rounded-2xl h-40 resize-none" />
                            <button className="btn-primary w-full h-16 rounded-2xl font-black italic shadow-2xl">
                                TRANSMIT MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
