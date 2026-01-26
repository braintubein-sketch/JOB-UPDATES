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

        // Fetch last 1 job to test
        const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(1);

        if (jobs.length === 0) return NextResponse.json({ msg: 'No jobs' });

        const job = jobs[0];
        console.log(`Force posting: ${job.title}`);

        // This function uses the Env Vars and the Beautiful Format
        const result = await postJobToSocial(job._id.toString());

        return NextResponse.json({
            success: true,
            title: job.title,
            telegram_status: result.telegram,
            whatsapp_status: result.whatsapp
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
