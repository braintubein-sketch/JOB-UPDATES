import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { generateSlug } from '../utils';
import { autoPostNewJobs } from './social-poster';

const parser = new RSSParser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 15000,
});

const SOURCES = [
    // GENERAL & NEWS (Reliable mirrors)
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Education', defaultCategory: 'Private' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs', defaultCategory: 'Govt' },
    { url: 'https://www.jagranjosh.com/rss/josh/sarkari-naukri.xml', name: 'Jagran Josh Sarkari', defaultCategory: 'Govt' },

    // SECTOR SPECIFIC NEWS FEEDS
    { url: 'https://www.careerindia.com/rss/news-rss.xml', name: 'CareerIndia News', defaultCategory: 'Govt' },
    { url: 'https://www.indiatoday.in/rss/1206584', name: 'India Today Education', defaultCategory: 'Govt' },

    // STATE & RAILWAY (via specialized news sections)
    { url: 'https://zeenews.india.com/rss/india-news.xml', name: 'Zee Education', defaultCategory: 'Govt' },
];

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== GLOBAL AUTOMATION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`📡 Checking Source: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // 1. CLEAN TITLE
                let cleanTitle = item.title
                    .replace(/\(Apply Online\)/gi, '')
                    .replace(/Notification/gi, '')
                    .replace(/Recruitment/gi, '')
                    .replace(/Released/gi, '')
                    .replace(/Out Now|Declared/gi, '')
                    .trim();

                const titleLower = cleanTitle.toLowerCase();

                // 2. SMART CATEGORIZATION
                let detectedCategory: any = source.defaultCategory;

                if (titleLower.includes('result') || titleLower.includes('merit list') || titleLower.includes('score card')) {
                    detectedCategory = 'Result';
                }
                else if (titleLower.includes('admit card') || titleLower.includes('hall ticket') || titleLower.includes('call letter')) {
                    detectedCategory = 'Admit Card';
                }
                else if (titleLower.includes('railway') || titleLower.includes('rrb') || titleLower.includes('rrc')) {
                    detectedCategory = 'Railway';
                }
                else if (titleLower.includes('bank') || titleLower.includes('ibps') || titleLower.includes('sbi') || titleLower.includes('rbi')) {
                    detectedCategory = 'Banking';
                }
                else if (titleLower.includes('ssc') || titleLower.includes('cgl') || titleLower.includes('chsl') || titleLower.includes('mts')) {
                    detectedCategory = 'Govt'; // Default to Govt but will show specialized tags
                }
                else if (titleLower.includes('upsc') || titleLower.includes('ias') || titleLower.includes('nda')) {
                    detectedCategory = 'Govt';
                }
                else if (titleLower.includes('teacher') || titleLower.includes('kvs') || titleLower.includes('tet') || titleLower.includes('ctet')) {
                    detectedCategory = 'Teaching';
                }
                else if (titleLower.includes('psu') || titleLower.includes('ntpc') || titleLower.includes('sail')) {
                    detectedCategory = 'PSU';
                }

                // 3. RELEVANCY FILTER
                const isRelevant = titleLower.includes('recruitment') ||
                    titleLower.includes('vacancy') ||
                    titleLower.includes('apply') ||
                    titleLower.includes('hiring') ||
                    titleLower.includes('jobs') ||
                    titleLower.includes('result') ||
                    titleLower.includes('admit card') ||
                    titleLower.includes('scorecard') ||
                    titleLower.includes('hall ticket') ||
                    titleLower.includes('examination');

                if (!isRelevant) continue;

                const slug = generateSlug(cleanTitle);
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // 4. ORGANIZATION EXTRACTION
                let realOrg = cleanTitle.split(' ')[0];
                if (titleLower.includes('railway')) realOrg = 'Indian Railways';
                else if (titleLower.includes('bank')) realOrg = 'Banking Sector';
                else if (titleLower.includes('ssc')) realOrg = 'Staff Selection Commission';
                else if (titleLower.includes('upsc')) realOrg = 'Union Public Service Commission';
                else if (titleLower.includes('ibps')) realOrg = 'IBPS';
                else if (titleLower.includes('sbi')) realOrg = 'State Bank of India';
                else if (realOrg.length < 3) realOrg = 'Education Board';

                // 5. SAVE TO DATABASE
                await Job.create({
                    title: cleanTitle,
                    slug: slug,
                    organization: realOrg,
                    category: detectedCategory,
                    source: item.link,
                    applyLink: item.link,
                    description: item.contentSnippet || item.content || 'Latest recruitment notification details.',
                    status: 'PUBLISHED',
                    location: 'India',
                    lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Default 25 days
                });

                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`⚠️ Source Failure [${source.name}]:`, err.message);
        }
    }

    // TRIGGER SOCIAL POSTING
    const posted = await autoPostNewJobs();

    console.log(`✅ CYCLE COMPLETE: Found ${newJobsCount} new, Posted ${posted} to Telegram.`);
    return { newJobs: newJobsCount, posted };
}
