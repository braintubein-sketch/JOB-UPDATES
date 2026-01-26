import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { generateSlug } from '../utils';
import { autoPostNewJobs } from './social-poster';

const parser = new RSSParser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 10000,
});

// ULTIMATE SOURCE LIST - Mix of News & Direct Portals
const SOURCES = [
    // Times of India (Education/Jobs) - Very Reliable
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'Times of India Jobs', category: 'Private' },
    // Hindustan Times (Education)
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'Hindustan Times', category: 'Govt' },
    // Zee News (Employment)
    { url: 'https://zeenews.india.com/rss/employment.xml', name: 'Zee News Employment', category: 'Govt' },
    // Indian Express (Jobs)
    { url: 'https://indianexpress.com/section/jobs/feed/', name: 'Indian Express Jobs', category: 'Govt' }
];

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== AUTOMATION CYCLE STARTED ===');

    let newJobsCount = 0;
    let errors: string[] = [];

    for (const source of SOURCES) {
        try {
            console.log(`Fetching from: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // 1. FILTER: Only keep actual job-related news
                const titleLower = item.title.toLowerCase();

                // CLEAN TITLE: Remove junk
                const cleanTitle = item.title
                    .replace(/\(Apply Online\)/gi, '')
                    .replace(/Notification/gi, '')
                    .replace(/Recruitment/gi, '')
                    .trim();

                const isJobRelated = titleLower.includes('recruitment') ||
                    titleLower.includes('vacancy') ||
                    titleLower.includes('apply') ||
                    titleLower.includes('hiring') ||
                    titleLower.includes('jobs') ||
                    titleLower.includes('admit card') ||
                    titleLower.includes('result');

                if (!isJobRelated) continue;

                const slug = generateSlug(item.title);
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // 2. CATEGORIZE
                let category = source.category;
                if (titleLower.includes('result')) category = 'Result';
                else if (titleLower.includes('admit card')) category = 'Admit Card';
                else if (titleLower.includes('bank')) category = 'Banking';
                else if (titleLower.includes('railway')) category = 'Railway';

                // Extract Real Organization from Title (e.g. "SBI Recruitment 2026..." -> "SBI")
                let realOrg = cleanTitle.split(' ')[0];
                if (cleanTitle.includes('Railway')) realOrg = 'Indian Railways';
                else if (cleanTitle.includes('Bank')) realOrg = 'Banking Sector';
                else if (source.name.includes('Times') || source.name.includes('Hindustan')) {
                    // For news feeds, we must guess broadly if we can't find specific org
                    if (realOrg.length < 3) realOrg = 'Govt Recruitment';
                } else {
                    realOrg = source.name;
                }

                await Job.create({
                    title: cleanTitle,
                    slug: slug,
                    organization: realOrg,
                    category: category,
                    source: item.link,
                    applyLink: item.link,
                    description: item.contentSnippet || item.content || 'Read full details at source.',
                    status: 'PUBLISHED',
                    location: 'India',
                    lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
                });

                newJobsCount++;
                console.log(`+ NEW: ${item.title}`);
            }
        } catch (err: any) {
            console.error(`Error fetching from ${source.name}:`, err.message);
            errors.push(`${source.name}: ${err.message}`);
        }
    }

    // 3. AUTO-POST TO SOCIAL MEDIA
    let postedCount = 0;
    if (newJobsCount > 0) {
        console.log('Triggering Social Media Auto-Post...');
        postedCount = await autoPostNewJobs();
        console.log(`Posted ${postedCount} updates to social media.`);
    }

    console.log(`=== CYLCE DONE. Added ${newJobsCount} jobs.`);
    return { newJobs: newJobsCount, posted: postedCount, errors: errors.length > 0 ? errors : undefined };
}
