import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { generateSlug } from '../utils';

const parser = new RSSParser();

export async function automateContentFetch() {
    await dbConnect();
    console.log('--- STARTING MONGODB AUTOMATION CYCLE ---');

    const sources = [
        { url: 'https://www.ncs.gov.in/Pages/RSS.aspx', type: 'JOB', category: 'Govt' },
        // Add more RSS feeds here
    ];

    for (const source of sources) {
        try {
            // Note: In a browser/Vercel serverless environment, some RSS feeds might block requests
            // We wrap this in a try-catch to ensure one failure doesn't stop the whole process
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // Create a unique slug
                const slug = generateSlug(item.title);

                // Prevent Duplicates
                const existingJob = await Job.findOne({ slug });
                if (existingJob) continue;

                // Auto-determine category if not set
                let finalCategory = source.category;
                if (item.title.toLowerCase().includes('result')) finalCategory = 'Result';
                if (item.title.toLowerCase().includes('admit card') || item.title.toLowerCase().includes('hall ticket')) finalCategory = 'Admit Card';

                // Save to MongoDB
                await Job.create({
                    title: item.title,
                    slug: slug,
                    organization: 'National Career Service', // This is a placeholder, real parsing would extract this
                    category: finalCategory,
                    source: item.link,
                    description: item.contentSnippet || item.content,
                    status: 'APPROVED',
                    isFeatured: false,
                    state: 'All India', // Default, would need NLP to extract state
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days expiry
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
