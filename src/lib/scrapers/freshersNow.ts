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

export async function scrapeFreshersNow() {
    console.log('[Scraper] Starting FreshersNow scrape with Puppeteer...');

    let browser = null;
    try {
        const { getBrowser } = await import('../browser');
        browser = await getBrowser();
        const page = await browser.newPage();

        // Stealth settings
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

        // Speed up: Block images and CSS
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        const url = 'https://www.freshersnow.com/off-campus-drives/';
        console.log(`[Scraper] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Get content
        const content = await page.content();
        const $ = cheerio.load(content);

        // Select rows - skip header
        const jobElements = $('.wp-block-table tr').toArray().slice(1, 6); // Limit to 5
        let newJobsCount = 0;

        await connectDB();

        for (const element of jobElements) {
            try {
                const cells = $(element).find('td');
                if (cells.length < 2) continue;

                const companyRaw = $(cells[0]).text().trim();
                const titleRaw = $(cells[1]).text().trim();
                const sourceUrl = $(cells[1]).find('a').attr('href') || '';

                if (!companyRaw || !sourceUrl) continue;

                // Basic filtering
                if (!isITJob(titleRaw)) continue;

                // Check if already exists
                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                console.log(`[Scraper] Processing (FN): ${titleRaw}`);

                // Visit Detail Page
                try {
                    await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    const detailContent = await page.content();
                    const $detail = cheerio.load(detailContent);

                    const contentText = $detail('.entry-content').text();
                    const company = normalizeCompanyName(companyRaw);

                    const skills = extractSkillsFromText(contentText);
                    const locations = extractLocationsFromText(contentText);
                    const experience = parseExperienceFromText(contentText);
                    const category = detectCategory(titleRaw, skills);

                    let applyLink = sourceUrl;

                    const newJob = new Job({
                        company,
                        title: titleRaw,
                        qualification: 'BE/B.Tech/MCA/Any Graduate',
                        locations,
                        experience,
                        employmentType: 'Full-time',
                        description: contentText.substring(0, 1000),
                        skills,
                        applyLink,
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
                    console.log(`[Scraper] Saved (FN): ${company}`);

                    await new Promise(r => setTimeout(r, 2000));

                } catch (innerErr) {
                    console.error(`[Scraper] Failed details for ${sourceUrl}`, innerErr);
                }
            } catch (err) {
                console.error('[Scraper] Error parsing FN job:', err);
            }
        }

        await browser.close();
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] FreshersNow Fatal error:', error);
        if (browser) await browser.close();
        return { count: 0, success: false, error: error.message || 'Unknown error' };
    }
}
