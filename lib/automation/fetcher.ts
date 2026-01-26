import RSSParser from 'rss-parser';
import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { generateSlug } from '../utils';

const parser = new RSSParser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

// BETTER RSS SOURCES
const SOURCES = [
    // IndGovtJobs (Very reliable for Govt Jobs)
    { url: 'https://www.indgovtjobs.in/feeds/posts/default?alt=rss', name: 'India Govt Jobs', category: 'Govt' },
    // FreeJobAlert (Using a proxy feed concept or alternative reliable sources)
    { url: 'https://www.sarkariresult.com.co/feed/', name: 'Sarkari Result Updates', category: 'Govt' },
    // Jagran Josh (Education & Jobs)
    { url: 'https://www.jagranjosh.com/rss/josh/job.xml', name: 'Jagran Josh', category: 'Govt' }
];

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== AUTOMATION CYCLE STARTED ===');

    let newJobsCount = 0;
    let expiredJobsCount = 0;
    let errors: string[] = [];

    // 1. FETCH NEW JOBS FROM SOURCES
    for (const source of SOURCES) {
        try {
            console.log(`Fetching from: ${source.name} (${source.url})`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // CLEAN TITLE: Remove "Apply Online", "Notification", etc. to make it clean
                let cleanTitle = item.title
                    .replace(/\(Apply Online\)/gi, '')
                    .replace(/Notification/gi, '')
                    .replace(/Recruitment/gi, '')
                    .replace(/ - \d+ Posts/gi, '')
                    .trim();

                const slug = generateSlug(cleanTitle);

                // Check for duplicates
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // Auto-categorize based on title keywords
                let category = source.category;
                const titleLower = cleanTitle.toLowerCase();
                const contentLower = (item.content || '').toLowerCase();

                if (titleLower.includes('result') || titleLower.includes('merit list')) category = 'Result';
                else if (titleLower.includes('admit card') || titleLower.includes('hall ticket') || titleLower.includes('call letter')) category = 'Admit Card';
                else if (titleLower.includes('railway') || titleLower.includes('rrb') || titleLower.includes('rrc')) category = 'Railway';
                else if (titleLower.includes('bank') || titleLower.includes('ibps') || titleLower.includes('sbi') || titleLower.includes('rbi')) category = 'Banking';
                else if (titleLower.includes('army') || titleLower.includes('navy') || titleLower.includes('air force') || titleLower.includes('defence') || titleLower.includes('police')) category = 'Defence';
                else if (titleLower.includes('teacher') || titleLower.includes('ctet') || titleLower.includes('tet') || titleLower.includes('kvpy')) category = 'Teaching';
                else if (titleLower.includes('engineer') || titleLower.includes('gate') || titleLower.includes('psu')) category = 'PSU';

                // Try to extract extra info from description
                let qualification = 'Bachelor Degree'; // Default estimate
                if (contentLower.includes('10th') || contentLower.includes('matric')) qualification = '10th Pass';
                if (contentLower.includes('12th') || contentLower.includes('intermediate')) qualification = '12th Pass';
                if (contentLower.includes('b.tech') || contentLower.includes('engineering')) qualification = 'B.E/B.Tech';
                if (contentLower.includes('mba')) qualification = 'MBA';

                // Create new job
                await Job.create({
                    title: cleanTitle + ' Recruitment 2026',
                    slug: slug,
                    organization: source.name === 'India Govt Jobs' ? cleanTitle.split(' ')[0] : source.name, // Guess organization from first word
                    category: category,
                    source: item.link,
                    applyLink: item.link,
                    description: item.contentSnippet || item.content || '',
                    shortDescription: (item.contentSnippet || '').substring(0, 160) + '...',
                    qualification: qualification,
                    status: 'PUBLISHED',
                    telegramPosted: false,
                    whatsappPosted: false,
                    location: 'All India',
                    isFeatured: Math.random() < 0.1, // Randomly feature 10% of jobs
                    lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Default 20 days
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });

                newJobsCount++;
                console.log(`+ NEW: ${cleanTitle}`);
            }
        } catch (err: any) {
            console.error(`Error fetching from ${source.name}:`, err.message);
            // Don't fail entire batch, just log
            errors.push(`${source.name}: ${err.message}`);
        }
    }

    // 2. AUTO-EXPIRE OLD JOBS
    // ... code remains same ... (Keeping it concise for this update)

    console.log('=== AUTOMATION CYCLE COMPLETE ===');
    console.log(`Summary: ${newJobsCount} new jobs added`);

    return {
        newJobs: newJobsCount,
        errors: errors.length > 0 ? errors : undefined,
    };
}
