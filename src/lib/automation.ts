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

    // Commented out to prevent double-runs with External Cron / API triggers
    // Scrape new jobs every 30 minutes
    // cron.schedule('*/30 * * * *', async () => {
    //     console.log('[Cron] Starting automated scraping...');
    //     await triggerScraping();
    // });

    // Post unpublished jobs to Telegram every 30 minutes
    // cron.schedule('*/30 * * * *', async () => {
    //     console.log('[Cron] Posting jobs to Telegram...');
    //     await triggerTelegramPost();
    // });

    // Mark old jobs as not new (runs daily at midnight)
    // cron.schedule('0 0 * * *', async () => {
    //     console.log('[Cron] Updating job statuses...');
    //     await updateJobStatuses();
    // });

    // Archive expired jobs (runs daily at 1 AM)
    // cron.schedule('0 1 * * *', async () => {
    //     console.log('[Cron] Archiving expired jobs...');
    //     await archiveExpiredJobs();
    // });

    // Clean up duplicate jobs (runs weekly on Sunday at 2 AM)
    // cron.schedule('0 2 * * 0', async () => {
    //     console.log('[Cron] Cleaning up duplicates...');
    //     await cleanupDuplicateJobs();
    // });

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
            .sort({ createdAt: -1 })
            .limit(10);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobupdate.site';
        const processedBatch = new Set<string>();

        for (const job of pendingJobs) {
            // Deduplicate within the batch (company + title)
            const jobKey = `${job.company.toLowerCase()}-${job.title.toLowerCase()}`;
            if (processedBatch.has(jobKey)) {
                console.log(`[Telegram] Skipping duplicate in batch: ${job.company} - ${job.title}`);
                job.telegramPosted = true;
                await job.save();
                continue;
            }

            // Check if ANY similar job was already posted (globally in DB)
            const alreadyPostedSimilar = await (Job as any).findSimilar({
                company: job.company,
                title: job.title
            });

            if (alreadyPostedSimilar && alreadyPostedSimilar.telegramPosted) {
                console.log(`[Telegram] Skipping already posted similar job: ${job.company} - ${job.title}`);
                job.telegramPosted = true;
                await job.save();
                continue;
            }

            const messageId = await postJobToTelegram(job.toObject() as any, siteUrl);

            if (messageId) {
                job.telegramPosted = true;
                job.telegramMessageId = messageId;
                await job.save();
                postedCount++;
                processedBatch.add(jobKey);
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

// Delete expired and old jobs permanently
async function deleteExpiredJobs() {
    try {
        await connectDB();

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Delete jobs with expired expiryDate
        const expiredResult = await Job.deleteMany({ expiryDate: { $lt: now, $exists: true, $ne: null } });
        console.log(`[Cleanup] Deleted ${expiredResult.deletedCount} jobs with expired expiryDate`);

        // 2. Delete jobs older than 30 days
        const oldResult = await Job.deleteMany({ postedDate: { $lt: thirtyDaysAgo } });
        console.log(`[Cleanup] Deleted ${oldResult.deletedCount} jobs older than 30 days`);

        // 3. Delete inactive jobs
        const inactiveResult = await Job.deleteMany({ isActive: false });
        console.log(`[Cleanup] Deleted ${inactiveResult.deletedCount} inactive jobs`);

        const remaining = await Job.countDocuments();
        console.log(`[Cleanup] ${remaining} jobs remaining in database`);

        return {
            expired: expiredResult.deletedCount,
            old: oldResult.deletedCount,
            inactive: inactiveResult.deletedCount,
            remaining
        };
    } catch (error) {
        console.error('[Cron] Error deleting expired jobs:', error);
        return { expired: 0, old: 0, inactive: 0, remaining: 0 };
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

import { triggerLightweightScraping } from './lightweightScraper';

export async function triggerScraping() {
    console.log('[Automation] Starting lightweight API-based scraping...');

    // Use lightweight API-based scraping instead of Puppeteer
    // This is much faster and uses minimal memory
    const result = await triggerLightweightScraping();

    return result;
}

export async function triggerStatusUpdate() {
    await updateJobStatuses();
}

export async function triggerArchive() {
    return await deleteExpiredJobs();
}

export async function triggerDuplicateCleanup() {
    await cleanupDuplicateJobs();
}
