import { NextResponse } from 'next/server';
import { automateContentFetch } from '@/lib/automation/fetcher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60 seconds for execution

export async function GET(request: Request) {
    try {
        console.log('Triggering automation...');
        await automateContentFetch();
        return NextResponse.json({ success: true, message: 'Automation triggered successfully', timestamp: new Date().toISOString() });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error occurred',
            details: error.toString()
        }, { status: 500 });
    }
}
