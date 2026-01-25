import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Check, X, Edit2, Plus,
    TrendingUp, AlertCircle, Database
} from 'lucide-react';

export default async function AdminDashboard() {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(50).lean();

    // Stats
    const total = await Job.countDocuments();
    const pending = await Job.countDocuments({ status: 'PENDING' });
    const expired = await Job.countDocuments({ status: 'EXPIRED' });

    return (
        <div className="container py-20 flex flex-col gap-12">

            {/* 1. TOP STATS BAR */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
                    <p className="text-secondary">Managing {total} verified recruitment entries.</p>
                </div>
                <div className="flex gap-4">
                    <StatBox icon={<Database />} label="Total" value={total} color="primary" />
                    <StatBox icon={<AlertCircle />} label="Pending" value={pending} color="accent" />
                    <Link href="/admin/jobs/new" className="btn-premium btn-primary flex items-center h-full">
                        <Plus size={20} /> Add Job
                    </Link>
                </div>
            </div>

            {/* 2. MAIN TABLE LIST */}
            <div className="card-stack overflow-hidden p-0 border-border">
                <div className="p-8 border-b border-border bg-background/50 flex justify-between items-center">
                    <h2 className="font-black text-xl">Recent Database Entries</h2>
                    <span className="text-xs font-black uppercase tracking-widest text-secondary">Last 50 Jobs</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-primary/5 border-b border-border">
                            <tr>
                                <th className="p-6 font-black uppercase text-[11px] tracking-widest">Title & Org</th>
                                <th className="p-6 font-black uppercase text-[11px] tracking-widest">Status</th>
                                <th className="p-6 font-black uppercase text-[11px] tracking-widest">Released</th>
                                <th className="p-6 font-black uppercase text-[11px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {jobs.map((job: any) => (
                                <tr key={job._id.toString()} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-lg leading-tight mb-1">{job.title}</div>
                                        <div className="text-xs font-black uppercase text-secondary tracking-widest">{job.organization}</div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${job.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                                                job.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                    'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-secondary">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 text-secondary">
                                            <button className="p-2 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Approve">
                                                <Check size={20} />
                                            </button>
                                            <button className="p-2 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Edit">
                                                <Edit2 size={20} />
                                            </button>
                                            <button className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                <X size={20} />
                                            </button>
                                        </div>
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

function StatBox({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    return (
        <div className="card-stack p-4 px-8 border-border flex items-center gap-4">
            <div className={`text-${color} opacity-40`}>{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-secondary">{label}</span>
                <span className="text-2xl font-black">{value}</span>
            </div>
        </div>
    );
}
