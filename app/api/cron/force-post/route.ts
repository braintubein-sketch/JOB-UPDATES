import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job, ActivityLog } from '@/models/Job';
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

        // Fetch last 3 jobs
        const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(3);

        const results = [];

        for (const job of jobs) {
            console.log(`Force posting: ${job.title}`);
            const result = await postJobToSocial(job._id.toString());
            results.push({ title: job.title, result });
        }

        return NextResponse.json({
            success: true,
            message: 'Force post attempted',
            results
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
