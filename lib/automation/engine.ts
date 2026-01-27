/**
 * INTELLIGENT JOB FETCHER ENGINE
 * Production-grade automation for fetching, classifying, and storing jobs
 * 
 * Features:
 * - Multi-source RSS/API fetching
 * - Intelligent classification
 * - Duplicate prevention with hash tracking
 * - Quality validation
 * - Auto Telegram posting
 * - Comprehensive logging
 */

import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { Result, AdmitCard, AutomationLog, ContentHash } from '../../models/Automation';
import { generateSlug } from '../utils';
import { classifyJob, generateJobHash, validateJobQuality, classifyJobCategory, detectExperienceLevel, detectLocation } from './classifier';

const parser = new RSSParser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 20000,
});

// ============================================
// SOURCE CONFIGURATION
// ============================================

interface FeedSource {
    url: string;
    name: string;
    defaultCategory: 'Govt' | 'Private' | 'IT' | 'Banking' | 'Railway';
    priority: number;
    fetchInterval: 'hourly' | '2hours' | '6hours';
}

const JOB_SOURCES: FeedSource[] = [
    // Government & Official News Sources
    { url: 'https://www.indiatoday.in/rss/1206584', name: 'India Today Education', defaultCategory: 'Govt', priority: 1, fetchInterval: '2hours' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs', defaultCategory: 'Govt', priority: 1, fetchInterval: '2hours' },
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Jobs', defaultCategory: 'Private', priority: 2, fetchInterval: '2hours' },
    { url: 'https://www.financialexpress.com/jobs/feed/', name: 'Financial Express', defaultCategory: 'Private', priority: 2, fetchInterval: '2hours' },
    { url: 'https://www.indiatvnews.com/education/rss', name: 'IndiaTV Education', defaultCategory: 'Govt', priority: 1, fetchInterval: '2hours' },

    // IT & Private Sector
    { url: 'https://www.apna.co/blog/feed/', name: 'Apna Jobs', defaultCategory: 'Private', priority: 2, fetchInterval: 'hourly' },

    // Banking Focus
    // { url: 'https://bankersadda.in/feed/', name: 'Bankers Adda', defaultCategory: 'Banking', priority: 1, fetchInterval: '2hours' },
];

// ============================================
// OFFICIAL LINK EXTRACTION
// ============================================

const NEWS_DOMAINS_BLACKLIST = [
    'timesofindia', 'indiatimes', 'hindustantimes', 'jagranjosh', 'careerindia',
    'indiatoday', 'shiksha.com', 'collegedunia.com', 'sarkariresult', 'freejobalert',
    'fresherslive', 'ambitionbox', 'glassdoor', 'naukri.com', 'monsterindia',
    'indiatvnews', 'facebook.com', 'twitter.com', 't.me', 'google.com', 'whatsapp.com',
    'youtube.com', 'linkedin.com', 'instagram.com', 'entrancezone', 'aglasem',
    'employmentnews', 'india.com', 'moneycontrol', 'ndtv', 'news18', 'zeenews'
];

async function extractOfficialLink(newsUrl: string): Promise<string> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(newsUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html',
            }
        });
        clearTimeout(timeout);

        if (!response.ok) return newsUrl;
        const html = await response.text();

        // Extract all links
        const linkPattern = /href=["'](https?:\/\/[^"']+)["']/gi;
        let match;
        const allLinks: string[] = [];
        while ((match = linkPattern.exec(html)) !== null) {
            allLinks.push(match[1]);
        }

        // Filter out news domains
        const potentialLinks = allLinks.filter(link => {
            const lower = link.toLowerCase();
            return !NEWS_DOMAINS_BLACKLIST.some(d => lower.includes(d));
        });

        // Priority 1: Government domains
        const govPatterns = [/\.gov\.in/i, /\.nic\.in/i, /\.res\.in/i, /\.ac\.in/i, /ibps\.in/i];
        for (const pattern of govPatterns) {
            const found = potentialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // Priority 2: Career portals
        const careerPatterns = [/careers\./i, /\/careers\//i, /myworkdayjobs/i, /taleo\.net/i];
        for (const pattern of careerPatterns) {
            const found = potentialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // Priority 3: PDF notifications
        const pdfLink = potentialLinks.find(link => link.toLowerCase().endsWith('.pdf'));
        if (pdfLink) return pdfLink;

        return newsUrl;
    } catch {
        return newsUrl;
    }
}

// ============================================
// RELEVANCY FILTER
// ============================================

function isJobRelevant(title: string, content: string = ''): { relevant: boolean; reason?: string } {
    const text = (title + ' ' + content).toLowerCase();

    // Must contain job-related keywords
    const jobKeywords = ['recruitment', 'vacancy', 'hiring', 'apply', 'admit', 'result', 'notification', 'jobs', 'posts', 'career', 'opening'];
    const hasJobKeyword = jobKeywords.some(k => text.includes(k));

    if (!hasJobKeyword) {
        return { relevant: false, reason: 'No job-related keywords' };
    }

    // Must NOT contain irrelevant keywords
    const blacklistKeywords = [
        'modi', 'gandhi', 'politics', 'election', 'viral', 'opinion', 'arrest', 'dead', 'death',
        'accident', 'ipl', 'cricket', 'bollywood', 'movie', 'killed', 'protest', 'strike',
        'murder', 'rape', 'scam', 'fraud', 'fake', 'hoax', 'rumor', 'entertainment',
        'celebrity', 'gossip', 'lifestyle', 'fashion', 'recipe', 'travel blog'
    ];

    const hasBlacklist = blacklistKeywords.some(k => text.includes(k));
    if (hasBlacklist) {
        return { relevant: false, reason: 'Contains blacklisted content' };
    }

    return { relevant: true };
}

// ============================================
// MAIN FETCH ENGINE
// ============================================

export interface FetchResult {
    success: boolean;
    stats: {
        fetched: number;
        added: number;
        skipped: number;
        duplicates: number;
        errors: number;
    };
    sources: string[];
    errors: Array<{ source: string; message: string }>;
    duration: number;
}

export async function runJobFetchCycle(sourceFilter?: 'hourly' | '2hours' | '6hours'): Promise<FetchResult> {
    const startTime = Date.now();
    await dbConnect();

    const stats = { fetched: 0, added: 0, skipped: 0, duplicates: 0, errors: 0 };
    const errors: Array<{ source: string; message: string }> = [];
    const processedSources: string[] = [];

    // Filter sources by interval if specified
    const sources = sourceFilter
        ? JOB_SOURCES.filter(s => s.fetchInterval === sourceFilter)
        : JOB_SOURCES;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 JOB FETCH CYCLE STARTED - ${new Date().toISOString()}`);
    console.log(`📡 Processing ${sources.length} sources...`);
    console.log(`${'='.repeat(60)}\n`);

    for (const source of sources) {
        try {
            console.log(`📡 Fetching: ${source.name}`);
            processedSources.push(source.name);

            const feed = await parser.parseURL(source.url);
            const items = feed.items || [];

            for (const item of items) {
                if (!item.title || !item.link) continue;
                stats.fetched++;

                // 1. Relevancy Check
                const relevancy = isJobRelevant(item.title, item.contentSnippet);
                if (!relevancy.relevant) {
                    stats.skipped++;
                    continue;
                }

                // 2. Generate hash for duplicate check
                const contentHash = generateJobHash(item.title, source.name, item.pubDate);

                // 3. Check if already exists
                const existingHash = await ContentHash.findOne({ hash: contentHash });
                if (existingHash) {
                    stats.duplicates++;
                    continue;
                }

                // 4. Extract official link
                const officialLink = await extractOfficialLink(item.link);

                // 5. Classify the job
                const fullText = `${item.title} ${item.contentSnippet || ''} ${item.content || ''}`;
                const classification = classifyJob({
                    title: item.title,
                    organization: source.name,
                    content: fullText,
                    applyLink: officialLink,
                    defaultCategory: source.defaultCategory
                });

                // 6. Quality check
                if (!classification.quality.isValid) {
                    console.log(`⚠️ Low quality: ${item.title.substring(0, 50)}... - ${classification.quality.errors.join(', ')}`);
                    stats.skipped++;
                    continue;
                }

                // 7. Extract organization from title
                const orgMatch = item.title.match(/^([^:|\-–]+)/);
                const organization = orgMatch ? orgMatch[1].trim().replace(/recruitment|notification|vacancy/gi, '').trim() : source.name;

                // 8. Create slug
                const slug = generateSlug(item.title).substring(0, 80);
                const existingJob = await Job.findOne({ slug });
                if (existingJob) {
                    stats.duplicates++;
                    continue;
                }

                // 9. Handle based on category
                if (classification.category === 'Result') {
                    await Result.create({
                        title: item.title,
                        slug,
                        examName: item.title,
                        organization,
                        releaseDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                        resultLink: officialLink,
                        source: source.url,
                        sourceUrl: item.link,
                        description: item.contentSnippet,
                        contentHash,
                        status: 'PUBLISHED'
                    });
                } else if (classification.category === 'Admit Card') {
                    await AdmitCard.create({
                        title: item.title,
                        slug,
                        examName: item.title,
                        organization,
                        releaseDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                        downloadLink: officialLink,
                        source: source.url,
                        sourceUrl: item.link,
                        description: item.contentSnippet,
                        contentHash,
                        status: 'PUBLISHED'
                    });
                } else {
                    // Regular Job
                    await Job.create({
                        title: item.title,
                        slug,
                        organization,
                        postName: item.title.replace(organization, '').replace(/recruitment|notification|vacancy|for/gi, '').trim() || 'Various Posts',
                        category: classification.category,
                        subCategory: classification.subCategory,
                        experience: classification.experienceLevel,
                        location: classification.location.location,
                        state: classification.location.state,
                        qualification: 'See Notification',
                        source: source.url,
                        sourceUrl: item.link,
                        applyLink: officialLink,
                        description: item.contentSnippet || item.title,
                        tags: classification.tags,
                        status: 'PUBLISHED',
                        publishedAt: new Date()
                    });
                }

                // 10. Save hash to prevent future duplicates
                await ContentHash.create({
                    hash: contentHash,
                    contentType: classification.category === 'Result' ? 'RESULT' : classification.category === 'Admit Card' ? 'ADMITCARD' : 'JOB',
                    title: item.title
                });

                console.log(`✅ Added: [${classification.category}] ${organization} - ${item.title.substring(0, 40)}...`);
                stats.added++;

                // Rate limiting
                await new Promise(r => setTimeout(r, 500));
            }

        } catch (err: any) {
            console.error(`❌ Error fetching ${source.name}:`, err.message);
            errors.push({ source: source.name, message: err.message });
            stats.errors++;
        }
    }

    const duration = Date.now() - startTime;

    // Log the run
    await AutomationLog.create({
        runType: 'FETCH_JOBS',
        status: errors.length === sources.length ? 'FAILED' : 'COMPLETED',
        stats,
        sources: processedSources,
        errorDetails: errors.map(e => ({ ...e, timestamp: new Date() })),
        duration
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ FETCH CYCLE COMPLETED in ${(duration / 1000).toFixed(1)}s`);
    console.log(`📊 Stats: Added=${stats.added}, Duplicates=${stats.duplicates}, Skipped=${stats.skipped}, Errors=${stats.errors}`);
    console.log(`${'='.repeat(60)}\n`);

    return {
        success: errors.length < sources.length,
        stats,
        sources: processedSources,
        errors,
        duration
    };
}

// Export for cron jobs
export { extractOfficialLink, isJobRelevant };
