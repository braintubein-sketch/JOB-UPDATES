import axios from 'axios';
import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job, SiteUpdate } from '../../models/Job';

const parser = new RSSParser();

export async function automateContentFetch() {
    await dbConnect();
    console.log('--- STARTING AUTOMATION CYCLE ---');

    const sources = [
        { url: 'https://www.ncs.gov.in/Pages/RSS.aspx', type: 'JOB', category: 'Govt' },
        // In a real scenario, we'd add more official RSS links or API endpoints
    ];

    for (const source of sources) {
        try {
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                // Prevent Duplicates
                const existingJob = await Job.findOne({ slug });
                if (existingJob) continue;

                // Smart Parsing (Simulated as we only use RSS content)
                await Job.create({
                    title: item.title,
                    slug: slug,
                    organization: 'National Career Service',
                    category: source.category,
                    source: item.link,
                    description: item.contentSnippet || item.content,
                    status: 'APPROVED',
                    importantDates: { posted: item.pubDate },
                });

                console.log(`+ New Job Added: ${item.title}`);
            }
        } catch (err) {
            console.error(`Error fetching from ${source.url}:`, err);
        }
    }

    // Auto-Expire Jobs
    const now = new Date();
    await Job.updateMany(
        { expiresAt: { $lt: now }, status: 'APPROVED' },
        { status: 'EXPIRED' }
    );

    console.log('--- AUTOMATION CYCLE COMPLETE ---');
}
