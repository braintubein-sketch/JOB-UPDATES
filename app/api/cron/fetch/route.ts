import { NextResponse } from 'next/server';
import { automateContentFetch } from '@/lib/automation/fetcher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Secure the endpoint in production
    if (process.env.NODE_ENV === 'production' && key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await automateContentFetch();
        return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
