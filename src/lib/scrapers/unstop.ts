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

export async function scrapeUnstopJobs() {
    console.log('[Scraper] Starting Unstop scrape with Puppeteer...');

    let browser = null;
    try {
        const { getBrowser } = await import('../browser');
        browser = await getBrowser();
        const page = await browser.newPage();

        // Optimized & Stealthy
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Unstop Jobs URL (Software Development)
        const url = 'https://unstop.com/jobs?category=software-development';
        console.log(`[Scraper] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Unstop is a SPA, wait for cards
        try {
            await page.waitForSelector('.c-card', { timeout: 15000 });
        } catch (e) {
            console.log('[Scraper] No job cards with .c-card on Unstop, trying generic selectors.');
        }

        const content = await page.content();
        const $ = cheerio.load(content);

        // Select job cards
        // Recent Unstop structure often uses app-job-card or generic material cards
        const jobElements = $('app-job-card, .c-card, .listing-card').toArray().slice(0, 5);
        console.log(`[Scraper] Found ${jobElements.length} candidate jobs on Unstop`);

        let newJobsCount = 0;
        await connectDB();

        for (const element of jobElements) {
            try {
                // Extract list view info
                const title = $(element).find('h3, .title, .job-title').first().text().trim();
                const companyRaw = $(element).find('h4, .company-name, .org-name').first().text().trim();
                const linkSuffix = $(element).find('a').attr('href');

                if (!title || !linkSuffix) continue;

                const sourceUrl = linkSuffix.startsWith('http') ? linkSuffix : `https://unstop.com${linkSuffix}`;

                // Basic filtering
                if (!isITJob(title)) continue;

                // Check duplicates
                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                console.log(`[Scraper] Processing (Unstop): ${title}`);

                // Visit Detail Page
                try {
                    await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    const detailContent = await page.content();
                    const $detail = cheerio.load(detailContent);

                    // Extract detailed info
                    const description = $detail('.job-description, .about-section, #description').text() || $detail('app-job-description').text();

                    const company = normalizeCompanyName(companyRaw);
                    const skills = extractSkillsFromText(description);
                    // Unstop usually lists location in a specific span or pill
                    const locationText = $detail('.location, .cities, .work-location').text() || '';
                    const locations = extractLocationsFromText(locationText.length > 3 ? locationText : description);

                    const experience = parseExperienceFromText(description);
                    const category = detectCategory(title, skills);

                    const newJob = new Job({
                        company,
                        title,
                        qualification: 'Any Graduate',
                        locations: locations.length > 0 ? locations : ['India'],
                        experience,
                        employmentType: 'Full-time',
                        description: description.substring(0, 1000) || "Visit link for details.",
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
                    console.log(`[Scraper] Saved (Unstop): ${company} - ${title}`);

                    await new Promise(r => setTimeout(r, 2000));

                } catch (innerErr) {
                    console.error(`[Scraper] Failed details for ${sourceUrl}`, innerErr);
                }
            } catch (err) {
                console.error('[Scraper] Error parsing Unstop job:', err);
            }
        }

        await browser.close();
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Unstop Fatal error:', error);
        if (browser) await browser.close();
        return { count: 0, success: false, error: error.message || 'Unknown error' };
    }
}
