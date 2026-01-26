import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Check, AlertCircle, Database, Send, LayoutDashboard, Briefcase,
    ArrowUpRight, ExternalLink, Settings, LogOut, RefreshCw
} from 'lucide-react';

import ManualFetchButton from '@/components/admin/ManualFetchButton';
import LogoutButton from '@/components/admin/LogoutButton';
import WhatsAppIdFinder from '@/components/admin/WhatsAppIdFinder';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let jobs: any[] = [];
    let total = 0;
    let postedCount = 0;
    let dbError = false;

    try {
        await dbConnect();
        jobs = await Job.find({}).sort({ createdAt: -1 }).limit(20).lean();
        total = await Job.countDocuments();
        postedCount = await Job.countDocuments({ telegramPosted: true });
    } catch (error) {
        console.error('Admin DB error:', error);
        dbError = true;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Top Navigation / Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="container-main flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin <span className="text-blue-600">Console</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="btn-secondary py-2 px-3 text-xs flex items-center gap-2">
                            <ArrowUpRight size={14} /> View Site
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </div>

            <div className="container-main py-10">
                {/* 1. STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="card flex items-center gap-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Database size={24} />
                        </div>
                        <div>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Database</p>
                            <h3 className="text-3xl font-bold">{total} Entries</h3>
                        </div>
                    </div>

                    <div className="card flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                            <Check size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Social Published</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{postedCount} Telegram</h3>
                        </div>
                    </div>

                    <div className="card flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Live Categories</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">All Active</h3>
                        </div>
                    </div>
                </div>

                {/* 2. ACTION PANEL */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Jobs Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card p-0 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Recently Fetched</h2>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded">Live Feed</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800 auto-cols-auto">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Job Information</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Social Status</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500 text-right">Preview</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {jobs.map((job: any) => (
                                            <tr key={job._id.toString()} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 dark:text-white mb-0.5">{job.title}</div>
                                                    <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{job.organization}</div>
                                                </td>
                                                <td className="p-4">
                                                    {job.telegramPosted ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase">
                                                            <Check size={12} /> Posted
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black uppercase">
                                                            <RefreshCw size={12} className="animate-spin-slow" /> Pending
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={`/jobs/${job.slug}`}
                                                        target="_blank"
                                                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all inline-flex"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Controls Sidebar */}
                    <div className="space-y-6">
                        <div className="card border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/5">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Settings size={16} className="text-blue-600" />
                                Automation Controls
                            </h3>
                            <div className="space-y-3">
                                <ManualFetchButton />
                                <Link
                                    href="/api/cron/force-post?key=Raghu@2244"
                                    target="_blank"
                                    className="w-full btn bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-slate-200 flex items-center justify-center gap-2 py-3.5 h-[52px]"
                                >
                                    <Send size={18} />
                                    Push Slack/TG Now
                                </Link>
                            </div>
                            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed font-medium">
                                * Pushing TG will force a Telegram alert for the 3 latest unpublished items in the database.
                            </p>
                        </div>

                        {dbError && (
                            <div className="card border-red-200 bg-red-50 text-red-600 flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span className="font-bold text-sm">Database connection offline</span>
                            </div>
                        )}

                        <WhatsAppIdFinder />
                    </div>
                </div>
            </div>
        </div>
    );
}
