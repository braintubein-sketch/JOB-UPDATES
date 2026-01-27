'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Building2,
    Users,
    TrendingUp,
    Plus,
    Eye,
    MousePointer,
    Send,
    Settings,
    LogOut,
    RefreshCw,
    Clock,
} from 'lucide-react';
import { Job } from '@/types';

interface Stats {
    totalJobs: number;
    activeJobs: number;
    totalViews: number;
    totalClicks: number;
    todayJobs: number;
    pendingApproval: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();

                if (data.success) {
                    setUser(data.data);
                } else {
                    router.push('/admin');
                }
            } catch {
                router.push('/admin');
            }
        };

        const fetchData = async () => {
            try {
                const jobsRes = await fetch('/api/jobs?limit=5&sortBy=postedDate&sortOrder=desc');
                const jobsData = await jobsRes.json();

                if (jobsData.success) {
                    setRecentJobs(jobsData.data);

                    // Calculate mock stats
                    setStats({
                        totalJobs: jobsData.pagination?.total || 0,
                        activeJobs: jobsData.data.filter((j: Job) => j.isActive).length,
                        totalViews: jobsData.data.reduce((sum: number, j: Job) => sum + j.views, 0),
                        totalClicks: jobsData.data.reduce((sum: number, j: Job) => sum + j.clicks, 0),
                        todayJobs: 5,
                        pendingApproval: 3,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold gradient-text">JOB UPDATES</span>
                            </Link>
                            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                                Admin
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name || 'Admin'}!</h1>
                    <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your job portal today.</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Briefcase className="w-8 h-8 text-blue-500" />
                            <span className="text-xs text-green-500 font-medium">+12%</span>
                        </div>
                        <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Jobs</div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Eye className="w-8 h-8 text-purple-500" />
                            <span className="text-xs text-green-500 font-medium">+8%</span>
                        </div>
                        <div className="text-2xl font-bold">{stats?.totalViews?.toLocaleString() || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Views</div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <MousePointer className="w-8 h-8 text-green-500" />
                            <span className="text-xs text-green-500 font-medium">+15%</span>
                        </div>
                        <div className="text-2xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</div>
                        <div className="text-sm text-muted-foreground">Applications</div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                        <div className="text-2xl font-bold">{stats?.pendingApproval || 0}</div>
                        <div className="text-sm text-muted-foreground">Pending Approval</div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <Link
                        href="/admin/jobs/new"
                        className="flex items-center gap-3 p-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add Job</span>
                    </Link>
                    <Link
                        href="/admin/jobs"
                        className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                    >
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">Manage Jobs</span>
                    </Link>
                    <Link
                        href="/admin/automation"
                        className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                        <span className="font-medium">Automation</span>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </motion.div>

                {/* Recent Jobs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-lg font-semibold">Recent Jobs</h2>
                        <Link href="/admin/jobs" className="text-primary text-sm hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {recentJobs.length > 0 ? (
                            recentJobs.map((job) => (
                                <div key={job._id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{job.title}</div>
                                            <div className="text-sm text-muted-foreground">{job.company}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-muted-foreground">
                                            {job.views} views • {job.clicks} clicks
                                        </div>
                                        {job.telegramPosted ? (
                                            <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
                                                Posted
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-500">
                                                Pending
                                            </span>
                                        )}
                                        <Link
                                            href={`/admin/jobs/${job.slug}/edit`}
                                            className="text-primary text-sm hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                No jobs yet. <Link href="/admin/jobs/new" className="text-primary hover:underline">Add your first job</Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

