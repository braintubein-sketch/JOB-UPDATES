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
 * DEEP SCRAPER: Improved Logic to filter news domains and find ACTUAL government/portal links
 */
async function extractOfficialLink(newsUrl: string): Promise<string> {
    try {
        const response = await fetch(newsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        if (!response.ok) return newsUrl;
        const html = await response.text();

        // 1. EXTRACT ALL LINKS
        const linkPattern = /href=["'](https?:\/\/[^"']+)["']/gi;
        let match;
        const allLinks: string[] = [];
        while ((match = linkPattern.exec(html)) !== null) {
            allLinks.push(match[1]);
        }

        // 2. EXCLUDE NEWS DOMAINS (We don't want to redirect back to a competitor)
        const newsDomains = [
            'timesofindia', 'indiatimes', 'hindustantimes', 'jagranjosh', 'careerindia',
            'indiatoday', 'facebook.com', 'twitter.com', 't.me', 'google.com',
            'whatsapp.com', 'youtube.com', 'linkedin.com', 'instagram.com'
        ];

        const potentialOfficialLinks = allLinks.filter(link => {
            const lowerLink = link.toLowerCase();
            return !newsDomains.some(domain => lowerLink.includes(domain));
        });

        // 3. PRIORITY 1: Government (.gov.in, .nic.in, .res.in, .ac.in, .edu.in)
        const govPatterns = [/\.gov\.in/i, /\.nic\.in/i, /\.res\.in/i, /\.ac\.in/i, /\.edu\.in/i, /ibps\.in/i];
        for (const pattern of govPatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // 4. PRIORITY 2: PDF Files (Usually notifications)
        const pdfLink = potentialOfficialLinks.find(link => link.toLowerCase().endsWith('.pdf'));
        if (pdfLink) return pdfLink;

        // 5. PRIORITY 3: Search for high-probability organizational patterns
        const orgPatterns = [/recruitment/i, /apply/i, /login/i, /portal/i, /vacancy/i];
        for (const pattern of orgPatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        return newsUrl; // Final fallback
    } catch {
        return newsUrl;
    }
}

/**
 * Intelligent extraction for Job Details
 */
function extractComprehensiveDetails(title: string, text: string) {
    const fullText = (title + " " + text).toLowerCase();
    const cleanText = text.replace(/<[^>]*>?/gm, '');

    let postName = title.split('Recruitment')[0].split('hiring')[0].split('Vacancy')[0].split('Jobs')[0].trim();

    let experience = 'Freshers';
    const expMatch = fullText.match(/(\d+)\+?\s*years?\s*exp/i) || fullText.match(/exp(erience)?:\s*(\d+)/i);
    if (expMatch) {
        experience = `${expMatch[1]}+ Years`;
        if (!postName.toLowerCase().includes('exp')) postName += ` (${experience})`;
    }

    let vacancies = 'Check Notice';
    const vacancyMatch = fullText.match(/(\d{1,6})\s+(posts|vacancies|openings|positions)/i);
    if (vacancyMatch) vacancies = vacancyMatch[1];

    let qualification = 'Graduate / Relevant Degree';
    const qualMap = {
        'btech': 'B.Tech', 'mtech': 'M.Tech', 'graduate': 'Any Graduate',
        'post graduate': 'Post Graduate', '10th': '10th Pass', '12th': '12th Pass',
        'iti': 'ITI', 'diploma': 'Diploma', 'mba': 'MBA', 'mca': 'MCA', 'be': 'B.E'
    };
    const foundQuals = Object.keys(qualMap).filter(k => fullText.includes(k));
    if (foundQuals.length > 0) qualification = foundQuals.map(k => (qualMap as any)[k]).join(', ');

    let lastDate: Date | undefined = undefined;
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    // Improved Regex for DD Month YYYY or Month DD, YYYY
    const dateRegex = new RegExp(`(\\d{1,2})\\s*(${months.join('|')})\\s*(\\d{4})`, 'i');
    const dateMatch = fullText.match(dateRegex);

    if (dateMatch) {
        const d = new Date(`${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`);
        if (!isNaN(d.getTime())) lastDate = d;
    }

    if (!lastDate) {
        // Look for 20th Feb style
        const shortDateRegex = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s*(${months.join('|')})`, 'i');
        const shortMatch = fullText.match(shortDateRegex);
        if (shortMatch) {
            const d = new Date(`${shortMatch[1]} ${shortMatch[2]} ${new Date().getFullYear()}`);
            if (!isNaN(d.getTime())) lastDate = d;
        }
    }

    if (!lastDate) lastDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

    let location = 'All India';
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'];
    const foundState = states.find(s => fullText.includes(s.toLowerCase()));
    if (foundState) location = foundState;

    const sentences = cleanText.split(/[.!?]/);
    const eligibility = sentences.find(s => s.toLowerCase().includes('eligible') || s.toLowerCase().includes('criteria'))?.trim() || 'Refer official website for full eligibility details.';
    const selection = sentences.find(s => s.toLowerCase().includes('selection') || s.toLowerCase().includes('interview') || s.toLowerCase().includes('exam'))?.trim() || 'Selection via Written Exam / Interview.';

    return { vacancies, qualification, lastDate, location, postName, experience, eligibility, selection };
}

export async function automateContentFetch() {
    await dbConnect();
    console.log('=== ULTRA DEEP EXTRACTION CYCLE STARTED ===');

    let newJobsCount = 0;

    for (const source of SOURCES) {
        try {
            console.log(`📡 Fetching: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                if (!item.title || !item.link) continue;

                const cleanTitle = item.title.replace(/Notification|Released|Out Now|Declared|Apply Online/gi, '').trim();
                const slug = generateSlug(cleanTitle).substring(0, 80);

                const existing = await Job.findOne({ slug });
                if (existing) continue;

                const snippet = item.contentSnippet || item.content || '';
                const titleLower = cleanTitle.toLowerCase();

                if (!titleLower.includes('recruitment') && !titleLower.includes('vacancy') && !titleLower.includes('result') && !titleLower.includes('admit card')) continue;

                // DEEP SCRAPE WITH IMPROVED DOMAIN FILTERING
                console.log(`   🔍 Finding real gov portal for: ${cleanTitle}`);
                const officialLink = await extractOfficialLink(item.link);

                const details = extractComprehensiveDetails(cleanTitle, snippet);

                let realOrg = cleanTitle.split(' ')[0];
                if (titleLower.includes('railway')) realOrg = 'Indian Railways';
                else if (titleLower.includes('bank')) realOrg = 'Banking Sector';
                else if (titleLower.includes('ssc')) realOrg = 'Staff Selection Commission';
                else if (titleLower.includes('upsc')) realOrg = 'UPSC';

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
                    source: item.link,
                    applyLink: officialLink,
                    description: snippet,
                    status: 'PUBLISHED',
                    howToApply: `Visit the official portal at ${officialLink} to complete your registration.`,
                });

                newJobsCount++;
            }
        } catch (err: any) {
            console.error(`Error ${source.name}:`, err.message);
        }
    }

    const posted = await autoPostNewJobs();
    return { newJobs: newJobsCount, posted };
}
