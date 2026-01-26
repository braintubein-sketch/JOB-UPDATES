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
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Education', defaultCategory: 'Private' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs', defaultCategory: 'Govt' },
    { url: 'https://www.jagranjosh.com/rss/josh/sarkari-naukri.xml', name: 'Jagran Josh Sarkari', defaultCategory: 'Govt' },
    { url: 'https://www.careerindia.com/rss/news-rss.xml', name: 'CareerIndia News', defaultCategory: 'Govt' },
];

/**
 * Intelligent extraction of job details from semi-structured text
 */
function extractJobDetails(title: string, text: string) {
    const fullText = (title + " " + text).toLowerCase();

    // 1. EXTRACT VACANCIES
    let vacancies = 'Check Notice';
    const vacancyMatch = fullText.match(/(\d{1,6})\s+(posts|vacancies|openings|positions)/i) ||
        fullText.match(/(total|various)\s+(\d{1,6})\s+posts/i);
    if (vacancyMatch) vacancies = vacancyMatch[1] || vacancyMatch[2];

    // 2. EXTRACT QUALIFICATION
    let qualification = 'Refer PDF';
    const qualKeywords = ['graduate', 'post graduate', 'degree', 'diploma', '10th', '12th', 'b.tech', 'm.tech', 'mba', 'mca', 'phd', 'iti', 'be'];
    const foundQuals = qualKeywords.filter(q => fullText.includes(q));
    if (foundQuals.length > 0) qualification = foundQuals.map(q => q.toUpperCase()).join(', ');

    // 3. EXTRACT LAST DATE
    let lastDate: Date | undefined = undefined;
    const dateMatch = fullText.match(/(last date|apply by|deadline|end date)\s+(is\s+)?(\d{1,2}[-/th\s]+[a-z]{3,9}[-/th\s]+\d{2,4})/i);
    if (dateMatch && dateMatch[3]) {
        const d = new Date(dateMatch[3]);
        if (!isNaN(d.getTime())) lastDate = d;
    }
    // Fallback: 25 days from now
    if (!lastDate) lastDate = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000);

    // 4. EXTRACT LOCATION
    let location = 'All India';
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'];
    const foundState = states.find(s => fullText.includes(s.toLowerCase()));
    if (foundState) location = foundState;

    // 5. EXTRACT POST NAME
    let postName = title.split('Recruitment')[0].split('hiring')[0].trim();
    if (postName.length > 50) postName = postName.substring(0, 50) + '...';

    return { vacancies, qualification, lastDate, location, postName };
}

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== ADVANCED EXTRACTION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`📡 Checking Source: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // CLEAN TITLE
                const cleanTitle = item.title
                    .replace(/\(Apply Online\)/gi, '')
                    .replace(/Notification/gi, '')
                    .replace(/Released/gi, '')
                    .replace(/Out Now|Declared/gi, '')
                    .trim();

                const titleLower = cleanTitle.toLowerCase();
                const snippet = item.contentSnippet || item.content || '';

                // SMART CATEGORIZATION
                let detectedCategory: any = source.defaultCategory;
                if (titleLower.includes('result')) detectedCategory = 'Result';
                else if (titleLower.includes('admit card')) detectedCategory = 'Admit Card';
                else if (titleLower.includes('railway')) detectedCategory = 'Railway';
                else if (titleLower.includes('bank')) detectedCategory = 'Banking';
                else if (titleLower.includes('teacher')) detectedCategory = 'Teaching';
                else if (titleLower.includes('psu')) detectedCategory = 'PSU';

                // RELEVANCY FILTER
                const isRelevant = titleLower.includes('recruitment') ||
                    titleLower.includes('vacancy') ||
                    titleLower.includes('apply') ||
                    titleLower.includes('hiring') ||
                    titleLower.includes('jobs') ||
                    titleLower.includes('result') ||
                    titleLower.includes('admit card');

                if (!isRelevant) continue;

                const slug = generateSlug(cleanTitle);
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // EXTRACT DETAILS
                const details = extractJobDetails(cleanTitle, snippet);

                // ORGANIZATION NAME
                let realOrg = cleanTitle.split(' ')[0];
                if (titleLower.includes('railway')) realOrg = 'Indian Railways';
                else if (titleLower.includes('bank')) realOrg = 'Banking Sector';
                else if (titleLower.includes('ssc')) realOrg = 'SSC';
                else if (titleLower.includes('upsc')) realOrg = 'UPSC';

                // SAVE WITH EXTRACTED DATA
                await Job.create({
                    title: cleanTitle,
                    slug: slug,
                    organization: realOrg,
                    postName: details.postName,
                    vacancies: details.vacancies,
                    qualification: details.qualification,
                    location: details.location,
                    lastDate: details.lastDate,
                    category: detectedCategory,
                    source: item.link,
                    applyLink: item.link,
                    description: snippet || 'Latest recruitment notification details.',
                    status: 'PUBLISHED',
                });

                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`⚠️ Source Failure [${source.name}]:`, err.message);
        }
    }

    // TRIGGER SOCIAL POSTING
    const posted = await autoPostNewJobs();

    console.log(`✅ CYCLE COMPLETE: Found ${newJobsCount} new with extracted details.`);
    return { newJobs: newJobsCount, posted };
}
