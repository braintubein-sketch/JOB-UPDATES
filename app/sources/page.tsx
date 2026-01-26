import { ExternalLink, Search, ShieldCheck } from 'lucide-react';

export default function SourcesPage() {
    const sources = [
        { name: 'SSC', url: 'https://ssc.nic.in', label: 'Staff Selection Commission' },
        { name: 'UPSC', url: 'https://upsc.gov.in', label: 'Union Public Service Commission' },
        { name: 'Railway Recruitments', url: 'https://indianrailways.gov.in', label: 'RRB & RRC' },
        { name: 'Banking', url: 'https://ibps.in', label: 'IBPS & RBI' },
        { name: 'Defense', url: 'https://joinindianarmy.nic.in', label: 'Army, Navy, Airforce' },
        { name: 'State PSCs', url: '#', label: 'All State Service Commissions' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
                <div className="container-main text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Official <span className="text-blue-600">Sources</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
                        Complete transparency. See where we fetch our recruitment alerts from.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container-main py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="card mb-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Verification Policy</h2>
                                <p className="text-sm text-slate-500">We never use private blogs or unverified social media as primary sources.</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {sources.map((source) => (
                                <a
                                    key={source.name}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">{source.name}</div>
                                        <div className="text-xs text-slate-500">{source.label}</div>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                        <Search className="mx-auto text-blue-600 mb-4" size={32} />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Notice a missing source?</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">If you are an official department HR or would like us to track a specific portal, please let us know.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
