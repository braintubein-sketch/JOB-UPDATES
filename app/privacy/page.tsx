import { Lock, ShieldCheck, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
                <div className="container-main text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Privacy <span className="text-blue-600">Policy</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
                        Your trust is our priority. Learn how we handle your data with transparency.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container-main py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="card md:p-12 mb-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-blue-600" size={24} />
                                Data Collection & Usage
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                At JobUpdates, we respect your privacy. This policy outlines how we collect and protect your information when you visit our portal.
                            </p>

                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                        <UserCheck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">User Registration</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            When you register, we collect basic details like name and email to provide personalized job alerts. We never sell this data to third-party advertisers.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Security Measures</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            We use industry-standard encryption to protect your account. Your passwords are never stored in plain text and are protected using robust hashing algorithms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-12 border-slate-100 dark:border-slate-800" />

                            <h2 className="text-2xl font-bold mb-4">Cookies & Analytics</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                We use essential cookies to keep you logged in and improve your experience. Anonymous analytics help us understand which job categories are most popular so we can focus our scraping efforts effectively.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">Contacting Us</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at <span className="font-bold text-blue-600">privacy@jobupdate.site</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
