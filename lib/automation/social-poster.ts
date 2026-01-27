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

    if (job.category === 'Result') {
        return [
            `🚨 <b>RESULT OUT</b> 🚨`,
            ``,
            `📝 <b>Organization:</b> ${job.organization}`,
            `📌 <b>Exam Result:</b> ${job.postName || job.title}`,
            `✅ <b>Status:</b> DECLARED / RELEASED`,
            `📅 <b>Announced On:</b> ${dateStr}`,
            ``,
            `🔗 <b>Check Result / Download List:</b>`,
            `${jobUrl}`,
            ``,
            `#result #career #examresult #governmentjobs #jobupdates`,
        ].join('\n');
    }

    if (job.category === 'Admit Card') {
        return [
            `🛂 <b>ADMIT CARD RELEASED</b> 🛂`,
            ``,
            `📝 <b>Organization:</b> ${job.organization}`,
            `📌 <b>Exam Name:</b> ${job.postName || job.title}`,
            `✅ <b>Status:</b> Available for Download`,
            `📅 <b>Exam Date:</b> ${job.examDate ? new Date(job.examDate).toLocaleDateString('en-GB') : 'See Details'}`,
            ``,
            `🔗 <b>Download Link / Full Notice:</b>`,
            `${jobUrl}`,
            ``,
            `#admitcard #hallticket #examupdate #governmentjobs`,
        ].join('\n');
    }

    // IT Jobs Telegram Format
    if (job.category === 'IT') {
        return [
            `💻 <b>IT JOB (MNC)</b>`,
            `🏢 <b>Company:</b> ${job.organization}`,
            `👨‍💻 <b>Role:</b> ${job.postName || job.title}`,
            `💰 <b>Salary:</b> ${job.salary || 'Best in Industry'}`,
            `💼 <b>Exp:</b> ${job.experience || 'Freshers'}`,
            `📍 <b>Location:</b> ${job.location || 'India'}`,
            ``,
            `🔗 <b>Apply:</b> ${jobUrl}`,
            ``,
            `#ITJobs #Software #Hiring #MNC #TCS #Infosys`,
        ].join('\n');
    }

    // Default Govt Job Telegram Format
    return [
        `🚨 <b>NEW JOB ALERT</b>`,
        `🏢 <b>Org:</b> ${job.organization}`,
        `📌 <b>Post:</b> ${job.postName || job.title}`,
        `🎓 <b>Qual:</b> ${job.qualification || 'Details in link'}`,
        `💼 <b>Exp:</b> ${job.experience || 'Freshers'}`,
        `💰 <b>Salary:</b> ${job.salary || 'As per norms'}`,
        `📅 <b>Last Date:</b> ${dateStr}`,
        ``,
        `🔗 <b>Details & Apply:</b> ${jobUrl}`,
        ``,
        `#jobalert #govtjobs #hiring #jobupdate`,
    ].join('\n');
}

function formatWhatsAppMessage(job: any): string {
    const jobUrl = `https://jobupdate.site/jobs/${job.slug}`;

    if (job.category === 'Result') {
        return [
            `📢 *RESULT OUT*`,
            `📝 *Org:* ${job.organization}`,
            `📌 *Exam:* ${job.postName || job.title}`,
            `✅ *Status:* DECLARED`,
            ``,
            `🔗 *Check Now:* ${jobUrl}`,
        ].join('\n');
    }

    return [
        `📢 *JOB ALERT*`,
        `*Org:* ${job.organization}`,
        `*Post:* ${job.postName || job.title}`,
        `*Salary:* ${job.salary || 'As per norms'}`,
        ``,
        `🔗 *Apply:* ${jobUrl}`,
    ].join('\n');
}

// ============================================
// SENDING LOGIC
// ============================================

async function sendToWhatsApp(job: any): Promise<{ success: boolean, error?: string }> {
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const CHANNEL_ID = process.env.WHATSAPP_CHANNEL_ID;

    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID || !CHANNEL_ID)
        return { success: false, error: 'Official Meta WhatsApp API not configured' };

    try {
        const message = formatWhatsAppMessage(job);

        // Official Meta Cloud API Endpoint
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: CHANNEL_ID,
                type: 'text',
                text: { body: message }
            }),
        });

        const result = await response.json();
        // Standard Meta success check
        if (result.messages && result.messages[0]?.id) return { success: true };
        return { success: false, error: result.error?.message || 'Meta API Error' };
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
