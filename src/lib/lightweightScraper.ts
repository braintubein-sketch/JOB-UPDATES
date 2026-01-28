import axios from 'axios';
import * as cheerio from 'cheerio';
import {
    isITJob,
    detectCategory,
    parseExperienceFromText,
    extractSkillsFromText,
    extractLocationsFromText,
    normalizeCompanyName
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

// RemoteOK API - Free, no browser needed
async function scrapeRemoteOK(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from RemoteOK API...');
    try {
        const { data } = await axios.get('https://remoteok.com/api', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 15000
        });

        // First element is metadata, skip it
        const jobs = data.slice(1, 11); // Get top 10 jobs
        let newJobsCount = 0;

        await connectDB();

        for (const job of jobs) {
            try {
                const sourceUrl = `https://remoteok.com/remote-jobs/${job.id}`;

                // Check if already exists
                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                // Filter for IT jobs
                const tags = (job.tags || []).join(' ');
                if (!isITJob(job.position + ' ' + tags)) continue;

                const company = normalizeCompanyName(job.company || 'Unknown');
                const skills = job.tags || [];

                // Generate slug
                const slug = `${company}-${job.position}`.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 100);

                const newJob = new Job({
                    company,
                    title: job.position,
                    slug,
                    qualification: 'Any Graduate',
                    locations: ['Remote'],
                    experience: { min: 0, max: 5, label: 'Entry-Mid Level' },
                    employmentType: 'Full-time',
                    description: (job.description || '').substring(0, 1000),
                    skills,
                    applyLink: job.url || sourceUrl,
                    category: detectCategory(job.position, skills),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    companyLogo: job.company_logo || getCompanyLogo(company),
                    postedDate: new Date(job.date || Date.now()),
                    salary: job.salary || ''
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (RemoteOK): ${company} - ${job.position}`);
            } catch (err) {
                console.error('[Scraper] Error saving RemoteOK job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] RemoteOK error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// Adzuna API - Free tier available
async function scrapeAdzuna(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Adzuna...');
    try {
        const appId = process.env.ADZUNA_APP_ID || '';
        const appKey = process.env.ADZUNA_APP_KEY || '';

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

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                const company = normalizeCompanyName(job.company?.display_name || 'Unknown');

                // Generate slug
                const slug = `${company}-${job.title}`.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 100);

                const newJob = new Job({
                    company,
                    title: job.title,
                    slug,
                    qualification: 'Any Graduate',
                    locations: [job.location?.display_name || 'India'],
                    experience: { min: 0, max: 5, label: 'Entry Level' },
                    employmentType: job.contract_type || 'Full-time',
                    description: (job.description || '').substring(0, 1000),
                    skills: extractSkillsFromText(job.description || ''),
                    applyLink: sourceUrl,
                    category: detectCategory(job.title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    companyLogo: getCompanyLogo(company),
                    postedDate: new Date(job.created || Date.now()),
                    salary: job.salary_min ? `₹${job.salary_min} - ₹${job.salary_max}` : ''
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

// GitHub Jobs alternative - Arbeitnow (free API)
async function scrapeArbeitnow(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Arbeitnow...');
    try {
        const { data } = await axios.get('https://www.arbeitnow.com/api/job-board-api', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 15000
        });

        let newJobsCount = 0;
        await connectDB();

        const jobs = (data.data || []).slice(0, 10);

        for (const job of jobs) {
            try {
                const sourceUrl = job.url;

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                // Filter for IT/Tech jobs
                const tags = (job.tags || []).join(' ');
                if (!isITJob(job.title + ' ' + tags)) continue;

                const company = normalizeCompanyName(job.company_name || 'Unknown');

                // Generate slug
                const slug = `${company}-${job.title}`.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 100);

                const newJob = new Job({
                    company,
                    title: job.title,
                    slug,
                    qualification: 'Any Graduate',
                    locations: [job.location || 'Remote'],
                    experience: { min: 0, max: 5, label: 'Entry Level' },
                    employmentType: job.job_types?.includes('full_time') ? 'Full-time' : 'Contract',
                    description: (job.description || '').substring(0, 1000),
                    skills: job.tags || [],
                    applyLink: sourceUrl,
                    category: detectCategory(job.title, job.tags || []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    companyLogo: getCompanyLogo(company),
                    postedDate: new Date(job.created_at || Date.now()),
                    isRemote: job.remote || false
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (Arbeitnow): ${company} - ${job.title}`);
            } catch (err) {
                console.error('[Scraper] Error saving Arbeitnow job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] Arbeitnow error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// Simple HTTP scrape of a reliable source (no heavy JS)
async function scrapeSimpleSource(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from Himalayas...');
    try {
        // Use a simple, reliable job board
        const { data } = await axios.get('https://himalayas.app/jobs/api?limit=10', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
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

                // Generate slug from title and company
                const slug = `${company}-${job.title}`.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 100);

                // Handle seniority - could be string or array
                const seniorityLabel = Array.isArray(job.seniority)
                    ? job.seniority[0] || 'Entry Level'
                    : job.seniority || 'Entry Level';

                const newJob = new Job({
                    company,
                    title: job.title,
                    slug,
                    qualification: 'Any Graduate',
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
                    companyLogo: job.companyLogo || getCompanyLogo(company),
                    postedDate: new Date(job.pubDate || Date.now()),
                    salary: job.minSalary ? `$${job.minSalary} - $${job.maxSalary}` : ''
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
async function scrapeFindWork(): Promise<ScraperResult> {
    console.log('[Scraper] Fetching from FindWork.dev...');
    try {
        const { data } = await axios.get('https://findwork.dev/api/jobs/?search=developer', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        let newJobsCount = 0;
        await connectDB();

        for (const job of (data.results || []).slice(0, 10)) {
            try {
                const sourceUrl = job.url || `https://findwork.dev/job/${job.id}`;

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                if (!isITJob(job.role + ' ' + (job.keywords || []).join(' '))) continue;

                const company = normalizeCompanyName(job.company_name || 'Unknown');

                // Generate slug
                const slug = `${company}-${job.role}`.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 100);

                const newJob = new Job({
                    company,
                    title: job.role,
                    slug,
                    qualification: 'Any Graduate',
                    locations: [job.location || 'Remote'],
                    experience: { min: 0, max: 5, label: 'Entry Level' },
                    employmentType: job.employment_type || 'Full-time',
                    description: (job.text || '').substring(0, 1000),
                    skills: job.keywords || [],
                    applyLink: job.url || sourceUrl,
                    category: detectCategory(job.role, job.keywords || []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    companyLogo: job.company_logo || getCompanyLogo(company),
                    postedDate: new Date(job.date_posted || Date.now()),
                    isRemote: job.remote || false
                });

                await newJob.save();
                newJobsCount++;
                console.log(`[Scraper] Saved (FindWork): ${company} - ${job.role}`);
            } catch (err) {
                console.error('[Scraper] Error saving FindWork job:', err);
            }
        }

        return { count: newJobsCount, success: true };
    } catch (error: any) {
        console.error('[Scraper] FindWork error:', error.message);
        return { count: 0, success: false, error: error.message };
    }
}

// JSearch API (RapidAPI) - if configured
async function scrapeJSearch(): Promise<ScraperResult> {
    console.log('[Scraper] Checking JSearch...');
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
        console.log('[Scraper] RapidAPI key not configured, skipping JSearch...');
        return { count: 0, success: true };
    }

    try {
        const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
            params: {
                query: 'software developer in India',
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

                const existing = await Job.findOne({ sourceUrl });
                if (existing) continue;

                const company = normalizeCompanyName(job.employer_name || 'Unknown');

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
                    qualification: 'Any Graduate',
                    locations: [job.job_city || job.job_country || 'India'],
                    experience: { min: 0, max: 5, label: 'Entry Level' },
                    employmentType: job.job_employment_type || 'Full-time',
                    description: (job.job_description || '').substring(0, 1000),
                    skills: job.job_required_skills || [],
                    applyLink: sourceUrl,
                    category: detectCategory(job.job_title, []),
                    isVerified: true,
                    isActive: true,
                    source: 'automated',
                    sourceUrl,
                    companyLogo: job.employer_logo || getCompanyLogo(company),
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

// Main trigger function
export async function triggerLightweightScraping() {
    console.log('[Automation] Starting lightweight API-based scraping...');

    const results: Record<string, ScraperResult> = {};
    let totalCount = 0;

    // Run all lightweight scrapers - they're fast and don't use much memory
    try {
        results.remoteOK = await scrapeRemoteOK();
        totalCount += results.remoteOK.count;
    } catch (e: any) {
        results.remoteOK = { count: 0, success: false, error: e.message };
    }

    try {
        results.arbeitnow = await scrapeArbeitnow();
        totalCount += results.arbeitnow.count;
    } catch (e: any) {
        results.arbeitnow = { count: 0, success: false, error: e.message };
    }

    try {
        results.himalayas = await scrapeSimpleSource();
        totalCount += results.himalayas.count;
    } catch (e: any) {
        results.himalayas = { count: 0, success: false, error: e.message };
    }

    // Adzuna only if configured
    try {
        results.adzuna = await scrapeAdzuna();
        totalCount += results.adzuna.count;
    } catch (e: any) {
        results.adzuna = { count: 0, success: false, error: e.message };
    }

    // FindWork.dev
    try {
        results.findwork = await scrapeFindWork();
        totalCount += results.findwork.count;
    } catch (e: any) {
        results.findwork = { count: 0, success: false, error: e.message };
    }

    // JSearch (RapidAPI) - only if configured
    try {
        results.jsearch = await scrapeJSearch();
        totalCount += results.jsearch.count;
    } catch (e: any) {
        results.jsearch = { count: 0, success: false, error: e.message };
    }

    return {
        ...results,
        total: totalCount
    };
}
