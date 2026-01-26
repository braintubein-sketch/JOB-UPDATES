import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const GATEWAY_URL = process.env.WHATSAPP_GATEWAY_URL;
    const TOKEN = process.env.WHATSAPP_TOKEN;

    if (!GATEWAY_URL || !TOKEN) {
        return NextResponse.json({ success: false, error: 'Gateway URL or Token missing in Render environment variables.' });
    }

    try {
        // Extract base URL from messages/chat endpoint
        const baseUrl = GATEWAY_URL.split('/messages/')[0];
        const res = await fetch(`${baseUrl}/chats?token=${TOKEN}`);
        const data = await res.json();

        if (Array.isArray(data)) {
            const formatted = data.map((c: any) => ({
                id: c.id,
                name: c.name
            }));
            return NextResponse.json({ success: true, chats: formatted });
        }

        return NextResponse.json({ success: false, error: 'Could not fetch chat list. check your Instance status.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
