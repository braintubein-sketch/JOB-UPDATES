import dbConnect from '../mongodb/dbConnect';
import { Job, ActivityLog } from '../../models/Job';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Format job as Telegram message
function formatTelegramMessage(job: any): string {
    const lines = [
        `📢 *${job.title}*`,
        ``,
        `🏢 *Organization:* ${job.organization}`,
        job.qualification ? `📚 *Qualification:* ${job.qualification}` : '',
        job.salary ? `💰 *Salary:* ${job.salary}` : '',
        job.vacancies ? `👥 *Vacancies:* ${job.vacancies}` : '',
        job.location ? `📍 *Location:* ${job.location}` : '',
        job.lastDate ? `📅 *Last Date:* ${new Date(job.lastDate).toLocaleDateString('en-IN')}` : '',
        ``,
        `━━━━━━━━━━━━━━━━━`,
        ``,
        job.applyLink ? `🔗 [Apply Now (Official)](${job.applyLink})` : '',
        ``,
        `📱 More Jobs: [jobupdate.site](https://jobupdate.site)`,
        `📢 Join: @jobupdatesite`,
    ].filter(line => line !== '');

    return lines.join('\n');
}

// Send to Telegram
async function sendToTelegram(job: any): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
        console.log('Telegram not configured, skipping...');
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
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false,
                }),
            }
        );

        const result = await response.json();
        if (result.ok) {
            console.log(`✅ Telegram posted: ${job.title}`);
            return true;
        } else {
            console.error('Telegram error:', result);
            return false;
        }
    } catch (error) {
        console.error('Telegram posting failed:', error);
        return false;
    }
}

// Send to WhatsApp (Template Message)
async function sendToWhatsApp(job: any): Promise<boolean> {
    if (!WHATSAPP_PHONE_ID || !WHATSAPP_ACCESS_TOKEN) {
        console.log('WhatsApp not configured, skipping...');
        return false;
    }

    try {
        // Note: WhatsApp Business API requires approved templates
        // This is a simplified example - actual implementation requires template approval
        const message = {
            messaging_product: 'whatsapp',
            to: process.env.WHATSAPP_BROADCAST_NUMBER, // Your broadcast list
            type: 'template',
            template: {
                name: 'job_notification', // Must be approved by WhatsApp
                language: { code: 'en' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: job.title },
                            { type: 'text', text: job.organization },
                            { type: 'text', text: job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'Check PDF' },
                        ]
                    }
                ]
            }
        };

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            }
        );

        const result = await response.json();
        if (!result.error) {
            console.log(`✅ WhatsApp posted: ${job.title}`);
            return true;
        } else {
            console.error('WhatsApp error:', result);
            return false;
        }
    } catch (error) {
        console.error('WhatsApp posting failed:', error);
        return false;
    }
}

// Main function to auto-post new jobs
export async function autoPostNewJobs() {
    await dbConnect();

    // Find jobs that are published but not yet posted to social
    const unpostedJobs = await Job.find({
        status: 'PUBLISHED',
        $or: [
            { telegramPosted: false },
            { whatsappPosted: false }
        ]
    }).limit(10);

    console.log(`Found ${unpostedJobs.length} jobs to post...`);

    for (const job of unpostedJobs) {
        let telegramSuccess = job.telegramPosted;
        let whatsappSuccess = job.whatsappPosted;

        if (!job.telegramPosted) {
            telegramSuccess = await sendToTelegram(job);
        }

        if (!job.whatsappPosted) {
            whatsappSuccess = await sendToWhatsApp(job);
        }

        // Update job
        await Job.updateOne(
            { _id: job._id },
            {
                telegramPosted: telegramSuccess,
                whatsappPosted: whatsappSuccess,
            }
        );

        // Log activity
        await ActivityLog.create({
            action: 'AUTO_POST',
            entity: 'Job',
            entityId: job._id,
            details: `Telegram: ${telegramSuccess ? 'Success' : 'Failed'}, WhatsApp: ${whatsappSuccess ? 'Success' : 'Failed'}`,
            status: (telegramSuccess || whatsappSuccess) ? 'SUCCESS' : 'FAILED',
        });
    }

    return unpostedJobs.length;
}

// Repost jobs before last date (reminder)
export async function repostUrgentJobs() {
    await dbConnect();

    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const urgentJobs = await Job.find({
        status: 'PUBLISHED',
        lastDate: { $gte: new Date(), $lte: twoDaysFromNow },
        $or: [
            { lastRepostedAt: { $lt: oneDayAgo } },
            { lastRepostedAt: { $exists: false } }
        ]
    }).limit(5);

    console.log(`Found ${urgentJobs.length} urgent jobs to repost...`);

    for (const job of urgentJobs) {
        const reminderMessage = `⏰ *REMINDER: Last Date Approaching!*\n\n${formatTelegramMessage(job)}`;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHANNEL_ID) {
            await fetch(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHANNEL_ID,
                        text: reminderMessage,
                        parse_mode: 'Markdown',
                    }),
                }
            );
        }

        await Job.updateOne({ _id: job._id }, { lastRepostedAt: new Date() });
    }

    return urgentJobs.length;
}
