import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHANNEL_ID;

async function testConnection() {
    if (!token || !chatId) {
        console.error('Missing token or chatId in .env');
        return;
    }

    const bot = new TelegramBot(token, { polling: false });

    try {
        console.log('Sending test message...');
        await bot.sendMessage(chatId, '✅ *Braintube Job Updates* is now connected!\n\nAutomated premium jobs will be posted here regularly.', { parse_mode: 'Markdown' });
        console.log('Success! Check your channel.');
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
