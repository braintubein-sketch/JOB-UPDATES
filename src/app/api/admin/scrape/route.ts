import { NextRequest, NextResponse } from 'next/server';
import JobScraper, {
    isITJob,
    detectCategory,
    extractLocationsFromText,
    extractSkillsFromText,
    parseExperienceFromText,
    normalizeCompanyName
} from '@/lib/scraper';
import * as cheerio from 'cheerio';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Authenticate
        const token = request.cookies.get('auth-token')?.value;
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
        }

        const scraper = new JobScraper();
        const html = await scraper.fetchPage(url);

        if (!html) {
            return NextResponse.json({ success: false, error: 'Failed to fetch the URL' }, { status: 500 });
        }

        const $ = cheerio.load(html);

        // Basic extraction logic - can be refined for specific sites
        // We try to find common patterns or look for meta tags

        let title = $('h1').first().text().trim() || $('title').text().split('|')[0].split('-')[0].trim();
        let company = '';

        // Try to find company name
        const companySelectors = ['.company', '[class*="company"]', '.employer', '.brand'];
        for (const selector of companySelectors) {
            const text = $(selector).first().text().trim();
            if (text) {
                company = text;
                break;
            }
        }

        // If title or company still empty, try meta tags
        if (!title) title = $('meta[property="og:title"]').attr('content')?.split('|')[0].trim() || '';
        if (!company) company = $('meta[property="og:site_name"]').attr('content') || '';

        // Description
        const description = $('article, .description, #description, .job-description, [class*="job-description"]').first().html() || '';
        const plainText = $('body').text();

        if (!isITJob(title, plainText)) {
            // Still return data but warn
            console.warn('Scraped job might not be IT related');
        }

        const skills = extractSkillsFromText(plainText);
        const locations = extractLocationsFromText(plainText);
        const experience = parseExperienceFromText(plainText);
        const category = detectCategory(title, skills);

        return NextResponse.json({
            success: true,
            data: {
                title,
                company: normalizeCompanyName(company),
                description,
                skills,
                locations,
                experience,
                category,
                applyLink: url,
            }
        });

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ success: false, error: 'Failed to scrape job details' }, { status: 500 });
    }
}
