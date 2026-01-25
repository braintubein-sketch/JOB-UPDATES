import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    return NextResponse.json({
        success: true,
        message: 'API Route is WORKING!',
        test: 'No Database dependency'
    });
}
