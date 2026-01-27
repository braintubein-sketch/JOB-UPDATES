import { Job } from '../../models/Job';

// --- Configuration & Constants ---

const OFFICIAL_DOMAINS = [
    '.gov.in', '.nic.in', '.res.in', '.ac.in', '.edu.in', 'ibps.in', 'rbi.org.in',
    'sbi.co.in', 'licindia.in', 'epfindia.gov.in', 'upsc.gov.in', 'ssc.nic.in',
    'indianrailways.gov.in', 'drdo.gov.in', 'isro.gov.in', 'bel-india.in',
    'bhel.com', 'ntpc.co.in', 'ongcindia.com', 'iocl.com', 'powergrid.in',
    'joinindianarmy.nic.in', 'joinindiannavy.gov.in', 'indianairforce.nic.in',
    'apna.co', 'naukri.com', 'linkedin.com' // Trusted private sources
];

const BLACKLISTED_DOMAINS = [
    'sarkariresult', 'freejobalert', 'jagranjosh', 'ambitionbox', 'glassdoor',
    'fresherslive', 'indiatoday', 'timesofindia', 'hindustantimes', 'shiksha',
    'collegedunia', 'careers360', 'testbook', 'adda247'
];

interface RawJobData {
    title: string;
    link: string;
    contentSnippet?: string;
    content?: string;
    sourceName: string;
    defaultCategory: string;
}

export interface NormalizedJob {
    title: string;
    organization: string;
    postName: string;
    vacancies: string;
    qualification: string;
    ageLimit: string;
    salary: string;
    location: string;
    experience: string;
    lastDate?: Date;
    examDate?: Date;
    applyLink: string;
    notificationPdf?: string;
    description: string; // The smart summary
    category: string;
    status: 'PUBLISHED' | 'DRAFT' | 'PENDING';
    isOfficial: boolean;
    validationErrors: string[];
}

export class JobDataNormalizer {

    static normalize(raw: RawJobData): NormalizedJob {
        const fullText = (raw.title + " " + (raw.content || "") + " " + (raw.contentSnippet || "")).toLowerCase();

        // 1. Initial Extraction (similar to existing logic but stricter)
        const org = this.extractOrganization(raw.title);
        const post = this.extractPostName(raw.title, org);
        const category = this.determineCategory(raw.title, raw.defaultCategory);

        // 2. Link Validation
        const isOfficial = this.isOfficialLink(raw.link);
        const linkStatus = isOfficial ? 'PUBLISHED' : 'DRAFT'; // Default to draft if not strict official, but we might allow some

        // 3. Field Extraction
        const vacancies = this.extractVacancies(fullText);
        const qualification = this.extractQualification(fullText);
        const salary = this.extractSalary(fullText);
        const location = this.extractLocation(fullText);
        const experience = this.extractExperience(fullText);
        const lastDate = this.extractDate(fullText, 'last date');
        const examDate = this.extractDate(fullText, 'exam date');

        // 4. Smart Summary Construction
        const description = this.generateSmartSummary(fullText, category);

        // 5. Validation Check
        const errors: string[] = [];
        if (!org || org.length < 2) errors.push("Missing Organization");
        if (!post) errors.push("Missing Post Name");
        if (!raw.link) errors.push("Missing Link");

        // Strict Rule: If it's a "Result" or "Admit Card", we need an exam date or declaration date context
        if (category === 'Result' && !fullText.includes('declared') && !fullText.includes('out')) {
            errors.push("Result status unclear");
        }

        return {
            title: raw.title,
            organization: org,
            postName: post,
            vacancies,
            qualification,
            ageLimit: 'As per rules', // Default, hard to extract reliably without specific patterns
            salary,
            location,
            experience,
            lastDate,
            examDate,
            applyLink: raw.link,
            description,
            category,
            status: errors.length > 0 ? 'DRAFT' : 'PUBLISHED',
            isOfficial,
            validationErrors: errors
        };
    }

    private static extractOrganization(title: string): string {
        // Remove common prefixes/suffixes
        const cleaned = title
            .replace(/(?:Latest|New|Urgent|Breaking|2024|2025)\s*/gi, '')
            .replace(/(?:Notification|Recruitment|Vacancy|Hiring|Apply Online|Result|Admit Card)\s*/gi, '')
            .trim();

        // Heuristic: First segment before a delimiter often contains the Org
        const parts = cleaned.split(/[:|-]/);
        if (parts.length > 0) {
            return parts[0].trim();
        }
        return "Unknown Organization";
    }

    private static extractPostName(title: string, org: string): string {
        let cleaned = title.replace(org, '').trim();
        cleaned = cleaned
            .replace(/(?:Recruitment|Vacancy|Jobs?|Hiring|for|posts?)\s*/gi, '')
            .replace(/[:|-]/g, '')
            .trim();
        return cleaned || "Various Posts";
    }

    private static determineCategory(title: string, defaultCat: string): string {
        const t = title.toLowerCase();
        if (t.includes('result') && (t.includes('declared') || t.includes('out'))) return 'Result';
        if (t.includes('admit card') && (t.includes('download') || t.includes('released'))) return 'Admit Card';
        if (t.includes('software') || t.includes('developer') || t.includes('engineer')) return 'IT';
        return defaultCat;
    }

    private static isOfficialLink(url: string): boolean {
        try {
            const domain = new URL(url).hostname;
            // Check whitelist
            if (OFFICIAL_DOMAINS.some(d => domain.endsWith(d) || domain === d)) return true;
            // Check blacklist
            if (BLACKLISTED_DOMAINS.some(d => domain.includes(d))) return false;
            // Default conservative: if not in blacklist, maybe okay, but strict mode says 'Official Only'
            // For now, let's treat unknown as doubtful (handled in status)
            return false;
        } catch (e) {
            return false;
        }
    }

    private static extractVacancies(text: string): string {
        const match = text.match(/(\d{1,6})\s+(?:Posts?|Vacanc(?:y|ies)|Openings?|Positions?)/i) ||
            text.match(/(?:Total|Over)\s*(\d{1,6})/i);
        return match ? match[1] : "Check Notice";
    }

    private static extractQualification(text: string): string {
        const qualMap = {
            'btech': 'B.Tech', 'mtech': 'M.Tech', 'graduate': 'Any Graduate', 'degree': 'Any Degree',
            'post graduate': 'Post Graduate', '10th': '10th Pass', '12th': '12th Pass', 'hsc': 'HSC', 'ssc': 'SSC',
            'iti': 'ITI', 'diploma': 'Diploma', 'mba': 'MBA', 'mca': 'MCA', 'be': 'B.E', 'bcom': 'B.Com',
            'bsc': 'B.Sc', 'ba': 'B.A', 'law': 'LLB/LLM', 'mbbs': 'MBBS', 'ca': 'Chartered Accountant',
            'phd': 'Ph.D'
        };
        const found = Object.keys(qualMap).filter(k => text.includes(k));
        return found.length > 0 ? Array.from(new Set(found.map(k => (qualMap as any)[k]))).join(', ') : "See Notification";
    }

    private static extractSalary(text: string): string {
        const match = text.match(/(?:salary|stipend|package|lpa|ctc|pay scale|pay)\s*:?\s*(?:rs\.?\s*)?([\d.,\-]+\s*(?:lpa|per month|k|thousand|monthly|annually)?|[\d.,\-]+\s*(?:to|-)\s*[\d.,\-]+\s*(?:lpa|per month|k)?)/i);
        return match ? match[1] : "Best in Industry";
    }

    private static extractLocation(text: string): string {
        const regions = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
            'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
            'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Mumbai', 'Pune',
            'Bangalore', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Noida', 'Gurgaon', 'Gurugram'
        ];
        const found = regions.find(r => text.includes(r.toLowerCase()));
        return found ? found.replace('Bengaluru', 'Bangalore').replace('Gurugram', 'Gurgaon') : "All India";
    }

    private static extractExperience(text: string): string {
        const match = text.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*years?/i) ||
            text.match(/(\d+)\+?\s*years?/i) ||
            text.match(/exp(?:erience)?\s*:?\s*(\d+)/i);
        if (match) {
            return match[2] ? `${match[1]}-${match[2]} Years` : `${match[1]}+ Years`;
        }
        if (text.includes('fresher')) return "Freshers";
        return "Freshers / Experienced";
    }

    private static extractDate(text: string, type: string): Date | undefined {
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const dateRegex = new RegExp(`(\\d{1,2})\\s*(${months.join('|')})\\s*(\\d{4})`, 'i');
        const match = text.match(dateRegex);
        if (match) {
            const d = new Date(`${match[1]} ${match[2]} ${match[3]}`);
            if (!isNaN(d.getTime())) return d;
        }
        return undefined;
    }

    private static generateSmartSummary(text: string, category: string): string {
        const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 25);
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

        return keySentences.length > 0 ? keySentences.join('. ') + '.' : (sentences[0] || "Check details.");
    }
}
