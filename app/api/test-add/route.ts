import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();

        // NO AUTH CHECK FOR DIAGNOSTIC PURPOSES
        const sampleJob = {
            title: 'Diagnostic Test Job - ' + new Date().toISOString(),
            slug: 'diagnostic-' + Date.now(),
            organization: 'Testing Dept',
            category: 'Govt',
            status: 'PUBLISHED',
            description: 'This is a test job to verify database connectivity.',
        };

        const newJob = await Job.create(sampleJob);

        return NextResponse.json({
            success: true,
            message: 'DB connectivity verified!',
            jobId: newJob._id.toString()
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
