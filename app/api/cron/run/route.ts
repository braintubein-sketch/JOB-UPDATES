import { NextResponse } from 'next/server';
import { runJobFetchCycle } from '@/lib/automation/engine';
import { runTelegramPostCycle } from '@/lib/automation/telegram';

/**
 * CRON ENDPOINT: Runs the full automation cycle
 * 
 * Called every 1-2 hours by external cron service (Render, cron-job.org, etc.)
 * 
 * Query params:
 * - type: 'hourly' | '2hours' | '6hours' | 'all' (default: 'all')
 * - postOnly: 'true' to only run Telegram posting (skip fetching)
 * - secret: Authorization token (must match CRON_SECRET env var)
 */

export async function GET(request: Request) {
    // Security: Verify cron secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && secret !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const type = searchParams.get('type') || 'all';
    const postOnly = searchParams.get('postOnly') === 'true';

    try {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`🤖 AUTOMATION CRON TRIGGERED - ${new Date().toISOString()}`);
        console.log(`📋 Type: ${type}, PostOnly: ${postOnly}`);
        console.log(`${'='.repeat(70)}\n`);

        let fetchResult = null;
        let postResult = null;

        // Step 1: Fetch new content (unless postOnly)
        if (!postOnly) {
            if (type === 'all') {
                fetchResult = await runJobFetchCycle();
            } else if (type === 'hourly' || type === '2hours' || type === '6hours') {
                fetchResult = await runJobFetchCycle(type);
            }
        }

        // Step 2: Post to Telegram
        postResult = await runTelegramPostCycle();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            fetch: fetchResult ? {
                added: fetchResult.stats.added,
                duplicates: fetchResult.stats.duplicates,
                skipped: fetchResult.stats.skipped,
                errors: fetchResult.stats.errors,
                duration: `${(fetchResult.duration / 1000).toFixed(1)}s`
            } : null,
            telegram: {
                jobsPosted: postResult.jobsPosted,
                resultsPosted: postResult.resultsPosted,
                admitCardsPosted: postResult.admitCardsPosted,
                errors: postResult.errors,
                duration: `${(postResult.duration / 1000).toFixed(1)}s`
            }
        });

    } catch (error: any) {
        console.error('❌ CRON CYCLE FAILED:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
    return GET(request);
}
