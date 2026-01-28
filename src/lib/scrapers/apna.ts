import { getBrowser } from '../browser';
import * as cheerio from 'cheerio';
import {
    isITJob,
    detectCategory,
    parseExperienceFromText,
    extractSkillsFromText,
    extractLocationsFromText,
    normalizeCompanyName
} from '../scraper';
import { getCompanyLogo } from '../utils';
import connectDB from '../db';
import Job from '@/models/Job';

export async function scrapeApnaJobs() {
    console.log('[Scraper] Starting Apna Job scrape with Puppeteer...');

    let browser = null;
    try {
        const { getBrowser } = await import('../browser');
        browser = await getBrowser();
        const page = await browser.newPage();

        // Optimized & Stealthy
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        // Relaxed resource blocking
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'media', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Apna Software/IT Jobs URL
        const url = 'https://apna.co/jobs?text=Software&location_id=1'; // location_id=1 is roughly "All India" or defaults to top cities in their new schema
        console.log(`[Scraper] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for job cards to load (client-side rendered)
        try {
            await page.waitForSelector('.JobCard', { timeout: 10000 });
        } catch (e) {
            console.log('[Scraper] No job cards found on Apna immediately.');
        }

        const content = await page.content();
        const $ = cheerio.load(content);

        // Select job cards
        const jobElements = $('.JobCard').toArray().slice(0, 5); // Limit to top 5
        console.log(`[Scraper] Found ${jobElements.length} candidate jobs on Apna`);

        let newJobsCount = 0;
        await connectDB();

        for (const element of jobElements) {
            try {
                // Extract list view info
                const title = $(element).find('h2').text().trim();
                const companyRaw = $(element).find('.JobCard-company').text().trim();
                const linkSuffix = $(element).attr('href'); // usually relative /jobs/...

                if (!title || !linkSuffix) continue;

                const sourceUrl = `https://apna.co${linkSuffix}`;

                // Basic filtering
                if (!isITJob(title)) continue;

                // Check duplicates
                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                console.log(`[Scraper] Processing (Apna): ${title}`);

                // Visit Detail Page
                try {
                    await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    const detailContent = await page.content();
                    const $detail = cheerio.load(detailContent);

                    // Extract detailed info
                    // Note: Selectors might need adjustment based on dynamic updates
                    const description = $detail('.JobDescription').text() || $detail('section').text();

                    const company = normalizeCompanyName(companyRaw);
                    const skills = extractSkillsFromText(description);
                    const locations = extractLocationsFromText($detail('.JobLocatiopn').text() || ''); // Typo in their class sometimes? check visually if possible
                    const experience = parseExperienceFromText(description);
                    const category = detectCategory(title, skills);

                    const newJob = new Job({
                        company,
                        title,
                        qualification: 'Any Graduate',
                        locations: locations.length > 0 ? locations : ['India'],
                        experience,
                        employmentType: 'Full-time',
                        description: description.substring(0, 1000),
                        skills,
                        applyLink: sourceUrl,
                        category,
                        isVerified: true,
                        isActive: true,
                        source: 'automated',
                        sourceUrl,
                        companyLogo: getCompanyLogo(company),
                        postedDate: new Date(),
                    });

                    await newJob.save();
                    newJobsCount++;
                    console.log(`[Scraper] Saved (Apna): ${company} - ${title}`);

                    await new Promise(r => setTimeout(r, 2000));

                } catch (innerErr) {
                    console.error(`[Scraper] Failed details for ${sourceUrl}`, innerErr);
                }
            } catch (err) {
                console.error('[Scraper] Error parsing Apna job:', err);
            }
        }

        await browser.close();
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Apna Fatal error:', error);
        if (browser) await browser.close();
        return { count: 0, success: false, error: error.message || 'Unknown error' };
    }
}
