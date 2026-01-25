import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Check, X, Edit2, Plus,
    TrendingUp, AlertCircle, Database
} from 'lucide-react';

import ManualFetchButton from '@/components/admin/ManualFetchButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let jobs: any[] = [];
    let total = 0;
    let pending = 0;
    let expired = 0;
    let dbError = false;

    try {
        await dbConnect();
        jobs = await Job.find({}).sort({ createdAt: -1 }).limit(50).lean();
        total = await Job.countDocuments();
        pending = await Job.countDocuments({ status: 'PENDING' });
        expired = await Job.countDocuments({ status: 'EXPIRED' });
    } catch (error) {
        console.error('Admin DB error:', error);
        dbError = true;
    }

    return (
        <div className="container-premium py-20 flex flex-col gap-12">

            {/* 1. TOP STATS BAR */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-slate-500">Managing {total} verified recruitment entries.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <StatBox icon={<Database />} label="Total" value={total} />
                    <StatBox icon={<AlertCircle />} label="Pending" value={pending} />
                    <ManualFetchButton />
                    <Link href="/admin/jobs/new" className="btn-premium btn-primary flex items-center h-full">
                        <Plus size={20} /> Add Job
                    </Link>
                </div>
            </div>

            {dbError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-semibold">Database connection failed. Please check your MONGODB_URI.</p>
                </div>
            )}

            {/* 2. MAIN TABLE LIST */}
            <div className="card-premium overflow-hidden p-0">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-bold text-xl">Recent Database Entries</h2>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Last 50 Jobs</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-blue-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest text-slate-600">Title & Org</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest text-slate-600">Status</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest text-slate-600">Released</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {jobs.map((job: any) => (
                                <tr key={job._id.toString()} className="hover:bg-blue-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-lg leading-tight mb-1">{job.title}</div>
                                        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{job.organization}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            job.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-slate-600">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Approve">
                                                <Check size={18} />
                                            </button>
                                            <button className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && !dbError && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No jobs in database yet. Use the automation or add manually.
                                    </td>
                                </tr>
                            )}
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
