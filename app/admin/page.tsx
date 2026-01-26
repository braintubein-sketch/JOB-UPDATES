import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Check, X, Edit2, Plus,
    TrendingUp, AlertCircle, Database, Send
} from 'lucide-react';

import ManualFetchButton from '@/components/admin/ManualFetchButton';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let jobs: any[] = [];
    let total = 0;
    let pending = 0;
    let dbError = false;

    try {
        await dbConnect();
        jobs = await Job.find({}).sort({ createdAt: -1 }).limit(20).lean();
        total = await Job.countDocuments();
        pending = await Job.countDocuments({ status: 'PENDING' });
    } catch (error) {
        console.error('Admin DB error:', error);
        dbError = true;
    }

    return (
        <div className="container-premium py-20 flex flex-col gap-12">

            {/* 1. TOP STATS BAR */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-slate-900 leading-tight">Portal Control</h1>
                    <p className="text-slate-500 font-bold">Managing {total} verified recruitment entries.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <StatBox icon={<Database />} label="Total" value={total} />
                    <ManualFetchButton />

                    {/* NEW: FORCE SOCIAL BUTTON */}
                    <Link
                        href="/api/cron/force-post?key=Raghu@2244"
                        target="_blank"
                        className="btn-action bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 h-[52px] px-6 rounded-xl"
                    >
                        <Send size={18} /> Push TG
                    </Link>

                    <LogoutButton />
                </div>
            </div>

            {dbError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600 font-bold">
                    Database Connection Offline. Check MONGODB_URI.
                </div>
            )}

            {/* 2. MAIN TABLE LIST */}
            <div className="card-premium overflow-hidden p-0">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-bold text-xl">Recently Fetched Jobs</h2>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Status</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-blue-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-bold uppercase text-xs">Title & Org</th>
                                <th className="p-4 font-bold uppercase text-xs">Posted To TG</th>
                                <th className="p-4 font-bold uppercase text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {jobs.map((job: any) => (
                                <tr key={job._id.toString()} className="hover:bg-blue-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-sm leading-tight mb-1">{job.title}</div>
                                        <div className="text-[10px] font-bold uppercase text-primary-600">{job.organization}</div>
                                    </td>
                                    <td className="p-4">
                                        {job.telegramPosted ? (
                                            <span className="text-green-600 flex items-center gap-1 font-bold text-xs"><Check size={14} /> Sent</span>
                                        ) : (
                                            <span className="text-slate-400 flex items-center gap-1 font-bold text-xs"><AlertCircle size={14} /> Waiting</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/jobs/${job.slug}`} className="text-primary-600 hover:underline font-bold text-xs">View Site</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value }: { icon: any, label: string, value: number }) {
    return (
        <div className="card-premium p-4 px-6 flex items-center gap-4">
            <div className="text-blue-600 opacity-60">{icon}</div>
            <div className="flex flex-col">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-500">{label}</span>
                <span className="text-2xl font-bold">{value}</span>
            </div>
        </div>
    );
}
