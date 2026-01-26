import dbConnect from '../mongodb/dbConnect';
import { Job, ActivityLog } from '../../models/Job';

// Telegram Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// WhatsApp Configuration
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_CHANNEL_ID = process.env.WHATSAPP_CHANNEL_ID;

// ============================================
// MESSAGE FORMATTERS (Using HTML for reliability)
// ============================================

function formatTelegramMessage(job: any): string {
    const jobUrl = `https://jobupdate.site/jobs/${job.slug}`;
    const dateStr = job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check Notice';

    // HTML format is much cleaner and less likely to fail than Markdown
    return [
        `🚨 <b>NEW JOB ALERT</b> 🚨`,
        ``,
        `📝 <b>Organization:</b> ${job.organization}`,
        `📌 <b>Post:</b> ${job.title}`,
        `📊 <b>Vacancies:</b> ${job.vacancies || 'See Notice'}`,
        `🎓 <b>Qualification:</b> ${job.qualification || 'See Details'}`,
        job.experience ? `💼 <b>Experience:</b> ${job.experience}` : '',
        `📍 <b>Location:</b> ${job.location || 'India'}`,
        `📅 <b>Last Date:</b> ${dateStr}`,
        ``,
        `🔗 <b>Apply Online:</b>`,
        `${jobUrl}`,
        ``,
        `#${job.category?.toLowerCase() || 'job'} #governmentjobs #jobalert`,
    ].join('\n');
}

function formatWhatsAppMessage(job: any): string {
    const jobUrl = `https://jobupdate.site/jobs/${job.slug}`;
    return [
        `📢 *NEW JOB ALERT*`,
        ``,
        `*Organization:* ${job.organization}`,
        `*Post:* ${job.title}`,
        `*Qualification:* ${job.qualification}`,
        `*Location:* ${job.location || 'India'}`,
        ``,
        `🔗 *Details & Apply:*`,
        `${jobUrl}`,
    ].join('\n');
}

// ============================================
// SENDING LOGIC
// ============================================

async function sendToWhatsApp(job: any): Promise<{ success: boolean, error?: string }> {
    // These keys allow you to use services like UltraMsg to bypass Meta verification
    const GATEWAY_URL = process.env.WHATSAPP_GATEWAY_URL;
    const TOKEN = process.env.WHATSAPP_TOKEN;
    const CHANNEL_ID = process.env.WHATSAPP_CHANNEL_ID;

    if (!GATEWAY_URL || !TOKEN || !CHANNEL_ID)
        return { success: false, error: 'WhatsApp Gateway not configured' };

    try {
        const message = formatWhatsAppMessage(job);

        // This logic works with 90% of WhatsApp API Gateways
        const response = await fetch(GATEWAY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: TOKEN,
                to: CHANNEL_ID,
                body: message
            }),
        });

        const result = await response.json();
        // Return success if the gateway accepts the request
        if (result.sent || result.success || result.ok) return { success: true };
        return { success: false, error: result.message || 'API Error' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function sendToTelegram(job: any): Promise<{ success: boolean, error?: string }> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) return { success: false, error: 'Missing Config' };

    try {
        const message = formatTelegramMessage(job);
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHANNEL_ID,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: false,
                }),
            }
        );

        const result = await response.json();
        if (result.ok) return { success: true };
        return { success: false, error: result.description };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function autoPostNewJobs(): Promise<number> {
    await dbConnect();
    // Increase limit to clear backlog faster
    const unpostedJobs = await Job.find({
        status: 'PUBLISHED',
        $or: [
            { telegramPosted: { $ne: true } },
            { whatsappPosted: { $ne: true } }
        ]
    }).limit(10).sort({ createdAt: -1 });

    if (unpostedJobs.length === 0) return 0;

    console.log(`🚀 Found ${unpostedJobs.length} jobs to process for social media...`);

    let postedCount = 0;
    for (const job of unpostedJobs) {
        let tgRes = { success: job.telegramPosted || false };
        let waRes = { success: job.whatsappPosted || false };

        if (!job.telegramPosted) {
            tgRes = await sendToTelegram(job);
            if (tgRes.success) console.log(`✅ Posted TG: ${job.title}`);
        }

        if (!job.whatsappPosted) {
            waRes = await sendToWhatsApp(job);
            if (waRes.success) console.log(`✅ Posted WA: ${job.title}`);
        }

        if (tgRes.success || waRes.success) {
            await Job.updateOne({ _id: job._id }, {
                telegramPosted: tgRes.success,
                whatsappPosted: waRes.success,
                publishedAt: new Date()
            });
            postedCount++;
        }

        await new Promise(r => setTimeout(r, 2000)); // Rate limit safety
    }
    return postedCount;
}

export async function postJobToSocial(jobId: string): Promise<{ telegram: boolean; whatsapp: boolean; error?: string }> {
    await dbConnect();
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const tgRes = await sendToTelegram(job);
    const waRes = await sendToWhatsApp(job);

    await Job.updateOne({ _id: jobId }, {
        telegramPosted: tgRes.success,
        whatsappPosted: waRes.success
    });

    return {
        telegram: tgRes.success,
        whatsapp: waRes.success,
        error: tgRes.error || waRes.error
    };
}
