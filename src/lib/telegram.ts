import TelegramBot from 'node-telegram-bot-api';
import { Job } from '@/types';
import { generateJobHashtags, formatExperience } from './utils';

const bot = process.env.TELEGRAM_BOT_TOKEN
    ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false })
    : null;

const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '';

interface TelegramMessage {
    text: string;
    parseMode: 'Markdown' | 'HTML';
}

export function formatJobForTelegram(job: Job, siteUrl: string): TelegramMessage {
    const hashtags = generateJobHashtags({
        category: job.category,
        skills: job.skills,
        experience: job.experience,
        employmentType: job.employmentType,
    });

    const jobUrl = `${siteUrl}/jobs/${job.slug}`;

    const message = `
🚀 *${job.company} is Hiring!*

💼 *Role:* ${job.title}
🎓 *Qualification:* ${job.qualification}
📍 *Location:* ${job.locations.slice(0, 4).join(', ')}${job.locations.length > 4 ? ` +${job.locations.length - 4} more` : ''}
🧠 *Experience:* ${formatExperience(job.experience.min, job.experience.max)}
📋 *Type:* ${job.employmentType}

🔧 *Skills:* ${job.skills.slice(0, 5).join(', ')}

🔗 [Apply Now](${jobUrl})

${hashtags.join(' ')}
`;

    return {
        text: message.trim(),
        parseMode: 'Markdown',
    };
}

export async function postJobToTelegram(job: Job, siteUrl: string): Promise<number | null> {
    if (!bot || !CHANNEL_ID) {
        console.warn('Telegram bot not configured');
        return null;
    }

    try {
        const { text, parseMode } = formatJobForTelegram(job, siteUrl);

        const message = await bot.sendMessage(CHANNEL_ID, text, {
            parse_mode: parseMode,
            disable_web_page_preview: false,
        });

        return message.message_id;
    } catch (error) {
        console.error('Failed to post to Telegram:', error);
        return null;
    }
}

export async function editTelegramMessage(
    messageId: number,
    newText: string
): Promise<boolean> {
    if (!bot || !CHANNEL_ID) return false;

    try {
        await bot.editMessageText(newText, {
            chat_id: CHANNEL_ID,
            message_id: messageId,
            parse_mode: 'Markdown',
        });
        return true;
    } catch (error) {
        console.error('Failed to edit Telegram message:', error);
        return false;
    }
}

export async function deleteTelegramMessage(messageId: number): Promise<boolean> {
    if (!bot || !CHANNEL_ID) return false;

    try {
        await bot.deleteMessage(CHANNEL_ID, messageId);
        return true;
    } catch (error) {
        console.error('Failed to delete Telegram message:', error);
        return false;
    }
}

export async function sendTelegramNotification(text: string): Promise<boolean> {
    if (!bot || !CHANNEL_ID) return false;

    try {
        await bot.sendMessage(CHANNEL_ID, text, { parse_mode: 'Markdown' });
        return true;
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return false;
    }
}
