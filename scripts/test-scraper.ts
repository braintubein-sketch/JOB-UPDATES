import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function runScraper() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI not set');
        await mongoose.connect(mongoUri);

        const { triggerLightweightScraping } = await import('../src/lib/lightweightScraper.ts');
        console.log('Starting scraper...');
        const stats = await triggerLightweightScraping();
        console.log('Scraper results:', JSON.stringify(stats, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

runScraper();
