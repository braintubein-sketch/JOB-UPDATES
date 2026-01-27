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
    { url: 'https://www.apna.co/blog/feed/', name: 'Apna Jobs Blog', defaultCategory: 'Private' },
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
            'indiatvnews', 'facebook.com', 'twitter.com', 't.me', 'google.com', 'whatsapp.com',
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

    // 1. SMART ORGANIZATION & TITLE CLEANING
    const cleanerTitle = title
        .replace(/(?:Latest|New|Urgent|Breaking|2024|2025|2026)\s*/gi, '')
        .replace(/(?:Notification|Recruitment|Jobs?|Vacanc(?:y|ies)|Hiring|Apply Online|Released|Out Now|Declared|Registration|Admission|Admit Card|Result)\s*/gi, '')
        .replace(/\d+\s*(?:Posts?|Vacanc(?:y|ies))\s*/gi, '')
        .replace(/@\s*\S+/g, '')
        .replace(/\(\s*\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Intelligence: Try to extract Org from common patterns "Org Name Recruitment" or "Org Name Hiring"
    let realOrg = cleanerTitle.split(/\||-|:/)[0].trim();
    if (realOrg.split(' ').length > 4) realOrg = realOrg.split(' ').slice(0, 3).join(' ');

    const professionalTitle = cleanerTitle;
    let postName = cleanerTitle.replace(realOrg, '').replace(/^[^\w]+|[^\w]+$/g, '').trim() || 'Professional Role';

    // 2. EXPERIENCE EXTRACTION (Better accuracy for "Freshers" vs "Experienced")
    let experience = 'Freshers';
    const expMatch = fullText.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*years?/i) || fullText.match(/(\d+)\+?\s*years?/i) || fullText.match(/exp(?:erience)?\s*:?\s*(\d+)/i);
    if (expMatch) {
        experience = expMatch[2] ? `${expMatch[1]}-${expMatch[2]} Years` : `${expMatch[1]}+ Years`;
    }

    // 3. VACANCY INTELLIGENCE
    let vacancies = 'Check Notice';
    const vacancyMatch = fullText.match(/(\d{1,6})\s+(?:Posts?|Vacanc(?:y|ies)|Openings?|Positions?)/i) || fullText.match(/(?:Total|Over)\s*(\d{1,6})/i);
    if (vacancyMatch) vacancies = vacancyMatch[1];

    // 4. QUALIFICATION EXPANSION
    const qualMap = {
        'btech': 'B.Tech', 'mtech': 'M.Tech', 'graduate': 'Any Graduate', 'degree': 'Any Degree',
        'post graduate': 'Post Graduate', '10th': '10th Pass', '12th': '12th Pass', 'hsc': 'HSC', 'ssc': 'SSC',
        'iti': 'ITI', 'diploma': 'Diploma', 'mba': 'MBA', 'mca': 'MCA', 'be': 'B.E', 'bcom': 'B.Com',
        'bsc': 'B.Sc', 'ba': 'B.A', 'law': 'LLB/LLM', 'mbbs': 'MBBS', 'ca': 'Chartered Accountant',
        'phd': 'Ph.D'
    };
    const foundQuals = Object.keys(qualMap).filter(k => fullText.toLowerCase().includes(k));
    let qualification = foundQuals.length > 0 ? Array.from(new Set(foundQuals.map(k => (qualMap as any)[k]))).join(', ') : 'Graduate / Relevant Degree';

    // 5. SMART LOCATION (States + Major Cities)
    let location = 'All India';
    const regions = [
        'Andra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
        'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Mumbai', 'Pune',
        'Bangalore', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Noida', 'Gurgaon', 'Gurugram'
    ];
    const foundRegion = regions.find(r => fullText.toLowerCase().includes(r.toLowerCase()));
    if (foundRegion) location = foundRegion.replace('Bengaluru', 'Bangalore').replace('Gurugram', 'Gurgaon');

    // 6. SALARY INTELLIGENCE
    let salary = 'Competitive Package';
    const salaryMatch = fullText.match(/(?:salary|stipend|package|lpa|ctc|pay scale|pay)\s*:?\s*(?:rs\.?\s*)?([\d.,\-]+\s*(?:lpa|per month|k|thousand|monthly|annually)?|[\d.,\-]+\s*(?:to|-)\s*[\d.,\-]+\s*(?:lpa|per month|k)?)/i);
    if (salaryMatch) salary = salaryMatch[1];

    // 7. LAST DATE INTELLIGENCE
    let lastDate: Date | undefined = undefined;
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const dateRegex = new RegExp(`(\\d{1,2})\\s*(${months.join('|')})\\s*(\\d{4})`, 'i');
    const dateMatch = fullText.match(dateRegex);

    if (dateMatch) {
        const d = new Date(`${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`);
        if (!isNaN(d.getTime())) lastDate = d;
    }

    if (!lastDate) {
        const shortDateRegex = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s*(${months.join('|')})`, 'i');
        const shortMatch = fullText.match(shortDateRegex);
        if (shortMatch) {
            const d = new Date(`${shortMatch[1]} ${shortMatch[2]} ${new Date().getFullYear()}`);
            if (!isNaN(d.getTime())) lastDate = d;
        }
    }
    if (!lastDate) lastDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

    const sentences = cleanText.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 25);

    // SMART SUMMARY INTELLIGENCE: Ranking sentences by "Information Density"
    const keySentences = sentences
        .filter(s => {
            const lower = s.toLowerCase();
            return (lower.includes('vacancy') || lower.includes('recruitment') ||
                lower.includes('eligible') || lower.includes('qualification') ||
                lower.includes('last date') || lower.includes('apply')) &&
                !lower.includes('click here') && !lower.includes('follow us');
        })
        .sort((a, b) => b.length - a.length)
        .slice(0, 3);

    const smartSummary = keySentences.length > 0
        ? keySentences.join('. ') + '.'
        : sentences.slice(0, 2).join('. ') + '.';

    const eligibility = sentences.find(s => s.toLowerCase().includes('eligible') || s.toLowerCase().includes('criteria') || s.toLowerCase().includes('qualification')) || 'Refer official website for full eligibility details.';
    const selection = sentences.find(s => s.toLowerCase().includes('selection') || s.toLowerCase().includes('interview') || s.toLowerCase().includes('exam') || s.toLowerCase().includes('process')) || 'Selection via Written Exam / Interview.';

    return { vacancies, qualification, lastDate, location, postName, experience, eligibility, selection, professionalTitle, salary, smartSummary, realOrg };
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
                    organization: details.realOrg, // USE THE INTELLIGENTLY EXTRACTED ORG
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
                    description: details.smartSummary, // USE THE SMART SUMMARY instead of full snippet
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
