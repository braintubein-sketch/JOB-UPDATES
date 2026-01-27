'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Search,
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ManageJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const fetchJobs = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/jobs?page=${page}&limit=10&q=${searchTerm}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
                setPagination({
                    total: data.pagination.total,
                    page: data.pagination.page,
                    limit: data.pagination.limit,
                    totalPages: data.pagination.totalPages,
                });
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchTerm]);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const res = await fetch(`/api/jobs/${slug}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setJobs(jobs.filter((job) => job.slug !== slug));
            }
        } catch (error) {
            console.error('Failed to delete job:', error);
        }
    };

    const toggleStatus = async (slug: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/jobs/${slug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setJobs(
                    jobs.map((job) =>
                        job.slug === slug ? { ...job, isActive: !currentStatus } : job
                    )
                );
            }
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard" className="p-2 rounded-lg hover:bg-secondary transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-bold">Manage Jobs</h1>
                        </div>
                        <Link href="/admin/jobs/new" className="btn-primary flex items-center gap-2 py-2 px-4">
                            <Plus className="w-4 h-4" />
                            Add New Job
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters and Search */}
                <div className="bg-card border border-border rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by title, company, or category..."
                            className="input-premium pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary h-10 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>

                {/* Jobs Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/50 border-b border-border">
                                    <th className="px-6 py-4 font-semibold text-sm">Job Details</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Stats</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Status</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Posted</th>
                                    <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg skeleton" />
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-48 skeleton rounded" />
                                                        <div className="h-3 w-32 skeleton rounded" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <tr key={job._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-primary">
                                                        {job.company.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{job.title}</div>
                                                        <div className="text-xs text-muted-foreground">{job.company} • {job.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">Views:</span> {job.views}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">Clicks:</span> {job.clicks}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(job.slug, job.isActive)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${job.isActive
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : 'bg-red-500/10 text-red-500'
                                                        }`}
                                                >
                                                    {job.isActive ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {formatDate(job.postedDate)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/jobs/${job.slug}/edit`)}
                                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job.slug)}
                                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/jobs/${job.slug}`}
                                                        target="_blank"
                                                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                                        title="View Public"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            No jobs found. Add some jobs to see them here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 bg-secondary/10 border-t border-border flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>{' '}
                                of <span className="font-medium">{pagination.total}</span> jobs
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchJobs(pagination.page - 1)}
                                    disabled={pagination.page === 1 || loading}
                                    className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="text-sm font-medium">
                                    Page {pagination.page} of {pagination.totalPages}
                                </div>
                                <button
                                    onClick={() => fetchJobs(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages || loading}
                                    className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
