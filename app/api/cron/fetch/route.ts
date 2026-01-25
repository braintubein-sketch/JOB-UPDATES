import { NextResponse } from 'next/server';
import { fetchUpdates } from '@/lib/fetcher';

export async function GET(request: Request) {
    // Simple auth check for cron (use CRON_SECRET in production)
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await fetchUpdates();
        return NextResponse.json({ success: true, message: 'Fetch completed' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
