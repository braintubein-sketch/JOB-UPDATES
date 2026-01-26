import { ShieldCheck, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
                <div className="container-main text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        About <span className="text-blue-600">JobUpdates</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
                        Empowering Indian job seekers with fast, verified, and direct recruitment alerts.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container-main py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="card md:p-12 mb-12">
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                                In an era of misinformation and complicated recruitment processes, <span className="font-bold text-blue-600">JobUpdates</span> was founded to bridge the gap between official notifications and job seekers. We believe that every citizen deserves easy access to employment opportunities without falling into the trap of fake alerts or middle-man fees.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 my-12">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">100% Verified</h3>
                                        <p className="text-sm text-slate-500 mt-1">Every link points directly to official department portals.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Real-Time Alerts</h3>
                                        <p className="text-sm text-slate-500 mt-1">Our automated systems fetch updates every 10 minutes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Focused Search</h3>
                                        <p className="text-sm text-slate-500 mt-1">Central, State, and MNC jobs all in one place.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">User Centric</h3>
                                        <p className="text-sm text-slate-500 mt-1">Designed for speed and clarity on any mobile device.</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                We monitor over 500+ official sources, including SSC, UPSC, Railways, Banking, Defense, and top corporate HR portals. Our team of editors ensures that the most important details like salary, last date, and eligibility are highlighted clearly for our users.
                            </p>
                        </div>
                    </div>

                    {/* Team Quote */}
                    <div className="text-center">
                        <blockquote className="text-xl font-medium italic text-slate-500 dark:text-slate-400 border-l-4 border-blue-600 pl-4 py-2 mb-4">
                            "Connecting India through verified opportunities."
                        </blockquote>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest text-center">— The JobUpdates Team</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
