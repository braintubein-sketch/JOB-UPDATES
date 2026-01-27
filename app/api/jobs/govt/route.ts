import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

/**
 * GET /api/jobs/govt - Fetch Government jobs
 */

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = parseInt(searchParams.get('page') || '1');

        const query = {
            status: 'PUBLISHED',
            category: { $in: ['Govt', 'PSU', 'Railway', 'Teaching', 'Police', 'Defence', 'Banking'] }
        };

        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            Job.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: jobs,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
