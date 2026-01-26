import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Blog } from '@/models/Blog';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    let article: any = null;

    try {
        await dbConnect();
        article = await Blog.findOneAndUpdate(
            { slug: params.slug },
            { $inc: { views: 1 } },
            { new: true }
        ).lean();
    } catch (error) {
        console.error('Blog detail error:', error);
    }

    if (!article) return notFound();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Post Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-16 pb-12">
                <div className="container-main max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 mb-8 hover:gap-1 transition-all">
                        <ArrowLeft size={16} /> Back to Insights
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-full tracking-widest">
                            {article.category}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                            <Clock size={14} /> 5 min read
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 py-8 border-y border-slate-100 dark:border-slate-800">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{article.author}</p>
                            <p className="text-xs text-slate-500">Career Expert at JobUpdates</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="container-main max-w-4xl py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1">
                        <article className="prose prose-slate prose-lg dark:prose-invert max-w-none">
                            <div className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {article.content}
                            </div>
                        </article>

                        {/* Social Share */}
                        <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-950/20 rounded-[30px] border border-blue-100 dark:border-blue-900/50">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Found this helpful?</h3>
                                    <p className="text-slate-500 text-sm">Share it with your fellow job seekers!</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 hover:scale-110 transition-all">
                                        <Facebook size={20} />
                                    </button>
                                    <button className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sky-500 hover:scale-110 transition-all">
                                        <Twitter size={20} />
                                    </button>
                                    <button className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-700 hover:scale-110 transition-all">
                                        <Linkedin size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
