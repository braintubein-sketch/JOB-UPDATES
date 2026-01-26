import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import { postJobToSocial } from '@/lib/automation/social-poster';

// DEBUGER:
async function debugSendTelegram(job: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channel = process.env.TELEGRAM_CHANNEL_ID;
    const text = "debug test";

    console.log(`Debug attempting to send to ${channel} with token ${token?.substring(0, 10)}...`);

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: channel,
                text: `DEBUG TEST FOR ${job.title}`,
            })
        });
        const data = await res.json();
        return { success: data.ok, response: data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(1);
        if (jobs.length === 0) return NextResponse.json({ msg: 'No jobs' });

        // TRY DEBUG SEND
        const debugResult = await debugSendTelegram(jobs[0]);

        return NextResponse.json({
            success: debugResult.success,
            env_check: {
                has_token: !!process.env.TELEGRAM_BOT_TOKEN,
                channel_val: process.env.TELEGRAM_CHANNEL_ID
            },
            telegram_response: debugResult.response || debugResult.error
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
