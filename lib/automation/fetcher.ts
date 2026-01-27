import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { generateSlug } from '../utils';
import { autoPostNewJobs } from './social-poster';
import { JobDataNormalizer } from './normalizer';

const parser = new RSSParser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 15000,
});

const SOURCES = [
    { url: 'https://www.indiatoday.in/rss/1206584', name: 'India Today Education', defaultCategory: 'Govt' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs Portal', defaultCategory: 'Govt' },
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Jobs Feed', defaultCategory: 'Private' },
    { url: 'https://www.financialexpress.com/jobs/feed/', name: 'Financial Express Careers', defaultCategory: 'Private' },
    { url: 'https://www.indiatvnews.com/education/rss', name: 'IndiaTV Education', defaultCategory: 'Govt' },
    { url: 'https://www.apna.co/blog/feed/', name: 'Apna Jobs Blog', defaultCategory: 'Private' },
];

/**
 * DEEP SCRAPER: Improved Logic to filter news domains and find ACTUAL government/portal links
 */
async function extractOfficialLink(newsUrl: string): Promise<string> {
    try {
        const response = await fetch(newsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        });

        if (!response.ok) return newsUrl;
        const html = await response.text();

        // 1. EXTRACT ALL LINKS
        const linkPattern = /href=["'](https?:\/\/[^"']+)["']/gi;
        let match;
        const allLinks: string[] = [];
        while ((match = linkPattern.exec(html)) !== null) {
            allLinks.push(match[1]);
        }

        // 2. EXCLUDE NEWS & COMPETITOR DOMAINS (Ensure we NEVER redirect to a job board or news site)
        const newsDomains = [
            'timesofindia', 'indiatimes', 'hindustantimes', 'jagranjosh', 'careerindia',
            'indiatoday', 'shiksha.com', 'collegedunia.com', 'sarkariresult', 'freejobalert',
            'fresherslive', 'ambitionbox', 'glassdoor', 'naukri.com', 'monsterindia',
            'indiatvnews', 'facebook.com', 'twitter.com', 't.me', 'google.com', 'whatsapp.com',
            'youtube.com', 'linkedin.com', 'instagram.com', 'entrancezone', 'aglasem',
            'employmentnews', 'india.com', 'moneycontrol', 'ndtv'
        ];

        const potentialOfficialLinks = allLinks.filter(link => {
            const lowerLink = link.toLowerCase();
            return !newsDomains.some(domain => lowerLink.includes(domain));
        });

        // 3. PRIORITY 1: Government domains
        const govPatterns = [/\.gov\.in/i, /\.nic\.in/i, /\.res\.in/i, /\.ac\.in/i, /\.edu\.in/i, /ibps\.in/i];
        for (const pattern of govPatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // 4. PRIORITY 2: Private Sector Career Portals (TCS, Infosys, Wipro, etc.)
        // Look for Workday, SuccessFactors, Taleo or domains containing "careers"
        const privatePatterns = [/careers\./i, /\.com\/careers/i, /tcs\.com/i, /infosys\.com/i, /wipro\.com/i, /myworkdayjobs/i, /successfactors/i, /taleo\.net/i];
        for (const pattern of privatePatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // 5. PRIORITY 3: PDF Files (Direct notifications)
        const pdfLink = potentialOfficialLinks.find(link => link.toLowerCase().endsWith('.pdf'));
        if (pdfLink) return pdfLink;

        // 6. PRIORITY 4: General Organization patterns
        const orgPatterns = [/recruitment/i, /apply/i, /login/i, /portal/i, /vacancy/i, /hiring/i];
        for (const pattern of orgPatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        return newsUrl; // Final fallback
    } catch {
        return newsUrl;
    }
}

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== ULTRA DEEP EXTRACTION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`📡 Fetching: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                const originalTitle = item.title;
                const titleLower = originalTitle.toLowerCase();

                // 1. RELEVANCY GUARD
                const essentialKeys = ['recruitment', 'vacancy', 'hiring', 'apply', 'admit', 'result', 'naukri', 'jobs', 'post'];
                const isJobRelated = essentialKeys.some(key => titleLower.includes(key));

                const negativeKeywords = ['modi', 'gandhi', 'uddhav', 'thackeray', 'corporator', 'arrested', 'dead', 'death', 'accident', 'politics', 'election', 'viral', 'opinion', 'disappeared', 'match', 'ipl', 'cricket', 'bollywood', 'movie', 'killed', 'protest', 'strike', 'pune', 'mumbai', 'police station', 'jail'];
                const isIrrelevant = negativeKeywords.some(key => titleLower.includes(key));

                if (!isJobRelated || isIrrelevant) continue;

                // 2. DEEP LINK FETCHING
                const officialLink = await extractOfficialLink(item.link);

                // 3. NORMALIZE & VALIDATE (The New Intelligence Layer)
                const rawData = {
                    title: originalTitle,
                    link: officialLink, // Use the detected official link
                    contentSnippet: item.contentSnippet,
                    content: item.content,
                    sourceName: source.name,
                    defaultCategory: source.defaultCategory
                };

                const normalized = JobDataNormalizer.normalize(rawData);

                // HARD RULE: REJECT if not official link
                if (!normalized.isOfficial) {
                    console.log(`❌ Rejected (Unofficial): ${normalized.organization} - ${normalized.applyLink}`);
                    continue;
                }

                // HARD RULE: REJECT if missing mandatory fields (checking validationErrors)
                if (normalized.validationErrors.length > 0) {
                    console.log(`❌ Rejected (Invalid Data): ${normalized.title} - ${normalized.validationErrors.join(', ')}`);
                    continue;
                }

                const slug = generateSlug(normalized.title).substring(0, 80);
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // CREATE JOB WITH STANDARDIZED DATA
                await Job.create({
                    title: normalized.title,
                    slug: slug,
                    organization: normalized.organization,
                    postName: normalized.postName,
                    vacancies: normalized.vacancies,
                    qualification: normalized.qualification,
                    ageLimit: normalized.ageLimit,
                    salary: normalized.salary,
                    location: normalized.location,
                    experience: normalized.experience,

                    lastDate: normalized.lastDate,
                    examDate: normalized.examDate,

                    category: normalized.category,

                    source: source.url,
                    sourceUrl: item.link, // Original Source URL
                    applyLink: normalized.applyLink,

                    description: normalized.description, // Smart Summary

                    status: normalized.status, // Should be PUBLISHED at this point

                    // Generated Metadata
                    howToApply: normalized.category === 'Result' ? 'Check your result on the official portal.' : normalized.category === 'Admit Card' ? 'Download your admit card from the official link.' : `Visit the official portal at ${normalized.applyLink} to apply.`,

                    publishedAt: new Date(),
                });

                console.log(`✅ Posted: ${normalized.organization} - ${normalized.postName}`);
                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`Error ${source.name}:`, err.message);
        }
    }

    const posted = await autoPostNewJobs();
    return { newJobs: newJobsCount, posted };
}
