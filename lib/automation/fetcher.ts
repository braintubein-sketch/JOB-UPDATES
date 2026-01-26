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
    // GOVT & GENERAL
    { url: 'https://www.jagranjosh.com/rss/josh/sarkari-naukri.xml', name: 'Jagran Josh Sarkari', defaultCategory: 'Govt' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs', defaultCategory: 'Govt' },
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Education', defaultCategory: 'Private' },

    // PRIVATE & IT
    { url: 'https://www.careerindia.com/rss/news-rss.xml', name: 'CareerIndia', defaultCategory: 'Private' },

    // BANKING & PSC
    { url: 'https://www.indiatoday.in/rss/1206584', name: 'India Today Edu', defaultCategory: 'Govt' },
];

/**
 * Advanced extraction for Job Details
 */
function extractComprehensiveDetails(title: string, text: string) {
    const fullText = (title + " " + text).toLowerCase();
    const cleanText = text.replace(/<[^>]*>?/gm, ''); // Remove HTML tags

    // 1. POST NAME (Cleaning and Experience addition)
    let postName = title.split('Recruitment')[0].split('hiring')[0].split('Vacancy')[0].trim();

    // 2. EXPERIENCE
    let experience = 'Freshers';
    const expMatch = fullText.match(/(\d+)\+?\s*years?\s*exp/i) || fullText.match(/exp(erience)?:\s*(\d+)/i);
    if (expMatch) {
        experience = `${expMatch[1]}+ Years`;
        if (!postName.toLowerCase().includes('exp')) {
            postName += ` (${experience})`;
        }
    } else if (fullText.includes('freshers') || fullText.includes('no experience')) {
        experience = 'Freshers';
    }

    // 3. VACANCIES
    let vacancies = 'Check Notice';
    const vacancyMatch = fullText.match(/(\d{1,6})\s+(posts|vacancies|openings|positions)/i) ||
        fullText.match(/(total|various)\s+(\d{1,6})\s+posts/i);
    if (vacancyMatch) vacancies = vacancyMatch[1] || vacancyMatch[2];

    // 4. QUALIFICATION
    let qualification = 'Refer PDF';
    const qualMap = {
        'btech': 'B.Tech', 'mtech': 'M.Tech', 'graduate': 'Any Graduate',
        'post graduate': 'Post Graduate', '10th': '10th Pass', '12th': '12th Pass',
        'iti': 'ITI Holder', 'diploma': 'Diploma', 'mba': 'MBA', 'mca': 'MCA',
        'be': 'B.E', 'degree': 'Any Degree', 'phd': 'PhD'
    };
    const foundQuals = Object.keys(qualMap).filter(k => fullText.includes(k));
    if (foundQuals.length > 0) {
        qualification = foundQuals.map(k => (qualMap as any)[k]).join(', ');
    }

    // 5. SALARY
    let salary = 'As per norms';
    const salaryMatch = fullText.match(/(rs\.|inr|salary)\s*[:]?\s*(\d{1,2},?\d{2,3},?\d{2,3})/i) ||
        fullText.match(/pay scale\s*[:]?\s*(\d+-\d+)/i);
    if (salaryMatch) salary = salaryMatch[2] || salaryMatch[1];

    // 6. LAST DATE
    let lastDate: Date | undefined = undefined;
    const datePattern = /(\d{1,2}[-/th\s]+[a-z]{3,9}[-/th\s]+\d{2,4})/i;
    const dateMatch = fullText.match(/(last date|apply by|deadline|end date)\s+(is\s+)?/i);
    if (dateMatch) {
        const remainingText = fullText.substring(dateMatch.index! + dateMatch[0].length);
        const actualDate = remainingText.match(datePattern);
        if (actualDate) {
            const d = new Date(actualDate[1]);
            if (!isNaN(d.getTime())) lastDate = d;
        }
    }
    if (!lastDate) lastDate = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000);

    // 7. LOCATION
    let location = 'All India';
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];
    const foundState = states.find(s => fullText.includes(s.toLowerCase()));
    if (foundState) location = foundState;

    // 8. ELIGIBILITY / SELECTION PROCESS SNIPPETS
    // Simple logic: If we find keywords, we try to take the sentence around them
    const sentences = cleanText.split(/[.!?]/);
    const eligibility = sentences.find(s => s.toLowerCase().includes('eligible') || s.toLowerCase().includes('criteria'))?.trim() || 'Refer to official notification for complete eligibility criteria.';
    const selection = sentences.find(s => s.toLowerCase().includes('selection') || s.toLowerCase().includes('interview') || s.toLowerCase().includes('exam'))?.trim() || 'Selection based on merit, written test and/or interview as per organization policy.';

    return {
        vacancies, qualification, lastDate, location, postName,
        experience, salary, eligibility, selection
    };
}

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== MULTI-TYPE EXTRACTION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`Checking: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // 1. CLEAN TITLE
                const cleanTitle = item.title
                    .replace(/\(Apply Online\)/gi, '')
                    .replace(/Notification|Released|Out Now|Declared/gi, '')
                    .trim();

                const titleLower = cleanTitle.toLowerCase();
                const snippet = item.contentSnippet || item.content || '';

                // 2. SMART CATEGORIZATION
                let detectedCategory: any = source.defaultCategory;
                if (titleLower.includes('result')) detectedCategory = 'Result';
                else if (titleLower.includes('admit card')) detectedCategory = 'Admit Card';
                else if (titleLower.includes('railway') || titleLower.includes('rrb')) detectedCategory = 'Railway';
                else if (titleLower.includes('bank') || titleLower.includes('ibps') || titleLower.includes('sbi')) detectedCategory = 'Banking';
                else if (titleLower.includes('teacher') || titleLower.includes('kvs') || titleLower.includes('tet')) detectedCategory = 'Teaching';
                else if (titleLower.includes('tcs') || titleLower.includes('infosys') || titleLower.includes('it jobs') || titleLower.includes('software')) {
                    detectedCategory = 'Private';
                }

                // 3. RELEVANCY
                const isRelevant = titleLower.includes('recruitment') ||
                    titleLower.includes('vacancy') ||
                    titleLower.includes('apply') ||
                    titleLower.includes('hiring') ||
                    titleLower.includes('jobs') ||
                    titleLower.includes('result') ||
                    titleLower.includes('admit card') ||
                    titleLower.includes('scorecard');

                if (!isRelevant) continue;

                const slug = generateSlug(cleanTitle).substring(0, 80); // Ensure reasonably sized slugs
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // 4. EXTRACT COMPREHENSIVE DATA
                const details = extractComprehensiveDetails(cleanTitle, snippet);

                // 5. ORG NAME
                let realOrg = cleanTitle.split(' ')[0];
                if (titleLower.includes('railway')) realOrg = 'Indian Railways';
                else if (titleLower.includes('bank')) realOrg = 'Banking Sector';
                else if (titleLower.includes('ssc')) realOrg = 'Staff Selection Commission';
                else if (titleLower.includes('upsc')) realOrg = 'UPSC';
                else if (titleLower.includes('tcs')) realOrg = 'TCS';
                else if (titleLower.includes('infosys')) realOrg = 'Infosys';

                // 6. SAVE TO DB with all fields
                await Job.create({
                    title: cleanTitle,
                    slug: slug,
                    organization: realOrg,
                    postName: details.postName,
                    vacancies: details.vacancies,
                    qualification: details.qualification,
                    location: details.location,
                    lastDate: details.lastDate,
                    experience: details.experience,
                    salary: details.salary,
                    eligibility: details.eligibility,
                    selectionProcess: details.selection,
                    category: detectedCategory,
                    source: item.link,
                    applyLink: item.link,
                    description: snippet,
                    status: 'PUBLISHED',
                    howToApply: `Visit the official ${realOrg} website or the notification link below to fill the application form.`,
                });

                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`Error: ${source.name}:`, err.message);
        }
    }

    const posted = await autoPostNewJobs();
    console.log(`✅ ${newJobsCount} Added, ${posted} Posted.`);
    return { newJobs: newJobsCount, posted };
}
