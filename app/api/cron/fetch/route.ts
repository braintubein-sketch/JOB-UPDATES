import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { automateContentFetch } from '@/lib/automation/fetcher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const session = await getServerSession(authOptions);

    // Allow execution if:
    // 1. Correct CRON_SECRET is provided (for Cron-Job.org)
    // 2. User is logged in as Admin (for Dashboard button)
    const isCronAuthorized = process.env.CRON_SECRET && key === process.env.CRON_SECRET;
    const isAdminAuthorized = session?.user;

    const authHeader = request.headers.get('authorization');
    const isVercelCronAuthorized = authHeader?.startsWith('Bearer ') && authHeader.includes('vercel-cron');

    // Secure the endpoint in production
    // We allow if:
    // 1. Key matches CRON_SECRET (External triggers like Cron-Job.org)
    // 2. Admin is logged in (Manual button from dashboard)
    // 3. Authorization header contains 'Bearer vercel-cron' (for Vercel's native cron jobs)
    if (!isCronAuthorized && !isAdminAuthorized && !isVercelCronAuthorized) {
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
