import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkPendingJobs() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI not set');
        await mongoose.connect(mongoUri);

        const Job = (await import('../src/models/Job.ts')).default;

        const pending = await Job.countDocuments({
            isActive: true,
            telegramPosted: false,
            isVerified: true
        });

        const total = await Job.countDocuments({});

        console.log('--- Database Status ---');
        console.log(`Total Jobs: ${total}`);
        console.log(`Pending Telegram Posts: ${pending}`);

        if (pending > 0) {
            const sample = await Job.findOne({
                isActive: true,
                telegramPosted: false,
                isVerified: true
            }).sort({ postedDate: -1 });
            console.log('Sample Pending Job:', sample?.company, '-', sample?.title);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPendingJobs();
