import { prisma } from './prisma';
import axios from 'axios';
import * as cheerio from 'cheerio';
import RSSParser from 'rss-parser';

const parser = new RSSParser();

export async function fetchUpdates() {
    console.log('Starting fetch cycle...');

    // 1. Fetch from NCS (National Career Service) RSS if possible
    // Using a sample reliable government feed or public sector notification page
    const sources = [
        { url: 'https://www.ncs.gov.in/Pages/RSS.aspx', category: 'Govt' }, // Example NCS feed
        // Add more official URLs here
    ];

    for (const source of sources) {
        try {
            // For RSS feeds
            // const feed = await parser.parseURL(source.url);
            // For now, let's simulate fetching from an official landing page using Cheerio
            // Example: UPSC Recent Notifications
            await fetchUPSC();
            await fetchSSC();
        } catch (error) {
            console.error(`Error fetching from ${source.url}:`, error);
        }
    }

    // 2. Auto-expire outdated jobs
    await prisma.job.updateMany({
        where: {
            expiresAt: { lt: new Date() },
            status: 'APPROVED',
        },
        data: { status: 'EXPIRED' },
    });
}

async function fetchUPSC() {
    try {
        const { data } = await axios.get('https://upsc.gov.in/whats-new');
        const $ = cheerio.load(data);

        // Logic to parse UPSC "What's New" section
        // and save to DB if it looks like a job notification
        const jobPromises: Promise<void>[] = [];
        $('.view-whats-new .views-row').each((i, el) => {
            const title = $(el).find('a').text().trim();
            const link = 'https://upsc.gov.in' + $(el).find('a').attr('href');

            if (title.toLowerCase().includes('recruitment') || title.toLowerCase().includes('examination')) {
                jobPromises.push(saveJob({
                    title,
                    organization: 'UPSC',
                    source: link,
                    category: 'Govt',
                    postName: title.split('-')[0].trim(),
                    qualification: 'Refer Notification',
                }));
            }
        });
        await Promise.all(jobPromises);
    } catch (e) {
        console.error('UPSC fetch error', e);
    }
}

async function fetchSSC() {
    // Similar logic for SSC
}

async function saveJob(jobData: any) {
    const slug = jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check for duplicates
    const existing = await prisma.job.findUnique({ where: { slug } });
    if (existing) return;

    await prisma.job.create({
        data: {
            ...jobData,
            slug,
            status: 'PENDING', // Admin needs to approve
            importantDates: JSON.stringify([]),
            faq: JSON.stringify([]),
        },
    });
}
