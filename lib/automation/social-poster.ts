import dbConnect from '../mongodb/dbConnect';
import { Job, ActivityLog } from '../../models/Job';

// Telegram Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// WhatsApp Configuration (Meta Business API)
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_CHANNEL_ID = process.env.WHATSAPP_CHANNEL_ID;

// ============================================
// MESSAGE FORMATTERS
// ============================================

function formatTelegramMessage(job: any): string {
    const jobUrl = `https://jobupdate.site/jobs/${job.slug}`;
    // Simple date format: 15 Feb 2026
    const dateStr = job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check Notice';

    // We use .join('\n') so empty lines in array become blank lines in message
    const lines = [
        `🚨 NEW JOB ALERT 🚨`,
        ``,
        `📝 Organization: ${escapeMarkdown(job.organization)}`,
        `📌 Post: ${escapeMarkdown(job.title)}`,
        `📊 Vacancies: ${escapeMarkdown(job.vacancies || 'See Notice')}`,
        `🎓 Qualification: ${escapeMarkdown(job.qualification || 'See Details')}`,
        `📅 Last Date: ${escapeMarkdown(dateStr)}`,
        ``,
        `🔗 Apply Online:`,
        `${jobUrl}`,
        ``,
        `#${job.category?.toLowerCase() || 'job'} #governmentjobs #jobalert`,
    ].filter(line => line !== null); // Keep empty strings for spacing

    return lines.join('\n');
}

function formatWhatsAppMessage(job: any): string {
    const lines = [
        `📢 *${job.title}*`,
        ``,
        `🏢 Organization: ${job.organization}`,
        job.qualification ? `📚 Qualification: ${job.qualification}` : '',
        job.salary ? `💰 Salary: ${job.salary}` : '',
        job.vacancies ? `👥 Vacancies: ${job.vacancies}` : '',
        job.location ? `📍 Location: ${job.location || 'All India'}` : '',
        job.lastDate ? `📅 Last Date: ${new Date(job.lastDate).toLocaleDateString('en-IN')}` : '',
        ``,
        `━━━━━━━━━━━━━━━━━━`,
        ``,
        job.applyLink ? `🔗 Apply: ${job.applyLink}` : '',
        ``,
        `📱 More Jobs: jobupdate.site`,
    ].filter(line => line !== '');

    return lines.join('\n');
}

function escapeMarkdown(text: string): string {
    if (!text) return '';
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

// ============================================
// TELEGRAM POSTING
// ============================================

async function sendToTelegram(job: any): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
        console.log('⚠️ Telegram not configured');
        return false;
    }

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
                    parse_mode: 'MarkdownV2',
                    disable_web_page_preview: false,
                }),
            }
        );

        const result = await response.json();
        if (result.ok) {
            console.log(`✅ Telegram: ${job.title.substring(0, 40)}...`);
            return true;
        } else {
            console.error('❌ Telegram error:', result.description);
            return false;
        }
    } catch (error) {
        console.error('❌ Telegram failed:', error);
        return false;
    }
}

// ============================================
// WHATSAPP CHANNEL POSTING
// ============================================

async function sendToWhatsAppChannel(job: any): Promise<boolean> {
    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_CHANNEL_ID) {
        console.log('⚠️ WhatsApp not configured');
        return false;
    }

    try {
        const message = formatWhatsAppMessage(job);

        // WhatsApp Channels API (Newsletter API)
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${WHATSAPP_CHANNEL_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    type: 'text',
                    text: { body: message }
                }),
            }
        );

        const result = await response.json();
        if (!result.error) {
            console.log(`✅ WhatsApp: ${job.title.substring(0, 40)}...`);
            return true;
        } else {
            console.error('❌ WhatsApp error:', result.error?.message);
            return false;
        }
    } catch (error) {
        console.error('❌ WhatsApp failed:', error);
        return false;
    }
}

// ============================================
// MAIN AUTO-POST FUNCTION
// ============================================

export async function autoPostNewJobs(): Promise<number> {
    await dbConnect();

    // Find published jobs not yet posted to social media
    const unpostedJobs = await Job.find({
        status: 'PUBLISHED',
        $or: [
            { telegramPosted: { $ne: true } },
            { whatsappPosted: { $ne: true } }
        ]
    }).limit(10).sort({ createdAt: -1 });

    console.log(`📤 Found ${unpostedJobs.length} jobs to post...`);

    let postedCount = 0;

    for (const job of unpostedJobs) {
        let telegramSuccess = job.telegramPosted || false;
        let whatsappSuccess = job.whatsappPosted || false;

        // Post to Telegram if not already posted
        if (!job.telegramPosted) {
            telegramSuccess = await sendToTelegram(job);
            if (telegramSuccess) postedCount++;
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Post to WhatsApp if not already posted
        if (!job.whatsappPosted) {
            whatsappSuccess = await sendToWhatsAppChannel(job);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Update job status
        await Job.updateOne(
            { _id: job._id },
            {
                telegramPosted: telegramSuccess,
                whatsappPosted: whatsappSuccess,
                publishedAt: new Date(),
            }
        );

        // Log activity
        await ActivityLog.create({
            action: 'SOCIAL_POST',
            entity: 'Job',
            entityId: job._id,
            details: `TG: ${telegramSuccess ? '✅' : '❌'} | WA: ${whatsappSuccess ? '✅' : '❌'}`,
            status: (telegramSuccess || whatsappSuccess) ? 'SUCCESS' : 'FAILED',
        });
    }

    return postedCount;
}

// ============================================
// REPOST URGENT JOBS (Last Date Reminder)
// ============================================

export async function repostUrgentJobs(): Promise<number> {
    await dbConnect();

    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const urgentJobs = await Job.find({
        status: 'PUBLISHED',
        lastDate: { $gte: new Date(), $lte: twoDaysFromNow },
        $or: [
            { lastRepostedAt: { $lt: yesterday } },
            { lastRepostedAt: { $exists: false } }
        ]
    }).limit(5);

    console.log(`⏰ Found ${urgentJobs.length} urgent jobs to remind...`);

    for (const job of urgentJobs) {
        const reminderPrefix = `⏰ *LAST DATE REMINDER\\!*\n\n`;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHANNEL_ID) {
            const message = reminderPrefix + formatTelegramMessage(job);

            await fetch(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHANNEL_ID,
                        text: message,
                        parse_mode: 'MarkdownV2',
                    }),
                }
            );
        }

        await Job.updateOne({ _id: job._id }, { lastRepostedAt: new Date() });
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return urgentJobs.length;
}

// ============================================
// MANUAL POST SINGLE JOB
// ============================================

export async function postJobToSocial(jobId: string): Promise<{ telegram: boolean; whatsapp: boolean }> {
    await dbConnect();

    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const telegramResult = await sendToTelegram(job);
    const whatsappResult = await sendToWhatsAppChannel(job);

    await Job.updateOne(
        { _id: jobId },
        {
            telegramPosted: telegramResult,
            whatsappPosted: whatsappResult,
        }
    );

    return { telegram: telegramResult, whatsapp: whatsappResult };
}
