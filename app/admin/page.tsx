import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Check, X, Edit, Eye } from 'lucide-react';

export default async function AdminDashboard() {
    const pendingJobs = await prisma.job.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
    });

    const totalJobs = await prisma.job.count();
    const approvedJobs = await prisma.job.count({ where: { status: 'APPROVED' } });

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <div className="bg-card-bg px-6 py-3 rounded-xl border border-border">
                        <span className="text-xs text-secondary uppercase font-bold">Total Jobs</span>
                        <div className="text-2xl font-bold">{totalJobs}</div>
                    </div>
                    <div className="bg-card-bg px-6 py-3 rounded-xl border border-border">
                        <span className="text-xs text-secondary uppercase font-bold">Pending</span>
                        <div className="text-2xl font-bold text-accent">{pendingJobs.length}</div>
                    </div>
                    <Link href="/admin/jobs/new" className="btn btn-primary h-full flex items-center">
                        Add Manual Job
                    </Link>
                </div>
            </div>

            <div className="bg-card-bg rounded-2xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-background/50">
                    <h2 className="font-bold">Pending Approval</h2>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-secondary uppercase border-b border-border">
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Org</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {pendingJobs.map((job: any) => (
                            <tr key={job.id} className="hover:bg-background/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-sm max-w-xs truncate">{job.title}</td>
                                <td className="px-6 py-4 text-sm text-secondary">{job.organization}</td>
                                <td className="px-6 py-4">
                                    <span className="badge badge-govt text-[10px]">{job.category}</span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                        <Check size={18} />
                                    </button>
                                    <button className="p-2 text-primary hover:bg-primary/5 rounded-lg" title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pendingJobs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-secondary italic">
                                    No pending jobs to approve.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
