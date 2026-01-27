import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Result } from '@/models/Automation';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function getResults() {
    try {
        await dbConnect();
        const results = await Result.find({ status: 'PUBLISHED' })
            .sort({ releaseDate: -1, createdAt: -1 })
            .limit(50)
            .lean();
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error('Error fetching results:', error);
        return [];
    }
}

export default async function ResultsPage() {
    const results = await getResults();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 text-center">
                <div className="container-main">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        Latest Exam Results
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Check your scores, merit lists, and selection status for recent exams.
                    </p>
                </div>
            </div>

            {/* List Content */}
            <div className="container-main py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {results.map((result: any) => (
                                <div key={result._id} className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-4 group">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="badge badge-orange">Declared</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={12} /> {formatDate(result.releaseDate || result.createdAt)}
                                            </span>
                                        </div>
                                        <Link href={`/jobs/${result.slug}`} className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {result.title}
                                        </Link>
                                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                                            {result.organization}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/jobs/${result.slug}`}
                                        className="shrink-0 btn-secondary btn-sm rounded-full w-10 h-10 flex items-center justify-center md:w-auto md:h-auto md:px-4 md:py-2 md:rounded-lg"
                                        aria-label="View Result"
                                    >
                                        <ChevronRight size={20} className="md:hidden" />
                                        <span className="hidden md:inline">View Result</span>
                                    </Link>
                                </div>
                            ))}

                            {results.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    No results available at the moment.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination (Visual) */}
                    {results.length > 0 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <button className="btn-secondary btn-sm" disabled>Prev</button>
                            <button className="btn-primary btn-sm">1</button>
                            <button className="btn-secondary btn-sm">Next</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
