import { triggerLightweightScraping } from '../src/lib/lightweightScraper';
import dotenv from 'dotenv';
dotenv.config();

async function testNewSources() {
    console.log('--- Testing New Job Sources with Provided Keys ---');
    console.log('Keys check:');
    console.log('ADZUNA_APP_ID:', process.env.ADZUNA_APP_ID ? 'Configured' : 'MISSING');
    console.log('ADZUNA_APP_KEY:', process.env.ADZUNA_APP_KEY ? 'Configured' : 'MISSING');
    console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Configured' : 'MISSING');

    try {
        const stats = await triggerLightweightScraping();
        console.log('--- Scrape Results ---');
        console.log('Total Jobs Found:', stats.total);
        console.log('Adzuna:', stats.adzuna);
        console.log('JSearch:', stats.jsearch);
        console.log('Jobicy:', stats.jobicy);
        console.log('Remotive:', stats.remotive);
        console.log('WWR:', stats.wwr);
        console.log('Himalayas:', stats.himalayas);
        console.log('FoundTheJob:', stats.foundthejob);
    } catch (error) {
        console.error('Testing failed:', error);
    }
    process.exit(0);
}

testNewSources();
