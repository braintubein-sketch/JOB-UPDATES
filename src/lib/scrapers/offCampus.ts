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
    console.log('[Scraper] Starting OffCampusJobs4u scrape...');

    try {
        const url = 'https://offcampusjobs4u.com/';

        // Use a mobile user agent which sometimes has fewer protections
        const userAgents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ];

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': 'https://www.google.com/',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'cross-site',
                'Cache-Control': 'max-age=0'
            },
            timeout: 20000
        });

        const $ = cheerio.load(data);
        // Combine multiple possible selectors to be robust
        const jobElements = [
            ...$('.post-column').toArray(),
            ...$('.entry-header').toArray(),
            ...$('article').toArray(),
            ...$('h3.entry-title').toArray()
        ];
        let newJobsCount = 0;

        await connectDB();

        for (const element of jobElements) {
            try {
                // Try finding title and link in various common WordPress locations
                const linkEl = $(element).find('a').first();
                const title = $(element).find('.entry-title').text().trim() ||
                    $(element).find('h3').text().trim() ||
                    linkEl.text().trim();
                const sourceUrl = linkEl.attr('href') || '';

                if (!title || !sourceUrl) continue;

                // Basic filtering
                if (!isITJob(title)) continue;

                // Check if already exists
                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                // Navigate to job detail page
                const detailRes = await axios.get(sourceUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Referer': url
                    }
                });
                const $detail = cheerio.load(detailRes.data);

                const contentText = $detail('.entry-content').text();

                // Extract Info
                const companyRaw = title.split('Recruitment')[0].trim() || title.split('Hiring')[0].trim();
                const company = normalizeCompanyName(companyRaw);
                const jobTitle = title.split('|')[0].trim().replace(companyRaw, '').replace('Recruitment', '').replace('Hiring', '').trim();

                const skills = extractSkillsFromText(contentText);
                const locations = extractLocationsFromText(contentText);
                const experience = parseExperienceFromText(contentText);
                const category = detectCategory(jobTitle, skills);

                // For demonstration/real use, find apply link (usually at the bottom in a button or link)
                let applyLink = sourceUrl; // Fallback
                $detail('a').each((_, el) => {
                    const href = $(el).attr('href');
                    const text = $(el).text().toLowerCase();
                    if (href && (text.includes('apply') || text.includes('registration link') || text.includes('click here'))) {
                        if (!href.includes('telegram') && !href.includes('whatsapp')) {
                            applyLink = href;
                        }
                    }
                });

                const newJob = new Job({
                    company,
                    title: jobTitle || title,
                    qualification: 'BE/B.Tech/MCA/Any Graduate', // Generic fallback or extract from text
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
                console.log(`[Scraper] Added: ${company} - ${jobTitle}`);

                // Wait to avoid rate limit
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (err) {
                console.error('[Scraper] Error parsing single job:', err);
            }
        }

        console.log(`[Scraper] Finished. Added ${newJobsCount} new jobs.`);
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Fatal error:', error);
        return { count: 0, success: false, error: error.message || 'Unknown error' };
    }
}
