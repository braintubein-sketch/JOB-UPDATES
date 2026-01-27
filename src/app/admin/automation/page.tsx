'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    Trash2,
    RefreshCw,
    Archive,
    ArrowLeft,
    Loader2,
    CheckCircle,
    AlertCircle,
    Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAutomationPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [results, setResults] = useState<{ type: string; message: string; success: boolean } | null>(null);

    const runTask = async (task: string) => {
        setLoading(task);
        setResults(null);

        try {
            // In a real app, these would call dedicated API endpoints
            // For now, we'll simulate the call
            const res = await fetch(`/api/admin/automation?task=${task}`, { method: 'POST' });
            const data = await res.json();

            setResults({
                type: task,
                message: data.message || 'Task completed successfully',
                success: data.success,
            });
        } catch (error) {
            setResults({
                type: task,
                message: 'An error occurred while running the task',
                success: false,
            });
        } finally {
            setLoading(null);
        }
    };

    const tasks = [
        {
            id: 'telegram',
            title: 'Sync Telegram',
            description: 'Post pending verified jobs to the Telegram channel.',
            icon: Send,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            id: 'cleanup',
            title: 'Cleanup Duplicates',
            description: 'Identify and deactivate duplicate job postings.',
            icon: Trash2,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
        },
        {
            id: 'archive',
            title: 'Archive Expired',
            description: 'Find jobs past their expiry date and deactivate them.',
            icon: Archive,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
        {
            id: 'refresh',
            title: 'Update Statuses',
            description: 'Update "New" tag and other time-sensitive statuses.',
            icon: Clock,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <Link href="/admin/dashboard" className="p-2 rounded-lg hover:bg-secondary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold">Automation Center</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Background Tasks</h2>
                    <p className="text-muted-foreground">Manage automated processes and manual sync triggers.</p>
                </div>

                {results && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${results.success
                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}
                    >
                        {results.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <div>
                            <p className="font-semibold capitalize">{results.type} Task</p>
                            <p className="text-sm opacity-90">{results.message}</p>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:border-primary/50 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl ${task.bgColor} flex items-center justify-center flex-shrink-0`}>
                                <task.icon className={`w-6 h-6 ${task.color}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
                                <button
                                    onClick={() => runTask(task.id)}
                                    disabled={loading !== null}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-secondary hover:bg-muted font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading === task.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                            Run Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-secondary/30 rounded-2xl border border-border italic text-center text-sm text-muted-foreground">
                    Note: These tasks also run automatically via scheduled cron jobs.
                </div>
            </main>
        </div>
    );
}
