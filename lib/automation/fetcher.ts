import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job, ActivityLog } from '../../models/Job';
import { generateSlug } from '../utils';
import { autoPostNewJobs, repostUrgentJobs } from './social-poster';

const parser = new RSSParser();

// Official RSS/API sources
const SOURCES = [
    { url: 'https://www.ncs.gov.in/Pages/RSS.aspx', name: 'National Career Service', category: 'Govt' },
    // Add more official sources here
    // { url: 'https://...',  name: '...', category: '...' },
];

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== AUTOMATION CYCLE STARTED ===');

    let newJobsCount = 0;
    let updatedJobsCount = 0;
    let expiredJobsCount = 0;

    // 1. FETCH NEW JOBS FROM SOURCES
    for (const source of SOURCES) {
        try {
            console.log(`Fetching from: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                const slug = generateSlug(item.title);

                // Check for duplicates
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // Auto-categorize based on title keywords
                let category = source.category;
                const titleLower = item.title.toLowerCase();
                if (titleLower.includes('result') || titleLower.includes('merit list')) category = 'Result';
                else if (titleLower.includes('admit card') || titleLower.includes('hall ticket')) category = 'Admit Card';
                else if (titleLower.includes('railway') || titleLower.includes('rrb')) category = 'Railway';
                else if (titleLower.includes('bank') || titleLower.includes('ibps') || titleLower.includes('sbi')) category = 'Banking';
                else if (titleLower.includes('army') || titleLower.includes('navy') || titleLower.includes('air force') || titleLower.includes('defence')) category = 'Defence';
                else if (titleLower.includes('teacher') || titleLower.includes('ctet') || titleLower.includes('tet')) category = 'Teaching';

                // Create new job
                const newJob = await Job.create({
                    title: item.title,
                    slug: slug,
                    organization: source.name,
                    category: category,
                    source: item.link,
                    applyLink: item.link,
                    description: item.contentSnippet || item.content,
                    shortDescription: item.contentSnippet?.substring(0, 160),
                    status: 'PUBLISHED', // Auto-publish from trusted sources
                    telegramPosted: false,
                    whatsappPosted: false,
                    location: 'All India',
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });

                newJobsCount++;
                console.log(`+ NEW: ${item.title}`);

                // Log activity
                await ActivityLog.create({
                    action: 'JOB_CREATED',
                    entity: 'Job',
                    entityId: newJob._id,
                    details: `Auto-fetched from ${source.name}`,
                    status: 'SUCCESS',
                });
            }
        } catch (err) {
            console.error(`Error fetching from ${source.name}:`, err);
            await ActivityLog.create({
                action: 'FETCH_ERROR',
                entity: 'Source',
                details: `Failed to fetch from ${source.name}: ${err}`,
                status: 'FAILED',
            });
        }
    }

    // 2. AUTO-EXPIRE OLD JOBS
    const now = new Date();
    const expiredResult = await Job.updateMany(
        {
            $or: [
                { expiresAt: { $lt: now }, status: 'PUBLISHED' },
                { lastDate: { $lt: now }, status: 'PUBLISHED' }
            ]
        },
        { status: 'EXPIRED' }
    );
    expiredJobsCount = expiredResult.modifiedCount;
    if (expiredJobsCount > 0) {
        console.log(`Expired ${expiredJobsCount} old jobs`);
    }

    // 3. MARK TODAY'S JOBS
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    await Job.updateMany({ isToday: true }, { isToday: false }); // Reset
    await Job.updateMany(
        { createdAt: { $gte: todayStart }, status: 'PUBLISHED' },
        { isToday: true }
    );

    // 4. AUTO-POST TO SOCIAL MEDIA
    const postedCount = await autoPostNewJobs();
    console.log(`Posted ${postedCount} jobs to social media`);

    // 5. REPOST URGENT JOBS (Last date soon)
    const repostedCount = await repostUrgentJobs();
    console.log(`Reposted ${repostedCount} urgent reminders`);

    console.log('=== AUTOMATION CYCLE COMPLETE ===');
    console.log(`Summary: ${newJobsCount} new, ${expiredJobsCount} expired, ${postedCount} posted`);

    return {
        newJobs: newJobsCount,
        expired: expiredJobsCount,
        posted: postedCount,
        reposted: repostedCount,
    };
}
