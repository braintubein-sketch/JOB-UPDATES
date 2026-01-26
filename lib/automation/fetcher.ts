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

const SOURCES = [
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'Times of India Jobs', category: 'Private' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'Hindustan Times', category: 'Govt' },
];

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== AUTOMATION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`Fetching from: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // 1. CLEAN TITLE
                const cleanTitle = item.title
                    .replace(/\(Apply Online\)/gi, '')
                    .replace(/Notification/gi, '')
                    .replace(/Recruitment/gi, '')
                    .trim();

                const titleLower = cleanTitle.toLowerCase();
                const isJobRelated = titleLower.includes('recruitment') ||
                    titleLower.includes('vacancy') ||
                    titleLower.includes('apply') ||
                    titleLower.includes('hiring') ||
                    titleLower.includes('jobs');

                if (!isJobRelated) continue;

                const slug = generateSlug(cleanTitle);
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // 2. EXTRACT ORG
                let realOrg = cleanTitle.split(' ')[0];
                if (cleanTitle.includes('Railway')) realOrg = 'Indian Railways';
                else if (cleanTitle.includes('Bank')) realOrg = 'Banking Sector';
                else if (realOrg.length < 3) realOrg = 'Govt of India';

                await Job.create({
                    title: cleanTitle,
                    slug: slug,
                    organization: realOrg,
                    category: source.category,
                    source: item.link,
                    applyLink: item.link,
                    description: item.contentSnippet || item.content || 'Official notification details.',
                    status: 'PUBLISHED',
                    location: 'India',
                    lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                });

                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`Error fetching from ${source.name}:`, err.message);
        }
    }

    // ALWAYS TRY TO POST UNPOSTED JOBS
    // This ensures jobs from previous failed cycles eventually get posted
    const posted = await autoPostNewJobs();

    return { newJobs: newJobsCount, posted };
}
