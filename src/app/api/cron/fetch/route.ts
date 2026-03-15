import { NextRequest, NextResponse } from 'next/server';
import { triggerScraping, triggerTelegramPost, triggerStatusUpdate, triggerArchive, triggerDuplicateCleanup } from '@/lib/automation';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for serverless

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const secret = process.env.CRON_SECRET;

        if (secret && key !== secret) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const startTime = Date.now();
        console.log('[Cron] ========== Execution started ==========');

        // 0. Test DB Connection
        let dbStatus = 'unknown';
        try {
            const { connectDB } = await import('@/lib/db');
            await connectDB();
            dbStatus = 'connected';
            console.log('[Cron] DB connected successfully');
        } catch (dbError: any) {
            console.error('[Cron] DB Connection Failed:', dbError);
            dbStatus = `failed: ${dbError.message}`;
        }

        // 1. Cleanup: Delete expired/old jobs first
        console.log('[Cron] Step 1: Cleaning up expired jobs...');
        const cleanupStats = await triggerArchive();
        console.log(`[Cron] Cleanup done: ${JSON.stringify(cleanupStats)}`);

        // 2. Remove duplicates
        console.log('[Cron] Step 2: Removing duplicates...');
        await triggerDuplicateCleanup();

        // 3. Update job statuses (mark old ones as not recent)
        console.log('[Cron] Step 3: Updating job statuses...');
        await triggerStatusUpdate();

        // 4. Scrape new jobs from all sources
        console.log('[Cron] Step 4: Scraping new jobs...');
        const scrapeStats = await triggerScraping();
        console.log(`[Cron] Scraping done: ${scrapeStats?.total || 0} new jobs added`);

        // 5. Post new jobs to Telegram
        console.log('[Cron] Step 5: Posting to Telegram...');
        const telegramStats = await triggerTelegramPost();
        console.log(`[Cron] Telegram: ${telegramStats} jobs posted`);

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[Cron] ========== Completed in ${duration}s ==========`);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            duration: `${duration}s`,
            message: 'All cron tasks completed successfully',
            dbStatus,
            stats: {
                cleanup: cleanupStats,
                scraped: scrapeStats,
                postedToTelegram: telegramStats
            }
        });
    } catch (error: any) {
        console.error('[Cron] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
