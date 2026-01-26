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

        // Fetch the 3 most recent published jobs
        const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(3);

        if (jobs.length === 0) return NextResponse.json({ msg: 'No jobs found in database' });

        const results = [];
        for (const job of jobs) {
            // Trigger the REAL production poster with beautiful formatting
            const result = await postJobToSocial(job._id.toString());
            results.push({
                title: job.title,
                telegram: result.telegram
            });
        }

        return NextResponse.json({
            success: true,
            message: "Production format sent to Telegram",
            results
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
