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
    { url: 'https://www.jagranjosh.com/rss/josh/sarkari-naukri.xml', name: 'Jagran Josh Sarkari', defaultCategory: 'Govt' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs', defaultCategory: 'Govt' },
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Education', defaultCategory: 'Private' },
    { url: 'https://www.careerindia.com/rss/news-rss.xml', name: 'CareerIndia', defaultCategory: 'Private' },
];

/**
 * DEEP SCRAPER: Fetches the news article HTML and extracts the ACTUAL official link
 */
async function extractOfficialLink(newsUrl: string): Promise<string> {
    try {
        const response = await fetch(newsUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const html = await response.text();

        // 1. Look for common government/recruitment portal patterns in links
        // We look for .gov.in, .nic.in, ibps.in, etc.
        const officialPatterns = [
            /https?:\/\/[a-z0-9.-]+\.gov\.in[^\s"'>]*/i,
            /https?:\/\/[a-z0-9.-]+\.nic\.in[^\s"'>]*/i,
            /https?:\/\/[a-z0-9.-]+\.res\.in[^\s"'>]*/i,
            /https?:\/\/[a-z0-9.-]*ibps\.in[^\s"'>]*/i,
            /https?:\/\/[a-z0-9.-]*ssc\.nic\.in[^\s"'>]*/i,
            /https?:\/\/[a-z0-9.-]*upsc\.gov\.in[^\s"'>]*/i,
            /https?:\/\/[a-z0-9.-]*nta\.ac\.in[^\s"'>]*/i,
        ];

        for (const pattern of officialPatterns) {
            const match = html.match(pattern);
            if (match) return match[0];
        }

        // 2. Look for "Direct Link to Apply" or "Official Website" text anchors
        const anchorPattern = /href=["'](https?:\/\/[^"']+)["'][^>]*>(Official Website|Direct Link|Apply Online|Download Notification)/i;
        const anchorMatch = html.match(anchorPattern);
        if (anchorMatch && !anchorMatch[1].includes('jagranjosh') && !anchorMatch[1].includes('hindustantimes')) {
            return anchorMatch[1];
        }

        return newsUrl; // Fallback to news URL if deep-link not found
    } catch {
        return newsUrl;
    }
}

/**
 * Intelligent extraction for Job Details
 */
function extractComprehensiveDetails(title: string, text: string) {
    const fullText = (title + " " + text).toLowerCase();
    const cleanText = text.replace(/<[^>]*>?/gm, ''); // Remove HTML tags

    // 1. POST NAME
    let postName = title.split('Recruitment')[0].split('hiring')[0].split('Vacancy')[0].split('Jobs')[0].trim();

    // 2. EXPERIENCE
    let experience = 'Freshers';
    const expMatch = fullText.match(/(\d+)\+?\s*years?\s*exp/i) || fullText.match(/exp(erience)?:\s*(\d+)/i);
    if (expMatch) {
        experience = `${expMatch[1]}+ Years`;
        if (!postName.toLowerCase().includes('exp')) postName += ` (${experience})`;
    }

    // 3. VACANCIES
    let vacancies = 'Check Notice';
    const vacancyMatch = fullText.match(/(\d{1,6})\s+(posts|vacancies|openings|positions)/i);
    if (vacancyMatch) vacancies = vacancyMatch[1];

    // 4. QUALIFICATION
    let qualification = 'Graduate / Relevant Degree';
    const qualMap = {
        'btech': 'B.Tech', 'mtech': 'M.Tech', 'graduate': 'Any Graduate',
        'post graduate': 'Post Graduate', '10th': '10th Pass', '12th': '12th Pass',
        'iti': 'ITI', 'diploma': 'Diploma', 'mba': 'MBA', 'mca': 'MCA', 'be': 'B.E'
    };
    const foundQuals = Object.keys(qualMap).filter(k => fullText.includes(k));
    if (foundQuals.length > 0) qualification = foundQuals.map(k => (qualMap as any)[k]).join(', ');

    // 5. LAST DATE (Improved Pattern)
    let lastDate: Date | undefined = undefined;
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const dateRegex = new RegExp(`(\\d{1,2})\\s*(${months.join('|')})\\s*(\\d{4})`, 'i');
    const dateMatch = fullText.match(dateRegex);

    if (dateMatch) {
        const d = new Date(`${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`);
        if (!isNaN(d.getTime())) lastDate = d;
    }
    if (!lastDate) lastDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 day fallback

    // 6. LOCATION
    let location = 'All India';
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'];
    const foundState = states.find(s => fullText.includes(s.toLowerCase()));
    if (foundState) location = foundState;

    // 7. ELIGIBILITY / SELECTION
    const sentences = cleanText.split(/[.!?]/);
    const eligibility = sentences.find(s => s.toLowerCase().includes('eligible') || s.toLowerCase().includes('criteria'))?.trim() || 'Refer official website for full eligibility details.';
    const selection = sentences.find(s => s.toLowerCase().includes('selection') || s.toLowerCase().includes('interview') || s.toLowerCase().includes('exam'))?.trim() || 'Selection via Written Exam / Interview.';

    return { vacancies, qualification, lastDate, location, postName, experience, eligibility, selection };
}

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== DEEP EXTRACTION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`📡 Fetching: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                // 1. CLEAN TITLE
                const cleanTitle = item.title.replace(/Notification|Released|Out Now|Declared|Apply Online/gi, '').trim();
                const slug = generateSlug(cleanTitle).substring(0, 80);

                const existing = await Job.findOne({ slug });
                if (existing) continue;

                const snippet = item.contentSnippet || item.content || '';
                const titleLower = cleanTitle.toLowerCase();

                // 2. RELEVANCY CHECK
                if (!titleLower.includes('recruitment') && !titleLower.includes('vacancy') && !titleLower.includes('result') && !titleLower.includes('admit card')) continue;

                // 3. DEEP SCRAPE OFFICIAL LINK
                console.log(`   🔍 Deep scraping real link for: ${cleanTitle}`);
                const officialLink = await extractOfficialLink(item.link);

                // 4. EXTRACT DETAILS
                const details = extractComprehensiveDetails(cleanTitle, snippet);

                // 5. ORG LOGIC
                let realOrg = cleanTitle.split(' ')[0];
                if (titleLower.includes('railway')) realOrg = 'Indian Railways';
                else if (titleLower.includes('bank')) realOrg = 'Banking Sector';
                else if (titleLower.includes('ssc')) realOrg = 'Staff Selection Commission';
                else if (titleLower.includes('upsc')) realOrg = 'UPSC';

                // 6. SAVE
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
                    eligibility: details.eligibility,
                    selectionProcess: details.selection,
                    category: titleLower.includes('result') ? 'Result' : titleLower.includes('admit') ? 'Admit Card' : source.defaultCategory,
                    source: item.link, // News link kept for reference
                    applyLink: officialLink, // ACTUAL Gov/Portal link
                    description: snippet,
                    status: 'PUBLISHED',
                    howToApply: `Interested candidates should visit the official website ${officialLink} and follow the enrollment instructions mentioned in the official notification.`,
                });

                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`Error ${source.name}:`, err.message);
        }
    }

    const posted = await autoPostNewJobs();
    console.log(`✅ CYCLE COMPLETE: ${newJobsCount} Added, ${posted} Posted.`);
    return { newJobs: newJobsCount, posted };
}
