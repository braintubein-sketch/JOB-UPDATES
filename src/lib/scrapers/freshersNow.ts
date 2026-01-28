import axios from 'axios';
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
    console.log('[Scraper] Starting FreshersNow scrape...');

    const userAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    ];

    const headers = {
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'max-age=0',
        'DNT': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site'
    };

    try {
        const url = 'https://www.freshersnow.com/off-campus-drives/';
        const { data } = await axios.get(url, { headers });

        const $ = cheerio.load(data);
        const jobElements = $('.wp-block-table tr').toArray().slice(1); // Skip header row
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

                // Navigate to job detail page
                const detailRes = await axios.get(sourceUrl, { headers });
                const $detail = cheerio.load(detailRes.data);

                const contentText = $detail('.entry-content').text();
                const company = normalizeCompanyName(companyRaw);

                const skills = extractSkillsFromText(contentText);
                const locations = extractLocationsFromText(contentText);
                const experience = parseExperienceFromText(contentText);
                const category = detectCategory(titleRaw, skills);

                let applyLink = sourceUrl;
                $detail('a').each((_, el) => {
                    const href = $(el).attr('href');
                    const text = $(el).text().toLowerCase();
                    if (href && (text.includes('click here to apply') || text.includes('apply link') || text.includes('register here'))) {
                        if (!href.includes('telegram') && !href.includes('whatsapp') && !href.includes('freshersnow')) {
                            applyLink = href;
                        }
                    }
                });

                const newJob = new Job({
                    company,
                    title: titleRaw,
                    qualification: 'BE/B.Tech/MCA/Any Graduate',
                    locations,
                    experience,
                    employmentType: 'Full-time',
                    description: $detail('.entry-content').html() || contentText,
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
                console.log(`[Scraper] Added (FN): ${company} - ${titleRaw}`);

                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (err) {
                console.error('[Scraper] Error parsing FN job:', err);
            }
        }

        return newJobsCount;
    } catch (error) {
        console.error('[Scraper] FreshersNow Fatal error:', error);
        return 0;
    }
}
