import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(20).select('title slug').lean();
        return NextResponse.json({
            count: jobs.length,
            jobs: jobs.map(j => ({
                title: j.title,
                slug: j.slug,
                url: `https://jobupdate.site/jobs/${j.slug}`
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
