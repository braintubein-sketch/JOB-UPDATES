import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Detect if it's a message from your channel
        const message = body.channel_post?.text;
        if (!message) return NextResponse.json({ ok: true });

        console.log("Bridge received Telegram message: ", message);

        // 2. Prepare Official Meta API call
        const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
        const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const RECIPIENT_ID = process.env.WHATSAPP_CHANNEL_ID;

        if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
            console.error("Meta API not configured for bridge");
            return NextResponse.json({ error: "Missing Config" }, { status: 500 });
        }

        // 3. Send to WhatsApp via Official Cloud API
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: RECIPIENT_ID,
                type: 'text',
                text: { body: message } // Note: Official API may require Template instead of plain text
            }),
        });

        const result = await response.json();
        return NextResponse.json({ success: true, meta_response: result });

    } catch (error: any) {
        console.error("Bridge Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
