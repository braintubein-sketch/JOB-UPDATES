import axios from 'axios';
import * as cheerio from 'cheerio';
import {
    isITJob,
    detectCategory,
    parseExperienceFromText,
    extractSkillsFromText,
    extractLocationsFromText,
    normalizeCompanyName,
    generateJobSlug
} from '../scraper';
import { getCompanyLogo } from '../utils';
import connectDB from '../db';
import Job from '@/models/Job';

export async function scrapeOffCampusJobs() {
    console.log('[Scraper] Starting OffCampusJobs4u scrape with Puppeteer...');

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

        // Go to homepage
        const url = 'https://offcampusjobs4u.com/';
        console.log(`[Scraper] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Get content
        const content = await page.content();
        const $ = cheerio.load(content);

        // Robust selectors
        const jobElements = [
            ...$('.post-column').toArray(),
            ...$('.entry-header').toArray(),
            ...$('article').toArray()
        ].slice(0, 5); // Limit to top 5 for performance

        let newJobsCount = 0;
        await connectDB();

        for (const element of jobElements) {
            try {
                // Extract basic info
                const linkEl = $(element).find('a').first();
                const titleStr = $(element).find('.entry-title').text().trim() ||
                    $(element).find('h3').text().trim() ||
                    linkEl.text().trim();
                const sourceUrl = linkEl.attr('href') || '';

                if (!titleStr || !sourceUrl) continue;

                // Filter non-IT or old jobs
                if (!isITJob(titleStr)) continue;

                // Check dupes
                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                console.log(`[Scraper] Processing: ${titleStr}`);

                // Visit Detail Page
                try {
                    await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    const detailContent = await page.content();
                    const $detail = cheerio.load(detailContent);

                    const contentText = $detail('.entry-content').text();

                    // Parse Data
                    const companyRaw = titleStr.split('Recruitment')[0].trim();
                    const company = normalizeCompanyName(companyRaw);
                    const skills = extractSkillsFromText(contentText);
                    const locations = extractLocationsFromText(contentText);
                    const experience = parseExperienceFromText(contentText);
                    const category = detectCategory(titleStr, skills);

                    // Apply Link Logic
                    let applyLink = sourceUrl;

                    // Save
                    const newJob = new Job({
                        company,
                        title: titleStr,
                        qualification: 'Any Graduate',
                        locations,
                        experience,
                        employmentType: 'Full-time',
                        description: contentText.substring(0, 1000), // Truncate description
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
                    console.log(`[Scraper] Saved: ${company}`);

                    // Pause
                    await new Promise(r => setTimeout(r, 2000));

                } catch (innerErr) {
                    console.error(`[Scraper] Failed details for ${sourceUrl}`, innerErr);
                }
            } catch (elemErr) {
                console.error('[Scraper] Element error', elemErr);
            }
        }

        await browser.close();
        return { count: newJobsCount, success: true };

    } catch (error: any) {
        console.error('[Scraper] Puppeteer Fatal error:', error);
        if (browser) await browser.close();
        return { count: 0, success: false, error: error.message || 'Unknown error' };
    }
}
