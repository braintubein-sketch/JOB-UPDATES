import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Simple auth check
    if (key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Add a sample job directly
        const sampleJob = {
            title: 'UPSC Civil Services 2026 - Official Notification',
            slug: 'upsc-civil-services-2026-' + Date.now(),
            organization: 'Union Public Service Commission',
            category: 'Govt',
            qualification: 'Any Graduate Degree',
            salary: 'Rs. 56,100 - 2,50,000 per month',
            vacancies: '1000+ Posts',
            location: 'All India',
            lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            applyLink: 'https://upsc.gov.in',
            source: 'https://upsc.gov.in',
            status: 'PUBLISHED',
            description: 'The Union Public Service Commission has released the official notification for Civil Services Examination 2026. This examination is conducted for recruitment to various Group A and Group B services.',
        };

        const newJob = await Job.create(sampleJob);

        const totalJobs = await Job.countDocuments({ status: 'PUBLISHED' });

        return NextResponse.json({
            success: true,
            message: 'Sample job added successfully!',
            jobId: newJob._id.toString(),
            totalPublishedJobs: totalJobs,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
