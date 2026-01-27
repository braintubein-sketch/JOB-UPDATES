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
    { url: 'https://www.indiatoday.in/rss/1206584', name: 'India Today Education', defaultCategory: 'Govt' },
    { url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml', name: 'HT Jobs Portal', defaultCategory: 'Govt' },
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', name: 'TOI Jobs Feed', defaultCategory: 'Private' },
    { url: 'https://www.financialexpress.com/jobs/feed/', name: 'Financial Express Careers', defaultCategory: 'Private' },
    { url: 'https://www.indiatvnews.com/education/rss', name: 'IndiaTV Education', defaultCategory: 'Govt' },
];

/**
 * DEEP SCRAPER: Improved Logic to filter news domains and find ACTUAL government/portal links
 */
async function extractOfficialLink(newsUrl: string): Promise<string> {
    try {
        const response = await fetch(newsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
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

        // 2. EXCLUDE NEWS & COMPETITOR DOMAINS (Ensure we NEVER redirect to a job board or news site)
        const newsDomains = [
            'timesofindia', 'indiatimes', 'hindustantimes', 'jagranjosh', 'careerindia',
            'indiatoday', 'shiksha.com', 'collegedunia.com', 'sarkariresult', 'freejobalert',
            'fresherslive', 'ambitionbox', 'glassdoor', 'naukri.com', 'monsterindia',
            'facebook.com', 'twitter.com', 't.me', 'google.com', 'whatsapp.com',
            'youtube.com', 'linkedin.com', 'instagram.com', 'entrancezone', 'aglasem',
            'employmentnews', 'india.com', 'moneycontrol', 'ndtv'
        ];

        const potentialOfficialLinks = allLinks.filter(link => {
            const lowerLink = link.toLowerCase();
            return !newsDomains.some(domain => lowerLink.includes(domain));
        });

        // 3. PRIORITY 1: Government domains
        const govPatterns = [/\.gov\.in/i, /\.nic\.in/i, /\.res\.in/i, /\.ac\.in/i, /\.edu\.in/i, /ibps\.in/i];
        for (const pattern of govPatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // 4. PRIORITY 2: Private Sector Career Portals (TCS, Infosys, Wipro, etc.)
        // Look for Workday, SuccessFactors, Taleo or domains containing "careers"
        const privatePatterns = [/careers\./i, /\.com\/careers/i, /tcs\.com/i, /infosys\.com/i, /wipro\.com/i, /myworkdayjobs/i, /successfactors/i, /taleo\.net/i];
        for (const pattern of privatePatterns) {
            const found = potentialOfficialLinks.find(link => pattern.test(link));
            if (found) return found;
        }

        // 5. PRIORITY 3: PDF Files (Direct notifications)
        const pdfLink = potentialOfficialLinks.find(link => link.toLowerCase().endsWith('.pdf'));
        if (pdfLink) return pdfLink;

        // 6. PRIORITY 4: General Organization patterns
        const orgPatterns = [/recruitment/i, /apply/i, /login/i, /portal/i, /vacancy/i, /hiring/i];
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

    // CLEAN TITLE LOGIC: Remove news clickbait phrases for a professional board look
    const professionalTitle = title
        .replace(/Notification|Released|Out Now|Declared|Apply Online|Online Registration|Closing Soon|Check|Details Here|Direct Link|Steps to Apply|How to Apply|@.*in/gi, '')
        .replace(/:\s*$/g, '')
        .trim();

    let postName = professionalTitle.split('Recruitment')[0].split('hiring')[0].split('Vacancy')[0].split('Jobs')[0].trim();

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
        'iti': 'ITI', 'diploma': 'Diploma', 'mba': 'MBA', 'mca': 'MCA', 'be': 'B.E', 'bcom': 'B.Com', 'bsc': 'B.Sc'
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

    let salary = 'Competitive Package';
    const salaryMatch = fullText.match(/(?:salary|stipend|package|lpa|ctc|pay scale|pay)\s*:?\s*(?:rs\.?\s*)?([\d.,\-]+\s*(?:lpa|per month|k|thousand|monthly|annually)?|[\d.,\-]+\s*(?:to|-)\s*[\d.,\-]+\s*(?:lpa|per month|k)?)/i);
    if (salaryMatch) salary = salaryMatch[1];

    const sentences = cleanText.split(/[.!?]/);
    const eligibility = sentences.find(s => s.toLowerCase().includes('eligible') || s.toLowerCase().includes('criteria'))?.trim() || 'Refer official website for full eligibility details.';
    const selection = sentences.find(s => s.toLowerCase().includes('selection') || s.toLowerCase().includes('interview') || s.toLowerCase().includes('exam'))?.trim() || 'Selection via Written Exam / Interview.';

    return { vacancies, qualification, lastDate, location, postName, experience, eligibility, selection, professionalTitle, salary };
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

                const originalTitle = item.title;
                const titleLower = originalTitle.toLowerCase();

                // 1. RELEVANCY GUARD
                const essentialKeys = ['recruitment', 'vacancy', 'hiring', 'apply', 'admit', 'result', 'naukri', 'jobs', 'post'];
                const isJobRelated = essentialKeys.some(key => titleLower.includes(key));

                const negativeKeywords = ['modi', 'gandhi', 'uddhav', 'thackeray', 'corporator', 'arrested', 'dead', 'death', 'accident', 'politics', 'election', 'viral', 'opinion', 'disappeared', 'match', 'ipl', 'cricket', 'bollywood', 'movie', 'killed', 'protest', 'strike', 'pune', 'mumbai', 'police station', 'jail'];
                const isIrrelevant = negativeKeywords.some(key => titleLower.includes(key));

                if (!isJobRelated || isIrrelevant) continue;

                // 2. DEEP LINK FETCHING
                const officialLink = await extractOfficialLink(item.link);

                // SKIPPING if we couldn't find a better link than the news site itself
                // This ensures we NEVER point back to a news article as an 'Official Link'
                const isNewsDomain = ['indiatoday', 'zeenews', 'timesofindia', 'hindustantimes', 'indiatvnews', 'financialexpress', 'jagranjosh'].some(d => officialLink.includes(d));
                if (isNewsDomain) continue;

                const details = extractComprehensiveDetails(originalTitle, item.contentSnippet || item.content || '');

                const slug = generateSlug(details.professionalTitle).substring(0, 80);
                const existing = await Job.findOne({ slug });
                if (existing) continue;

                // 3. ORG LOGIC
                let realOrg = details.professionalTitle.split(' ')[0];
                if (['where', 'how', 'when', 'what', 'why', 'this'].includes(realOrg.toLowerCase())) realOrg = details.professionalTitle.split(' ').slice(0, 2).join(' ');

                if (titleLower.includes('railway')) realOrg = 'Indian Railways';
                else if (titleLower.includes('bank')) realOrg = 'Banking Sector';
                else if (titleLower.includes('ssc')) realOrg = 'Staff Selection Commission';
                else if (titleLower.includes('upsc')) realOrg = 'UPSC';

                // 3. ENHANCED CATEGORIZATION
                let category = source.defaultCategory;
                if (titleLower.includes('result') && (titleLower.includes('declared') || titleLower.includes('out') || titleLower.includes('released') || titleLower.includes('announced'))) {
                    category = 'Result';
                } else if (titleLower.includes('admit card') && (titleLower.includes('released') || titleLower.includes('out') || titleLower.includes('available') || titleLower.includes('download'))) {
                    category = 'Admit Card';
                } else if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('it jobs') || titleLower.includes('technician') || titleLower.includes('engineer') || titleLower.includes('tcs') || titleLower.includes('infosys') || titleLower.includes('wipro') || titleLower.includes('cognizant') || titleLower.includes('accenture')) {
                    category = 'IT';
                }

                // Skip Results/Admit Cards that are NOT yet announced
                if ((titleLower.includes('result') || titleLower.includes('admit card')) && category === source.defaultCategory) continue;

                const sanitizedDescription = (item.contentSnippet || item.content || details.professionalTitle)
                    .replace(/<[^>]*>?/gm, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                await Job.create({
                    title: details.professionalTitle,
                    slug: slug,
                    organization: realOrg,
                    postName: details.postName,
                    vacancies: details.vacancies,
                    qualification: details.qualification,
                    location: details.location,
                    salary: details.salary,
                    lastDate: details.lastDate,
                    experience: details.experience,
                    eligibility: details.eligibility,
                    selectionProcess: details.selection,
                    category: category,
                    source: item.link,
                    applyLink: officialLink,
                    description: sanitizedDescription,
                    status: 'PUBLISHED',
                    howToApply: category === 'Result' ? 'Check your result on the official portal.' : category === 'Admit Card' ? 'Download your admit card from the official link.' : `Visit the official portal at ${officialLink} to complete registration.`,
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
