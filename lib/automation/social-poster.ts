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
    const unpostedJobs = await Job.find({
        status: 'PUBLISHED',
        telegramPosted: { $ne: true }
    }).limit(5).sort({ createdAt: -1 });

    let postedCount = 0;
    for (const job of unpostedJobs) {
        const res = await sendToTelegram(job);
        if (res.success) {
            await Job.updateOne({ _id: job._id }, { telegramPosted: true, publishedAt: new Date() });
            postedCount++;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    return postedCount;
}

export async function postJobToSocial(jobId: string): Promise<{ telegram: boolean; error?: string }> {
    await dbConnect();
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const res = await sendToTelegram(job);
    if (res.success) {
        await Job.updateOne({ _id: jobId }, { telegramPosted: true });
    }
    return { telegram: res.success, error: res.error };
}
