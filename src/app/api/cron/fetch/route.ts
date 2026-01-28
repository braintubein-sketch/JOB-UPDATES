import { NextRequest, NextResponse } from 'next/server';
import { triggerScraping, triggerTelegramPost, triggerStatusUpdate, triggerArchive } from '@/lib/automation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const secret = process.env.CRON_SECRET;

        if (secret && key !== secret) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[Cron] Execution started...');

        // 0. Test DB Connection
        let dbStatus = 'unknown';
        try {
            const { connectDB } = await import('@/lib/db');
            await connectDB();
            dbStatus = 'connected';
        } catch (dbError: any) {
            console.error('[Cron] DB Connection Failed:', dbError);
            dbStatus = `failed: ${dbError.message}`;
        }

        // 1. Scrape new jobs
        console.log('[Cron] Scraping jobs...');
        const scrapeStats = await triggerScraping();

        // 2. Post to Telegram
        console.log('[Cron] Posting to Telegram...');
        const telegramStats = await triggerTelegramPost();

        // 3. Maintenance tasks
        console.log('[Cron] Running maintenance...');
        await triggerStatusUpdate();
        await triggerArchive();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Cron tasks completed successfully',
            dbStatus,
            stats: {
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
