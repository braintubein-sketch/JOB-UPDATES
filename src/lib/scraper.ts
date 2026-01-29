import axios from 'axios';
import * as cheerio from 'cheerio';
import { Job } from '@/types';

interface ScrapedJob {
    company: string;
    title: string;
    qualification: string;
    locations: string[];
    experience: { min: number; max: number; label: string };
    employmentType: string;
    description: string;
    skills: string[];
    applyLink: string;
    category: string;
    source: 'automated';
    sourceUrl: string;
}

// IT job keywords for filtering
const IT_KEYWORDS = [
    'software', 'developer', 'engineer', 'programmer', 'data', 'cloud',
    'devops', 'frontend', 'backend', 'fullstack', 'full-stack', 'web',
    'mobile', 'ios', 'android', 'react', 'angular', 'vue', 'node',
    'python', 'java', 'javascript', 'typescript', 'golang', 'go',
    'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'ci/cd',
    'machine learning', 'ml', 'ai', 'data science', 'analytics',
    'cybersecurity', 'security', 'network', 'database', 'sql',
    'qa', 'testing', 'automation', 'selenium', 'api', 'rest',
    'microservices', 'product', 'tech lead', 'architect',
    'intern', 'graduate', 'trainee', 'fresher', 'associate',
    'it', 'technical', 'support', 'analyst', 'consultant',
];

// Non-IT keywords to filter out
const EXCLUDE_KEYWORDS = [
    'government', 'ssc', 'upsc', 'railway', 'bank clerk', 'admit card',
    'result', 'answer key', 'exam date', 'syllabus', 'govt', 'politics',
    'political', 'cricket', 'bollywood', 'entertainment', 'crime',
];

export function normalizeUrl(url: string, baseUrl?: string): string {
    if (!url) return '';
    let cleaned = url.trim();

    // Handle mailto links
    if (cleaned.startsWith('mailto:')) return cleaned;

    // Handle protocol relative links
    if (cleaned.startsWith('//')) cleaned = 'https:' + cleaned;

    // Handle relative links if baseUrl is provided
    if (cleaned.startsWith('/') && baseUrl) {
        try {
            const base = new URL(baseUrl);
            return `${base.protocol}//${base.host}${cleaned}`;
        } catch (e) {
            return cleaned;
        }
    }

    // Add https if protocol is missing (e.g. "www.google.com")
    if (!cleaned.startsWith('http') && cleaned.includes('.')) {
        cleaned = 'https://' + cleaned;
    }

    return cleaned;
}

export function isITJob(title: string, description: string = ''): boolean {
    const text = `${title} ${description}`.toLowerCase();

    // Check if it contains any exclusion keywords
    if (EXCLUDE_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
        return false;
    }

    // Check if it contains IT keywords as whole words
    return IT_KEYWORDS.some(keyword => {
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
        return regex.test(text);
    });
}

export function detectCategory(title: string, skills: string[] = []): string {
    const text = `${title} ${skills.join(' ')}`.toLowerCase();

    if (text.includes('ml') || text.includes('machine learning') || text.includes('ai') || text.includes('data science')) {
        return 'AI/ML Engineer';
    }
    if (text.includes('devops') || text.includes('sre') || text.includes('reliability')) {
        return 'DevOps Engineer';
    }
    if (text.includes('cloud') || text.includes('aws') || text.includes('azure') || text.includes('gcp')) {
        return 'Cloud Engineer';
    }
    if (text.includes('data engineer') || text.includes('etl') || text.includes('data pipeline')) {
        return 'Data Engineer';
    }
    if (text.includes('security') || text.includes('cyber')) {
        return 'Cybersecurity';
    }
    if (text.includes('qa') || text.includes('test') || text.includes('quality')) {
        return 'QA/Testing';
    }
    if (text.includes('frontend') || text.includes('front-end') || text.includes('ui developer')) {
        return 'Frontend Developer';
    }
    if (text.includes('backend') || text.includes('back-end')) {
        return 'Backend Developer';
    }
    if (text.includes('fullstack') || text.includes('full-stack') || text.includes('full stack')) {
        return 'Full Stack Developer';
    }
    if (text.includes('mobile') || text.includes('ios') || text.includes('android') || text.includes('flutter')) {
        return 'Mobile Developer';
    }
    if (text.includes('product') || text.includes('program manager')) {
        return 'Product & Tech';
    }
    if (text.includes('system')) {
        return 'Systems Engineer';
    }

    return 'Software Engineer';
}

export function parseExperienceFromText(text: string): { min: number; max: number; label: string } {
    const patterns = [
        /(\d+)\s*[-–to]+\s*(\d+)\s*(?:years?|yrs?)/i,
        /(\d+)\+?\s*(?:years?|yrs?)/i,
        /fresher|entry.level|graduate/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            if (match[0].toLowerCase().includes('fresher') || match[0].toLowerCase().includes('entry')) {
                return { min: 0, max: 1, label: '0-1 Years (Fresher)' };
            }
            if (match[2]) {
                const min = parseInt(match[1]);
                const max = parseInt(match[2]);
                return { min, max, label: `${min}-${max} Years` };
            }
            if (match[1]) {
                const val = parseInt(match[1]);
                return { min: val, max: val + 2, label: `${val}+ Years` };
            }
        }
    }

    return { min: 0, max: 15, label: '0-15 Years' };
}

export function extractSkillsFromText(text: string): string[] {
    const skillPatterns = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang', 'Rust',
        'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git',
        'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
        'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Agile', 'Scrum',
        'Linux', 'Unix', 'Shell Scripting', 'Bash',
        'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    ];

    const foundSkills: string[] = [];
    const textLower = text.toLowerCase();

    for (const skill of skillPatterns) {
        if (textLower.includes(skill.toLowerCase())) {
            foundSkills.push(skill);
        }
    }

    return [...new Set(foundSkills)].slice(0, 10);
}

export function extractRolesFromTitle(title: string): string[] {
    const roles_list = [
        'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Data Scientist', 'Data Engineer', 'DevOps Engineer', 'Cloud Architect',
        'QA Engineer', 'Mobile Developer', 'UI/UX Designer', 'Product Manager',
        'System Administrator', 'Network Engineer', 'Security Analyst', 'Cybersecurity Engineer',
        'Machine Learning Engineer', 'AI Research Scientist', 'Site Reliability Engineer',
        'Technical Support Engineer', 'Intern', 'Business Analyst', 'Solution Architect'
    ];

    const foundValues: string[] = [];
    const lowerTitle = title.toLowerCase();

    for (const role of roles_list) {
        if (lowerTitle.includes(role.toLowerCase())) {
            foundValues.push(role);
        }
    }

    // Also check for common words like "Developer" or "Engineer" if nothing specific found
    if (foundValues.length === 0) {
        if (lowerTitle.includes('developer')) foundValues.push('Developer');
        if (lowerTitle.includes('engineer')) foundValues.push('Engineer');
        if (lowerTitle.includes('analyst')) foundValues.push('Analyst');
        if (lowerTitle.includes('manager')) foundValues.push('Manager');
    }

    return foundValues.length > 0 ? [...new Set(foundValues)] : [title];
}

export function extractLocationsFromText(text: string): string[] {
    const indianCities = [
        'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune', 'Delhi',
        'NCR', 'Noida', 'Gurgaon', 'Gurugram', 'Kolkata', 'Ahmedabad', 'Jaipur',
        'Kochi', 'Trivandrum', 'Chandigarh', 'Indore', 'Mysore', 'Coimbatore',
        'Remote', 'Work from Home', 'WFH', 'Hybrid',
    ];

    const foundLocations: string[] = [];
    const textLower = text.toLowerCase();

    for (const city of indianCities) {
        if (textLower.includes(city.toLowerCase())) {
            // Normalize city names
            let normalizedCity = city;
            if (city === 'Bengaluru') normalizedCity = 'Bangalore';
            if (city === 'Gurugram') normalizedCity = 'Gurgaon';
            if (city === 'Work from Home' || city === 'WFH') normalizedCity = 'Remote';

            if (!foundLocations.includes(normalizedCity)) {
                foundLocations.push(normalizedCity);
            }
        }
    }

    return foundLocations.length > 0 ? foundLocations : ['India'];
}

export function extractQualificationFromText(text: string): string {
    const qualifications = [
        'B.E', 'B.Tech', 'M.E', 'M.Tech', 'MCA', 'BCA', 'B.Sc', 'M.Sc',
        'MBA', 'Any Graduate', 'MBBS', 'MD', 'Ph.D', 'Diploma', 'B.Com', 'M.Com'
    ];

    const found: string[] = [];
    const textUpper = text.toUpperCase();

    // Check for common combinations like B.E/B.Tech
    if (textUpper.includes('B.E') || textUpper.includes('B.TECH')) {
        found.push('B.E/B.Tech');
    }
    if (textUpper.includes('M.E') || textUpper.includes('M.TECH')) {
        found.push('M.E/M.Tech');
    }

    for (const q of qualifications) {
        if (q.includes('/')) continue; // Handled above
        if (q === 'B.E' || q === 'B.Tech' || q === 'M.E' || q === 'M.Tech') continue; // Handled above

        // Use word boundary to avoid matching "MD" in "Mumbai-Delhi"
        const regex = new RegExp(`\\b${q.replace('.', '\\.')}\\b`, 'i');
        if (regex.test(text)) {
            found.push(q);
        }
    }

    if (found.length > 0) {
        // Remove duplicates and join
        return [...new Set(found)].join(', ');
    }

    return 'Any Graduate';
}

export function validateApplyLink(url: string): boolean {
    if (!url) return false;

    try {
        const parsed = new URL(url);

        // Check for trusted domains
        const trustedDomains = [
            'careers.google.com', 'careers.microsoft.com', 'amazon.jobs',
            'metacareers.com', 'linkedin.com', 'naukri.com', 'indeed.com',
            'lever.co', 'greenhouse.io', 'workday.com', 'smartrecruiters.com',
            'jobs.lever.co', 'boards.greenhouse.io',
        ];

        // Check if it's https
        if (parsed.protocol !== 'https:') return false;

        // Check if it's a career/jobs page
        const isCareerPage =
            parsed.pathname.includes('career') ||
            parsed.pathname.includes('job') ||
            parsed.pathname.includes('apply') ||
            parsed.hostname.includes('career') ||
            parsed.hostname.includes('jobs') ||
            trustedDomains.some(domain => parsed.hostname.includes(domain));

        return isCareerPage;
    } catch {
        return false;
    }
}

export function generateJobSlug(company: string, title: string): string {
    const base = `${company}-${title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${base}-${Date.now()}`;
}

export function normalizeEmploymentType(type: string): 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance' {
    const lower = (type || '').toLowerCase();

    if (lower.includes('full') || lower.includes('full_time')) return 'Full-time';
    if (lower.includes('part')) return 'Part-time';
    if (lower.includes('intern')) return 'Internship';
    if (lower.includes('contract')) return 'Contract';
    if (lower.includes('freelance')) return 'Freelance';

    return 'Full-time'; // Default
}

export function normalizeCompanyName(name: string): string {
    if (!name) return 'Unknown';

    const normalizations: Record<string, string> = {
        'google llc': 'Google',
        'google inc': 'Google',
        'microsoft corporation': 'Microsoft',
        'amazon.com': 'Amazon',
        'meta platforms': 'Meta',
        'facebook': 'Meta',
        'apple inc': 'Apple',
        'infosys limited': 'Infosys',
        'tata consultancy services': 'TCS',
        'wipro limited': 'Wipro',
        'accenture solutions': 'Accenture',
        'capgemini technology services': 'Capgemini',
        'cognizant technology solutions': 'Cognizant',
        'hcl technologies': 'HCL',
        'tech mahindra limited': 'Tech Mahindra',
        'paytm': 'Paytm',
        'phonepe': 'PhonePe',
        'zomato': 'Zomato',
        'swiggy': 'Swiggy',
        'ola electric': 'Ola',
        'razorpay': 'Razorpay',
        'standard chartered bank': 'Standard Chartered',
        'jpmorgan chase': 'JPMorgan Chase',
        'goldman sachs': 'Goldman Sachs'
    };

    let cleanedCandidate = name.trim()
        .replace(/\b(Pvt|Private)\b.*$/i, '')
        .replace(/\b(Ltd|Limited)\b/gi, '')
        .replace(/\b(Inc|LLC|Corp|Corporation|Solutions|Technologies|Tech)\b/gi, '')
        .replace(/[.,]/g, '')
        .trim();

    const lower = cleanedCandidate.toLowerCase();

    for (const [key, value] of Object.entries(normalizations)) {
        if (lower.includes(key)) return value;
    }

    return cleanedCandidate || name;
}

// Rate limiting helper
export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Scraping utilities class
export class JobScraper {
    private userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ];

    private getRandomUserAgent(): string {
        return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    }

    async fetchPage(url: string): Promise<string | null> {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                },
                timeout: 30000,
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            return null;
        }
    }

    // Add more scraping methods here for specific job sites
}

export default JobScraper;
