import dbConnect from '@/lib/mongodb/dbConnect';
import { Blog } from '@/models/Blog';
import Link from 'next/link';
import { BookOpen, Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    let articles: any[] = [];
    try {
        await dbConnect();
        articles = await Blog.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).lean();
    } catch (error) {
        console.error('Blog load error:', error);
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
                <div className="container-main text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Career <span className="text-blue-600">Insights</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        Expert advice, preparation tips, and latest trends in the Indian job market.
                    </p>
                </div>
            </div>

            <div className="container-main py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article: any) => (
                        <Link
                            key={article._id.toString()}
                            href={`/blog/${article.slug}`}
                            className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-full tracking-widest">
                                        {article.category}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {article.excerpt}
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar size={14} />
                                        {new Date(article.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {articles.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">Coming soon! Stay tuned for career articles.</p>
                        </div>
                    )}
                </div>

                {/* Newsletter Box (AdSense Friendly) */}
                <div className="mt-20 card bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 rounded-[40px] text-center">
                    <TrendingUp className="mx-auto mb-4 opacity-50" size={40} />
                    <h3 className="text-2xl font-bold mb-2">Subscribe for Exam Alerts</h3>
                    <p className="text-blue-100 mb-8 max-w-md mx-auto">Get the best career tips and job notifications directly in your inbox daily.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-100 focus:outline-none" />
                        <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors">Notify Me</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
