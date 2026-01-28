import { NextRequest, NextResponse } from 'next/server';
import { triggerScraping, triggerTelegramPost, triggerStatusUpdate, triggerArchive } from '@/lib/automation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        // We can use a secret to protect this endpoint if needed
        // For now, let's just make it work as requested by the user

        console.log('[Cron] Execution started...');

        // 1. Scrape new jobs
        console.log('[Cron] Scraping jobs...');
        await triggerScraping();

        // 2. Post to Telegram
        console.log('[Cron] Posting to Telegram...');
        await triggerTelegramPost();

        // 3. Maintenance tasks
        console.log('[Cron] Running maintenance...');
        await triggerStatusUpdate();
        await triggerArchive();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Cron tasks completed successfully'
        });
    } catch (error: any) {
        console.error('[Cron] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
