'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Globe,
    Bell,
    Save,
    Loader2,
    CheckCircle,
} from 'lucide-react';

export default function AdminSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    const [siteSettings, setSiteSettings] = useState({
        siteName: 'JOB UPDATES',
        contactEmail: 'contact@JOB UPDATES.com',
        maintenanceMode: false,
        enableTelegramAutoPost: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.success) {
                    setProfile({
                        name: data.data.name,
                        email: data.data.email,
                    });
                }
            } catch (err) {
                console.error('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <Link href="/admin/dashboard" className="p-2 rounded-lg hover:bg-secondary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold">Settings</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSave} className="space-y-8">
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Settings updated successfully!
                        </motion.div>
                    )}

                    {/* Profile Settings */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Admin Profile
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="input-premium pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="input-premium pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="button" className="mt-6 text-primary text-sm font-medium hover:underline flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Change Password
                        </button>
                    </div>

                    {/* Site Settings */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Site Configuration
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Site Name</label>
                                <input
                                    type="text"
                                    value={siteSettings.siteName}
                                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                                    className="input-premium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Contact Email (for users)</label>
                                <input
                                    type="email"
                                    value={siteSettings.contactEmail}
                                    onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                                    className="input-premium"
                                />
                            </div>

                            <div className="flex items-center justify-between py-4 border-t border-border">
                                <div>
                                    <div className="font-medium">Maintenance Mode</div>
                                    <div className="text-sm text-muted-foreground">Disable the portal for maintenance</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={siteSettings.maintenanceMode}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-4 border-t border-border">
                                <div>
                                    <div className="font-medium">Telegram Auto-Posting</div>
                                    <div className="text-sm text-muted-foreground">Automatically post verified jobs to Telegram</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={siteSettings.enableTelegramAutoPost}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, enableTelegramAutoPost: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary py-3 px-8 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save All Settings
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

