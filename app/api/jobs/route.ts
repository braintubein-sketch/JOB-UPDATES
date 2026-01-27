import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import { Result, AdmitCard } from '@/models/Automation';

/**
 * GET /api/jobs - Fetch all jobs with filtering
 * 
 * Query params:
 * - category: Filter by category (IT, Govt, Banking, Railway, Police, PSU, Teaching, Private)
 * - status: Filter by status (PUBLISHED, DRAFT, EXPIRED)
 * - limit: Number of results (default: 20, max: 100)
 * - page: Page number for pagination
 * - search: Search in title and organization
 */

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status') || 'PUBLISHED';
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search');

        // Build query
        const query: any = { status };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { organization: { $regex: search, $options: 'i' } },
                { postName: { $regex: search, $options: 'i' } }
            ];
        }

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
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
