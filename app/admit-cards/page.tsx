
import { mockAdmitCards } from '@/lib/mock-data';
import Link from 'next/link';
import { Calendar, ChevronRight, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdmitCardsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 text-center">
                <div className="container-main">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        Download Admit Cards
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Get your hall tickets and exam schedules for upcoming recruitment exams.
                    </p>
                </div>
            </div>

            {/* List Content */}
            <div className="container-main py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mockAdmitCards.map((card: any) => (
                                <div key={card.id} className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-4 group">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="badge badge-red">Released</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={12} /> {card.date}
                                            </span>
                                        </div>
                                        <Link href={`/jobs/${card.slug}`} className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {card.title}
                                        </Link>
                                    </div>
                                    <Link
                                        href={`/jobs/${card.slug}`}
                                        className="shrink-0 btn-primary btn-sm rounded-full w-10 h-10 flex items-center justify-center md:w-auto md:h-auto md:px-4 md:py-2 md:rounded-lg"
                                        aria-label="Download Admit Card"
                                    >
                                        <Download size={18} className="md:mr-2" />
                                        <span className="hidden md:inline">Download</span>
                                    </Link>
                                </div>
                            ))}

                            {mockAdmitCards.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    No admit cards released recently.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination (Visual) */}
                    <div className="mt-8 flex justify-center gap-2">
                        <button className="btn-secondary btn-sm" disabled>Prev</button>
                        <button className="btn-primary btn-sm">1</button>
                        <button className="btn-secondary btn-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
