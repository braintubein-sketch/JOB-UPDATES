import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Find jobs where organization is 'Times of India' or 'Hindustan Times'
        const jobsToFix = await Job.find({
            organization: { $in: ['Times of India Jobs', 'Hindustan Times', 'Zee News Employment', 'Indian Express Jobs'] }
        });

        let count = 0;
        for (const job of jobsToFix) {
            let realOrg = job.title.split(' ')[0];
            if (job.title.includes('Railway')) realOrg = 'Indian Railways';
            else if (job.title.includes('Bank')) realOrg = 'Banking Sector';

            if (realOrg.length < 3) realOrg = 'Govt Recruitment';

            await Job.updateOne({ _id: job._id }, { organization: realOrg });
            count++;
        }

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${count} jobs.`,
            status: 'Success'
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
