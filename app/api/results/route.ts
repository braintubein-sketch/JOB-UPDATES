import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Result } from '@/models/Automation';

/**
 * GET /api/results - Fetch exam results
 */

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search');

        const query: any = { status: 'PUBLISHED' };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { examName: { $regex: search, $options: 'i' } },
                { organization: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [results, total] = await Promise.all([
            Result.find(query)
                .sort({ releaseDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            Result.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: results,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
