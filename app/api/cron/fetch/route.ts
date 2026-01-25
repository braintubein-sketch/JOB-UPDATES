import { NextResponse } from 'next/server';
import { automateContentFetch } from '@/lib/automation/fetcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Optional: Check for Vercel Cron Secret
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (process.env.NODE_ENV === 'production' && key !== process.env.CRON_SECRET) {
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await automateContentFetch();
        return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
