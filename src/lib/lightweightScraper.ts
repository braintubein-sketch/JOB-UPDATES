import axios from 'axios';
import * as cheerio from 'cheerio';
import {
    isITJob,
    detectCategory,
    parseExperienceFromText,
    extractSkillsFromText,
    extractLocationsFromText,
    normalizeCompanyName,
    extractQualificationFromText,
    extractRolesFromTitle,
    generateJobSlug,
    normalizeEmploymentType,
    normalizeUrl
} from './scraper';
import { getCompanyLogo } from './utils';
import connectDB from './db';
import Job from '@/models/Job';

// Lightweight scraper - NO PUPPETEER, uses simple HTTP requests

interface ScraperResult {
    count: number;
    success: boolean;
    error?: string;
}

// Jobicy API - Reliable and open
async function scrapeJobicy(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Jobicy API...');
    try {
        const { data } = await axios.get('https://jobicy.com/api/v2/remote-jobs?count=30', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        const jobs = data.jobs || [];
        let newJobsCount = 0;

        await connectDB();

        for (const job of jobs) {
            try {
                const sourceUrl = job.url;

                // Check if already exists by URL
                const existingUrl = await Job.findOne({ sourceUrl });
                if (existingUrl) continue;

                // Check if similar job exists (same company/title recently)
                const existingSimilar = await (Job as any).findSimilar({
                    company: normalizeCompanyName(job.companyName || 'Unknown'),
                    title: job.jobTitle || 'Unknown Role'
                });
                if (existingSimilar) continue;

                // Filter for IT jobs
                if (!isITJob(job.jobTitle + ' ' + (job.jobDescription || ''))) continue;

                const company = normalizeCompanyName(job.companyName || 'Unknown');
                const jobTitle = job.jobTitle || 'Unknown Role';
                const skills = job.jobCategories || [];

                // Generate slug
                const slug = generateJobSlug(company, jobTitle);

                const newJob = new Job({
                    company,
                    title: jobTitle,
                    slug,
                    roles: extractRolesFromTitle(jobTitle),
                    qualification: extractQualificationFromText(job.jobDescription || ''),
                    locations: [job.jobGeo || 'Remote'],
                    experience: parseExperienceFromText(job.jobDescription || ''),
                    employmentType: 'Full-time',
                    description: (job.jobDescription || '').substring(0, 1000),
                    skills,
                    applyLink: sourceUrl,
                    category: detectCategory(job.jobTitle, skills),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date(job.pubDate || Date.now())
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (Jobicy): ${company} - ${job.jobTitle}`);
            } catch (err) {
                console.error('[Scraper] Error saving Jobicy job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Jobicy error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// Adzuna API - Free tier available
async function scrapeAdzuna(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Adzuna...');
    try {
        const appId = (process.env.ADZUNA_APP_ID || '').trim();
        const appKey = (process.env.ADZUNA_APP_KEY || '').trim();

        if (!appId || !appKey) {
            console.log('[Scraper] Adzuna credentials not configured, skipping...');
            return { count: 0, success: true };
        }

        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=software+developer&results_per_page=10`;
        const { data } = await axios.get(url, { timeout: 15000 });

        let newJobsCount = 0;
        await connectDB();

        for (const job of data.results || []) {
            try {
                const sourceUrl = job.redirect_url;

                const existingUrl = await Job.findOne({ sourceUrl });
                if (existingUrl) continue;

                const company = normalizeCompanyName(job.company?.display_name || 'Unknown');
                const jobTitle = job.title || 'Unknown Role';

                const existingSimilar = await (Job as any).findSimilar({ company, title: jobTitle });
                if (existingSimilar) continue;

                if (!isITJob(jobTitle + ' ' + (job.description || ''))) continue;

                // Generate slug
                const slug = generateJobSlug(company, jobTitle);

                const newJob = new Job({
                    company,
                    title: jobTitle,
                    slug,
                    roles: extractRolesFromTitle(jobTitle),
                    qualification: extractQualificationFromText(job.description || ''),
                    locations: [job.location?.display_name || 'India'],
                    experience: parseExperienceFromText(job.description || ''),
                    employmentType: normalizeEmploymentType(job.contract_type || 'Full-time'),
                    description: (job.description || '').substring(0, 1000),
                    skills: extractSkillsFromText(job.description || ''),
                    applyLink: normalizeUrl(sourceUrl),
                    category: detectCategory(job.title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date(job.created || Date.now())
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (Adzuna): ${company} - ${job.title}`);
            } catch (err) {
                console.error('[Scraper] Error saving Adzuna job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Adzuna error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// WeWorkRemotely Scraper
async function scrapeWWR(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from We Work Remotely...');
    try {
        const { data } = await axios.get('https://weworkremotely.com/categories/remote-programming-jobs.rss', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/xml'
            },
            timeout: 15000
        });

        const $ = cheerio.load(data, { xmlMode: true });
        let newJobsCount = 0;
        await connectDB();

        const items = $('item').toArray();

        for (const el of items) {
            try {
                const title = $(el).find('title').text();
                const sourceUrl = $(el).find('link').text();
                const content = $(el).find('description').text();
                const pubDate = new Date($(el).find('pubDate').text());

                const existingUrl = await Job.findOne({ sourceUrl });
                if (existingUrl) continue;

                // Title format is usually "Company: Role"
                let company = 'Unknown';
                let jobTitle = title;
                if (title.includes(':')) {
                    const parts = title.split(':');
                    company = normalizeCompanyName(parts[0]);
                    jobTitle = parts.slice(1).join(':').trim();
                } else {
                    company = normalizeCompanyName(title.split(' ')[0]);
                }

                const slug = generateJobSlug(company, jobTitle);

                const newJob = new Job({
                    company,
                    title: jobTitle,
                    slug,
                    roles: extractRolesFromTitle(jobTitle),
                    qualification: extractQualificationFromText(content),
                    locations: ['Remote'],
                    experience: parseExperienceFromText(content),
                    employmentType: 'Full-time',
                    description: content.substring(0, 1000),
                    skills: extractSkillsFromText(content),
                    applyLink: sourceUrl,
                    category: detectCategory(jobTitle, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: pubDate
                });

                await newJob.save();
                newJobsCount++;
            } catch (err) {
                console.error('[Scraper] Error saving WWR item:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] WWR error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// Simple HTTP scrape of a reliable source (no heavy JS)
async function scrapeSimpleSource(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Himalayas...');
    try {
        // Use a simple, reliable job board
        const { data } = await axios.get('https://himalayas.app/jobs/api?limit=20', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://himalayas.app/'
            },
            timeout: 25000
        });

        let newJobsCount = 0;
        await connectDB();

        for (const job of data.jobs || []) {
            try {
                const sourceUrl = `https://himalayas.app/jobs/${job.slug}`;

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                if (!isITJob(job.title + ' ' + (job.categories || []).join(' '))) continue;

                const company = normalizeCompanyName(job.companyName || 'Unknown');
                const jobTitle = job.title || 'Unknown Role';

                // Generate slug
                const slug = generateJobSlug(company, jobTitle);

                // Handle seniority - could be string or array
                const seniorityLabel = Array.isArray(job.seniority)
                    ? job.seniority[0] || 'Entry Level'
                    : job.seniority || 'Entry Level';

                const newJob = new Job({
                    company,
                    title: jobTitle,
                    slug,
                    roles: extractRolesFromTitle(jobTitle),
                    qualification: extractQualificationFromText(job.description || ''),
                    locations: [job.locationRestrictions?.[0] || 'Remote'],
                    experience: { min: 0, max: 5, label: seniorityLabel },
                    employmentType: 'Full-time',
                    description: (job.description || '').substring(0, 1000),
                    skills: job.categories || [],
                    applyLink: job.applicationUrl || sourceUrl,
                    category: detectCategory(job.title, job.categories || []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date(job.pubDate || Date.now())
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (Himalayas): ${company} - ${job.title}`);
            } catch (err) {
                console.error('[Scraper] Error saving Himalayas job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Himalayas error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// FindWork.dev - Very open API, no auth needed
// Remotive API - Open and reliable
async function scrapeRemotive(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Remotive...');
    try {
        const { data } = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=20', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://remotive.com/'
            },
            timeout: 25000
        });

        let newJobsCount = 0;
        await connectDB();

        for (const job of (data.jobs || [])) {
            try {
                const sourceUrl = job.url;

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                if (!isITJob(job.title + ' ' + (job.tags || []).join(' '))) continue;

                const company = normalizeCompanyName(job.company_name || 'Unknown');
                const jobTitle = job.title || 'Unknown Role';

                // Generate slug
                const slug = generateJobSlug(company, jobTitle);

                const newJob = new Job({
                    company,
                    title: jobTitle,
                    slug,
                    roles: extractRolesFromTitle(jobTitle),
                    qualification: extractQualificationFromText(job.description || ''),
                    locations: [job.candidate_required_location || 'Remote'],
                    experience: parseExperienceFromText(job.description || ''),
                    employmentType: normalizeEmploymentType(job.job_type || 'Full-time'),
                    description: (job.description || '').substring(0, 1000),
                    skills: job.tags || [],
                    applyLink: normalizeUrl(job.url || sourceUrl),
                    category: detectCategory(job.title, job.tags || []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date(job.publication_date || Date.now())
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (Remotive): ${company} - ${job.title}`);
            } catch (err) {
                console.error('[Scraper] Error saving Remotive job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Remotive error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// JSearch API (RapidAPI) - if configured
async function scrapeJSearch(): Promise<ScraperResult> {
    console.log('[Scraper] Checking JSearch...');
    const rapidApiKey = (process.env.RAPIDAPI_KEY || '').trim();

    if (!rapidApiKey) {
        console.log('[Scraper] RapidAPI key not configured, skipping JSearch...');
        return { count: 0, success: true };
    }

    try {
        const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
            params: {
                query: 'software engineer devops cloud data developer in India',
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            },
            timeout: 15000
        });

        let newJobsCount = 0;
        await connectDB();

        for (const job of (data.data || []).slice(0, 10)) {
            try {
                const sourceUrl = job.job_apply_link || job.job_google_link;

                const existingUrl = await Job.findOne({ sourceUrl });
                if (existingUrl) continue;

                const company = normalizeCompanyName(job.employer_name || 'Unknown');

                const existingSimilar = await (Job as any).findSimilar({ company, title: job.job_title });
                if (existingSimilar) continue;

                if (!isITJob(job.job_title + ' ' + (job.job_description || ''))) continue;

                // Generate slug
                const slug = `${company}-${job.job_title}`.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 100);

                const newJob = new Job({
                    company,
                    title: job.job_title,
                    slug,
                    roles: [job.job_title],
                    qualification: extractQualificationFromText(job.job_description || ''),
                    locations: [job.job_city || job.job_country || 'India'],
                    experience: parseExperienceFromText(job.job_description || ''),
                    employmentType: normalizeEmploymentType(job.job_employment_type || 'Full-time'),
                    description: (job.job_description || '').substring(0, 1000),
                    skills: job.job_required_skills || [],
                    applyLink: normalizeUrl(sourceUrl),
                    category: detectCategory(job.job_title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date(job.job_posted_at_datetime_utc || Date.now())
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (JSearch): ${company} - ${job.job_title}`);
            } catch (err) {
                console.error('[Scraper] Error saving JSearch job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] JSearch error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// FoundTheJob Scraper - Uses RSS feed for reliability
async function scrapeFoundTheJob(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from FoundTheJob RSS...');
    try {
        const { data } = await axios.get('https://foundthejob.com/feed/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/xml'
            },
            timeout: 15000
        });

        const $ = cheerio.load(data, { xmlMode: true });
        let newJobsCount = 0;
        await connectDB();

        const items = $('item').toArray();

        for (const el of items) {
            try {
                const title = $(el).find('title').text();
                const sourceUrl = $(el).find('link').text();
                const content = $(el).find('content\\:encoded').text();
                const pubDate = new Date($(el).find('pubDate').text());

                const existingUrl = await Job.findOne({ sourceUrl });
                if (existingUrl) continue;

                // Basic filtering
                if (!isITJob(title + ' ' + content)) continue;

                // Extract company from title
                let company = 'Unknown';
                const companyMatch = title.match(/^(.*?)\s+(?:Hiring|Careers|Jobs|Internship)/i);
                if (companyMatch) {
                    company = normalizeCompanyName(companyMatch[1]);
                } else {
                    company = normalizeCompanyName(title.split(' ')[0]);
                }

                const existingSimilar = await (Job as any).findSimilar({ company, title });
                if (existingSimilar) continue;

                // Find external apply link in content
                const inner$ = cheerio.load(content);
                const externalLinks: string[] = [];
                inner$('a').each((_, a) => {
                    const href = inner$(a).attr('href');
                    if (href &&
                        !href.includes('foundthejob.com') &&
                        !href.includes('telegram') &&
                        !href.includes('instagram') &&
                        !href.includes('youtube') &&
                        !href.includes('addtoany') &&
                        !href.startsWith('#')
                    ) {
                        externalLinks.push(href);
                    }
                });

                // If no external link is found, skip this job entirely
                if (externalLinks.length === 0) {
                    console.log(`[Scraper] Skipping ${title} - No direct apply link found.`);
                    continue;
                }

                const applyLink = externalLinks[0];

                // Generate slug
                const slug = generateJobSlug(company, title);

                const newJob = new Job({
                    company,
                    title,
                    slug,
                    roles: extractRolesFromTitle(title),
                    qualification: extractQualificationFromText(content),
                    locations: extractLocationsFromText(content) || ['India'],
                    experience: parseExperienceFromText(content),
                    employmentType: normalizeEmploymentType(title.toLowerCase().includes('intern') ? 'Internship' : 'Full-time'),
                    description: content.replace(/<[^>]*>?/gm, '').substring(0, 1000),
                    skills: extractSkillsFromText(content),
                    applyLink: normalizeUrl(applyLink),
                    category: detectCategory(title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: pubDate
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (FoundTheJob): ${company} - ${title}`);
            } catch (err) {
                console.error('[Scraper] Error saving FoundTheJob item:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] FoundTheJob error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// OffCampusJobs4u Lightweight Scraper
async function scrapeOffCampusLightweight(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from OffCampusJobs4u...');
    try {
        const { data } = await axios.get('https://offcampusjobs4u.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            },
            timeout: 15000
        });

        const $ = cheerio.load(data);
        const jobElements = $('article, .post').toArray().slice(0, 10);
        let newJobsCount = 0;
        await connectDB();

        for (const el of jobElements) {
            try {
                const title = $(el).find('.entry-title, h2, h3').first().text().trim();
                const sourceUrl = $(el).find('a').first().attr('href');

                if (!title || !sourceUrl) continue;
                if (!isITJob(title)) continue;

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                const companyRaw = title.split('Recruitment')[0].split('Hiring')[0].trim();
                const company = normalizeCompanyName(companyRaw);

                const existingSimilar = await (Job as any).findSimilar({ company, title });
                if (existingSimilar) continue;

                const newJob = new Job({
                    company,
                    title,
                    slug: generateJobSlug(company, title),
                    roles: extractRolesFromTitle(title),
                    qualification: 'Any Graduate',
                    locations: ['India'],
                    experience: parseExperienceFromText(title),
                    employmentType: 'Full-time',
                    description: title,
                    skills: [],
                    applyLink: sourceUrl,
                    category: detectCategory(title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date()
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (OffCampus): ${company} - ${title}`);
            } catch (e) {
                console.error('[Scraper] Error saving OffCampus:', e);
            }
        }
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] OffCampus error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// FreshersNow Lightweight Scraper
async function scrapeFreshersNowLightweight(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from FreshersNow...');
    try {
        const { data } = await axios.get('https://www.freshersnow.com/off-campus-drives/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            },
            timeout: 15000
        });

        const $ = cheerio.load(data);
        const rows = $('table tr').toArray().filter(r => $(r).find('td').length >= 2).slice(1, 15);
        let newJobsCount = 0;
        await connectDB();

        for (const row of rows) {
            try {
                const cells = $(row).find('td');
                const companyRaw = $(cells[0]).text().trim();
                const title = $(cells[1]).text().trim();
                const sourceUrl = $(cells[1]).find('a').attr('href');

                if (!companyRaw || !sourceUrl) continue;
                if (!isITJob(title)) continue;

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                const company = normalizeCompanyName(companyRaw);
                const existingSimilar = await (Job as any).findSimilar({ company, title });
                if (existingSimilar) continue;

                const newJob = new Job({
                    company,
                    title,
                    slug: generateJobSlug(company, title),
                    roles: extractRolesFromTitle(title),
                    qualification: 'BE/B.Tech/MCA/Any Graduate',
                    locations: ['India'],
                    experience: parseExperienceFromText(title),
                    employmentType: 'Full-time',
                    description: title,
                    skills: [],
                    applyLink: sourceUrl,
                    category: detectCategory(title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    postedDate: new Date()
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (FreshersNow): ${company} - ${title}`);
            } catch (e) {
                console.error('[Scraper] Error saving FreshersNow:', e);
            }
        }
        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] FreshersNow error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// Main trigger function
export async function triggerLightweightScraping() {
    console.log('[Automation] Starting lightweight API-based scraping in parallel...');

    const scraperMap: Record<string, () => Promise<ScraperResult>> = {
        jobicy: scrapeJobicy,
        wwr: scrapeWWR,
        himalayas: scrapeSimpleSource,
        adzuna: scrapeAdzuna,
        remotive: scrapeRemotive,
        jsearch: scrapeJSearch,
        foundthejob: scrapeFoundTheJob,
        offcampus: scrapeOffCampusLightweight,
        freshersnow: scrapeFreshersNowLightweight
    };

    const keys = Object.keys(scraperMap);
    const promises = keys.map(key => scraperMap[key]());

    const settleResults = await Promise.allSettled(promises);

    const results: Record<string, ScraperResult> = {};
    let totalCount = 0;

    settleResults.forEach((result, index) => {
        const key = keys[index];
        if (result.status === 'fulfilled') {
            results[key] = result.value;
            totalCount += result.value.count;
        } else {
            console.error(`[Scraper] ${key} failed:`, result.reason);
            results[key] = { count: 0, success: false, error: String(result.reason) };
        }
    });

    return {
        ...results,
        total: totalCount
    };
}
