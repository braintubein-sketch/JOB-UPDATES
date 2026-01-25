import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        msg: 'If you see this WITHOUT /api/, then the /api/ prefix is being intercepted by something else.'
    });
}
