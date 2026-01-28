// Job automation cron jobs
// This file sets up scheduled tasks for job fetching and management

import cron from 'node-cron';
import connectDB from './db';
import Job from '@/models/Job';
import { postJobToTelegram } from './telegram';
import { scrapeOffCampusJobs } from './scrapers/offCampus';
import { scrapeFreshersNow } from './scrapers/freshersNow';

// Check if we're in a Node.js environment (not edge)
const isNodeEnv = typeof process !== 'undefined' && process.versions?.node;

// Initialize cron jobs only in Node.js environment
export function initializeCronJobs() {
    if (!isNodeEnv) {
        console.log('Cron jobs not initialized (not in Node.js environment)');
        return;
    }

    console.log('Initializing cron jobs...');

    // Scrape new jobs every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('[Cron] Starting automated scraping...');
        await scrapeOffCampusJobs();
    });

    // Post unpublished jobs to Telegram every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('[Cron] Posting jobs to Telegram...');
        await triggerTelegramPost();
    });

    // Mark old jobs as not new (runs daily at midnight)
    cron.schedule('0 0 * * *', async () => {
        console.log('[Cron] Updating job statuses...');
        await updateJobStatuses();
    });

    // Archive expired jobs (runs daily at 1 AM)
    cron.schedule('0 1 * * *', async () => {
        console.log('[Cron] Archiving expired jobs...');
        await archiveExpiredJobs();
    });

    // Clean up duplicate jobs (runs weekly on Sunday at 2 AM)
    cron.schedule('0 2 * * 0', async () => {
        console.log('[Cron] Cleaning up duplicates...');
        await cleanupDuplicateJobs();
    });

    console.log('Cron jobs initialized successfully');
}

// Post pending jobs to Telegram
export async function triggerTelegramPost() {
    let postedCount = 0;
    try {
        await connectDB();

        const pendingJobs = await Job.find({
            isActive: true,
            telegramPosted: false,
            isVerified: true,
        })
            .sort({ postedDate: -1 })
            .limit(5);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobupdate.site';

        for (const job of pendingJobs) {
            const messageId = await postJobToTelegram(job.toObject() as any, siteUrl);

            if (messageId) {
                job.telegramPosted = true;
                job.telegramMessageId = messageId;
                await job.save();
                postedCount++;
                console.log(`[Telegram] Posted: ${job.company} - ${job.title}`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } catch (error) {
        console.error('[Cron] Error posting to Telegram:', error);
    }
    return postedCount;
}

// Update job statuses
async function updateJobStatuses() {
    try {
        await connectDB();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Mark jobs older than 7 days as not recent
        const result = await Job.updateMany(
            { isRecent: true, postedDate: { $lt: sevenDaysAgo } },
            { $set: { isRecent: false } }
        );

        console.log(`[Cron] Updated ${result.modifiedCount} jobs to not recent`);
    } catch (error) {
        console.error('[Cron] Error updating job statuses:', error);
    }
}

// Archive expired jobs
async function archiveExpiredJobs() {
    try {
        await connectDB();

        const now = new Date();

        // Deactivate jobs past their expiry date
        const result = await Job.updateMany(
            { isActive: true, expiryDate: { $lt: now } },
            { $set: { isActive: false } }
        );

        console.log(`[Cron] Archived ${result.modifiedCount} expired jobs`);

        // Also deactivate jobs older than 60 days without expiry date
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const oldResult = await Job.updateMany(
            { isActive: true, expiryDate: null, postedDate: { $lt: sixtyDaysAgo } },
            { $set: { isActive: false } }
        );

        console.log(`[Cron] Archived ${oldResult.modifiedCount} old jobs`);
    } catch (error) {
        console.error('[Cron] Error archiving expired jobs:', error);
    }
}

// Clean up duplicate jobs
async function cleanupDuplicateJobs() {
    try {
        await connectDB();

        // Find duplicates based on company + title + first location
        const duplicates = await Job.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: {
                        company: '$company',
                        title: '$title',
                        location: { $arrayElemAt: ['$locations', 0] },
                    },
                    count: { $sum: 1 },
                    docs: { $push: '$_id' },
                    latestDate: { $max: '$postedDate' },
                },
            },
            { $match: { count: { $gt: 1 } } },
        ]);

        let deactivatedCount = 0;

        for (const dup of duplicates) {
            // Keep the most recent, deactivate the rest
            const toDeactivate = dup.docs.slice(1);
            await Job.updateMany(
                { _id: { $in: toDeactivate } },
                { $set: { isActive: false } }
            );
            deactivatedCount += toDeactivate.length;
        }

        console.log(`[Cron] Deactivated ${deactivatedCount} duplicate jobs`);
    } catch (error) {
        console.error('[Cron] Error cleaning up duplicates:', error);
    }
}

// Manual trigger functions for admin actions
export async function triggerTelegramPostManual() {
    return await triggerTelegramPost();
}

import { scrapeApnaJobs } from './scrapers/apna';

import { scrapeUnstopJobs } from './scrapers/unstop';
import { scrapeInternshala } from './scrapers/internshala';

export async function triggerScraping() {
    console.log('[Automation] Starting scraping sequence...');

    const scrapers = [
        { name: 'offCampus', fn: scrapeOffCampusJobs },
        { name: 'freshersNow', fn: scrapeFreshersNow },
        { name: 'apna', fn: scrapeApnaJobs },
        { name: 'unstop', fn: scrapeUnstopJobs },
        { name: 'internshala', fn: scrapeInternshala }
    ];

    // Shuffle and pick 2 to avoid timeouts on serverless functions
    const shuffled = scrapers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

    console.log(`[Automation] Selected scrapers for this run: ${selected.map(s => s.name).join(', ')}`);

    const results: Record<string, any> = {};
    let totalCount = 0;

    for (const scraper of selected) {
        try {
            console.log(`[Automation] Running ${scraper.name}...`);
            const result = await scraper.fn();
            results[scraper.name] = result;
            totalCount += result.count;
        } catch (e: any) {
            console.error(`[Automation] Error running ${scraper.name}:`, e);
            results[scraper.name] = { count: 0, success: false, error: e.message };
        }
    }

    return {
        ...results,
        selected: selected.map(s => s.name),
        total: totalCount
    };
}

export async function triggerStatusUpdate() {
    await updateJobStatuses();
}

export async function triggerArchive() {
    await archiveExpiredJobs();
}

export async function triggerDuplicateCleanup() {
    await cleanupDuplicateCleanup();
}

async function cleanupDuplicateCleanup() {
    await cleanupDuplicateJobs();
}
