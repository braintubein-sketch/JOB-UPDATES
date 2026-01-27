import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import { Result, AdmitCard, AutomationLog } from '@/models/Automation';

/**
 * GET /api/stats - Get automation statistics
 */

export async function GET() {
    try {
        await dbConnect();

        const [
            totalJobs,
            totalResults,
            totalAdmitCards,
            jobsByCategory,
            recentLogs,
            todayStats
        ] = await Promise.all([
            Job.countDocuments({ status: 'PUBLISHED' }),
            Result.countDocuments({ status: 'PUBLISHED' }),
            AdmitCard.countDocuments({ status: 'PUBLISHED' }),
            Job.aggregate([
                { $match: { status: 'PUBLISHED' } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            AutomationLog.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('runType status stats createdAt duration'),
            // Today's additions
            Job.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            })
        ]);

        // Calculate posting stats
        const [unpostedJobs, unpostedResults, unpostedAdmitCards] = await Promise.all([
            Job.countDocuments({ status: 'PUBLISHED', telegramPosted: { $ne: true } }),
            Result.countDocuments({ status: 'PUBLISHED', telegramPosted: { $ne: true } }),
            AdmitCard.countDocuments({ status: 'PUBLISHED', telegramPosted: { $ne: true } })
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                total: {
                    jobs: totalJobs,
                    results: totalResults,
                    admitCards: totalAdmitCards
                },
                categories: jobsByCategory.reduce((acc: any, item: any) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                pending: {
                    unpostedJobs,
                    unpostedResults,
                    unpostedAdmitCards
                },
                today: {
                    jobsAdded: todayStats
                }
            },
            recentLogs: recentLogs.map((log: any) => ({
                type: log.runType,
                status: log.status,
                stats: log.stats,
                duration: log.duration ? `${(log.duration / 1000).toFixed(1)}s` : null,
                timestamp: log.createdAt
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
