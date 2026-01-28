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

export async function scrapeInternshala() {
    console.log('[Scraper] Starting Internshala scrape with Puppeteer...');

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

        // Computer Science Internships
        const url = 'https://internshala.com/internships/computer-science-internship/';
        console.log(`[Scraper] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        try {
            await page.waitForSelector('.internship_meta', { timeout: 15000 });
        } catch (e) {
            console.log('[Scraper] No internship cards found on Internshala.');
        }

        const content = await page.content();
        const $ = cheerio.load(content);

        // Select cards
        const jobElements = $('.internship_meta').toArray().slice(0, 5);
        console.log(`[Scraper] Found ${jobElements.length} candidate jobs on Internshala`);

        let newJobsCount = 0;
        await connectDB();

        for (const element of jobElements) {
            try {
                const title = $(element).find('.profile a').text().trim();
                const companyRaw = $(element).find('.company_name a').text().trim();
                const linkSuffix = $(element).find('.profile a').attr('href');

                if (!title || !linkSuffix) continue;

                const sourceUrl = `https://internshala.com${linkSuffix}`;

                // Basic filtering
                // Internshala CS category is usually relevant, but check keywords
                if (!isITJob(title)) {
                    // Be permissive for internships
                }

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                console.log(`[Scraper] Processing (Internshala): ${title}`);

                // Visit Detail Page
                try {
                    await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    const detailContent = await page.content();
                    const $detail = cheerio.load(detailContent);

                    // Extract detailed info
                    const textContainer = $detail('.internship_details, .job_details').text();
                    const aboutText = $detail('.text-container').text();
                    const fullText = textContainer + " " + aboutText;

                    const company = normalizeCompanyName(companyRaw);
                    const skills = extractSkillsFromText(fullText);
                    const locations = extractLocationsFromText($detail('.location_link').text() || '');

                    // Experience is 0 for internships usually
                    const experience = { min: 0, max: 0, label: 'Fresher / Intern' };
                    const category = detectCategory(title, skills);

                    const newJob = new Job({
                        company,
                        title,
                        qualification: 'Student/Fresher',
                        locations: locations.length > 0 ? locations : ['Remote'],
                        experience,
                        employmentType: 'Internship',
                        description: fullText.substring(0, 1000).replace(/\s+/g, ' ').trim(),
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
                    console.log(`[Scraper] Saved (Internshala): ${company} - ${title}`);

                    await new Promise(r => setTimeout(r, 2000));

                } catch (innerErr) {
                    console.error(`[Scraper] Failed details for ${sourceUrl}`, innerErr);
                }
            } catch (err) {
                console.error('[Scraper] Error parsing Internshala job:', err);
            }
        }

        await browser.close();
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Internshala Fatal error:', error);
        if (browser) await browser.close();
        return { count: 0, success: false, error: error.message || 'Unknown error' };
    }
}
