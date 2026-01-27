import { NextRequest, NextResponse } from 'next/server';
import {
    triggerTelegramPost,
    triggerDuplicateCleanup,
    triggerArchive,
    triggerStatusUpdate,
} from '@/lib/automation';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Authenticateadmin
        const token = request.cookies.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const task = searchParams.get('task');

        let message = '';

        switch (task) {
            case 'telegram':
                await triggerTelegramPost();
                message = 'Telegram sync completed';
                break;
            case 'cleanup':
                await triggerDuplicateCleanup();
                message = 'Duplicate cleanup completed';
                break;
            case 'archive':
                await triggerArchive();
                message = 'Expired jobs archived';
                break;
            case 'refresh':
                await triggerStatusUpdate();
                message = 'Job statuses updated';
                break;
            default:
                return NextResponse.json({ success: false, error: 'Invalid task' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('Automation task failed:', error);
        return NextResponse.json({ success: false, error: 'Task failed' }, { status: 500 });
    }
}
