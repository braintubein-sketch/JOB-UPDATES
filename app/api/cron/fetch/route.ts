import { NextResponse } from 'next/server';
import { automateContentFetch } from '@/lib/automation/fetcher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        // Check authorization
        // 1. CRON_SECRET key in query params
        // 2. Vercel Cron header
        const authHeader = request.headers.get('authorization');
        const isVercelCron = authHeader?.includes('vercel-cron');
        const isCronAuthorized = process.env.CRON_SECRET && key === process.env.CRON_SECRET;

        if (!isCronAuthorized && !isVercelCron) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Starting automation...');
        const result = await automateContentFetch();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            ...result
        });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
