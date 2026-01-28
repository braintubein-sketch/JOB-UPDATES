import { scrapeOffCampusJobs } from '../src/lib/scrapers/offCampus';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    console.log('--- MANUALLY TRIGGERING SCRAPER ---');
    try {
        const count = await scrapeOffCampusJobs();
        console.log(`Successfully added ${count} jobs.`);
        process.exit(0);
    } catch (err) {
        console.error('Manual scrape failed:', err);
        process.exit(1);
    }
}

main();
