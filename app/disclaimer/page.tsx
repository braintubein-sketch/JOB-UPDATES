import { AlertTriangle, FileText, Info } from 'lucide-react';

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
                <div className="container-main text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Standard <span className="text-blue-600">Disclaimer</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
                        Please read our professional terms and advisory regarding the job listings.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container-main py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="card md:p-12 mb-8 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                        <div className="flex gap-4 mb-6">
                            <AlertTriangle className="text-amber-600 shrink-0" size={32} />
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Important Advisory</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Users are requested to verify notification details on official portals.</p>
                            </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none text-sm space-y-6 text-slate-700 dark:text-slate-300">
                            <p>
                                JobUpdates is an independent job discovery platform. While we strive to provide 100% accurate and up-to-date information, we are not responsible for any inaccuracies or discrepancies in the job listings.
                            </p>

                            <div className="flex gap-4">
                                <Info className="text-blue-600 shrink-0" size={18} />
                                <p><strong>Official Source Guarantee:</strong> We always provide the source link for every job. We strongly advise you to check the official notification PDF before applying or paying any application fees.</p>
                            </div>

                            <p>
                                Under no circumstances will JobUpdates or its team be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
                            </p>

                            <div className="flex gap-4">
                                <FileText className="text-blue-600 shrink-0" size={18} />
                                <p><strong>No Guarantee of Selection:</strong> Information on this site does not guarantee job selection or interview calls. We merely curate information from public domains.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
