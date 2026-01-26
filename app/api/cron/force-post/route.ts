import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import { postJobToSocial } from '@/lib/automation/social-poster';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Find last 5 jobs regardless of their posted status
        const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(5);

        if (jobs.length === 0) return NextResponse.json({ msg: 'No jobs in DB' });

        const results = [];
        for (const job of jobs) {
            console.log(`Manually pushing to Telegram: ${job.title}`);
            const res = await postJobToSocial(job._id.toString());
            results.push({
                title: job.title,
                telegram: res.telegram,
                whatsapp: res.whatsapp
            });
        }

        return NextResponse.json({
            success: true,
            message: `Force post for ${results.length} jobs triggered. Check Telegram now!`,
            results
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
