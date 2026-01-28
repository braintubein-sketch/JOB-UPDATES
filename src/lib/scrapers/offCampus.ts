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
        const url = 'https://offcampusjobs4u.com/category/it-jobs/';
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/',
                'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'Sec-Fetch-Site': 'cross-site'
            }
        });

        const $ = cheerio.load(data);
        const jobElements = $('.post-column').toArray();
        let newJobsCount = 0;

        await connectDB();

        for (const element of jobElements) {
            try {
                const title = $(element).find('.entry-title a').text().trim();
                const sourceUrl = $(element).find('.entry-title a').attr('href') || '';

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
        return newJobsCount;
    } catch (error) {
        console.error('[Scraper] Fatal error:', error);
        return 0;
    }
}
