import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { AdmitCard } from '@/models/Automation';

/**
 * GET /api/admit-cards - Fetch admit cards
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

        const [admitCards, total] = await Promise.all([
            AdmitCard.find(query)
                .sort({ examDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            AdmitCard.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: admitCards,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
