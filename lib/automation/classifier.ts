/**
 * INTELLIGENT JOB CLASSIFIER
 * Auto-classifies jobs using keyword + rule-based intelligence
 * Production-grade classification engine
 */

import crypto from 'crypto';

// ============================================
// CLASSIFICATION RULES
// ============================================

const IT_KEYWORDS = [
    'software', 'developer', 'engineer', 'programmer', 'react', 'angular', 'node',
    'java', 'python', 'php', 'devops', 'aws', 'cloud', 'azure', 'kubernetes', 'docker',
    'data analyst', 'ai', 'ml', 'machine learning', 'artificial intelligence',
    'frontend', 'backend', 'fullstack', 'full stack', 'tech lead', 'architect',
    'cybersecurity', 'database', 'sql', 'nosql', 'mongodb', 'postgresql',
    'tcs', 'infosys', 'wipro', 'cognizant', 'hcl', 'tech mahindra', 'accenture',
    'google', 'microsoft', 'amazon', 'meta', 'facebook', 'apple', 'netflix',
    'startup', 'saas', 'fintech', 'edtech', 'healthtech', 'api',
    'angular', 'vue', 'typescript', 'javascript', 'go', 'golang', 'rust', 'scala'
];

const GOVT_KEYWORDS = [
    'ssc', 'upsc', 'rrb', 'ibps', 'ministry', 'department', 'psc', 'kpsc', 'mpsc',
    'uppsc', 'bpsc', 'rpsc', 'gpsc', 'wbpsc', 'tnpsc', 'notification',
    'recruitment board', 'central government', 'state government', 'govt',
    'loksabha', 'rajyasabha', 'secretary', 'commissioner', 'collector',
    'district', 'state level', 'central level', 'public service commission'
];

const BANK_KEYWORDS = [
    'bank', 'po', 'clerk', 'officer', 'rbi', 'sbi', 'ibps', 'nabard', 'sidbi',
    'bank of india', 'bank of baroda', 'canara bank', 'pnb', 'axis bank',
    'hdfc bank', 'icici bank', 'kotak', 'yes bank', 'idbi', 'uco bank',
    'indian bank', 'union bank', 'bob', 'banking', 'probationary officer',
    'specialist officer', 'credit officer', 'rural banking'
];

const RAILWAY_KEYWORDS = [
    'railway', 'rrb', 'ntpc', 'alp', 'group d', 'je', 'sse', 'loco pilot',
    'technician', 'rpf', 'rpsf', 'irctc', 'irtc', 'indian railways',
    'rail', 'train', 'station master', 'ticket collector', 'tc',
    'northern railway', 'southern railway', 'eastern railway', 'western railway',
    'central railway', 'metro', 'dmrc', 'bmrc', 'cmrl', 'nmrc'
];

const POLICE_KEYWORDS = [
    'police', 'constable', 'sub inspector', 'si', 'asi', 'head constable',
    'inspector', 'dsp', 'sp', 'ips', 'crpf', 'bsf', 'cisf', 'itbp', 'ssb',
    'paramilitary', 'defence', 'army', 'navy', 'air force', 'coast guard',
    'nda', 'cds', 'afcat', 'capf', 'security force', 'home guard'
];

const PSU_KEYWORDS = [
    'psu', 'public sector', 'ntpc', 'ongc', 'iocl', 'bpcl', 'hpcl', 'gail',
    'bhel', 'bel', 'hal', 'sail', 'coal india', 'power grid', 'nhpc',
    'oil india', 'drdo', 'isro', 'barc', 'npcil', 'pgcil', 'eil',
    'ircon', 'rites', 'concor', 'nmdc', 'nalco', 'mecl', 'kiocl',
    'moil', 'beml', 'hll', 'mdl', 'grse', 'gsl', 'hsl', 'bdl'
];

const TEACHING_KEYWORDS = [
    'teacher', 'faculty', 'professor', 'lecturer', 'tgt', 'pgt', 'prt',
    'assistant professor', 'associate professor', 'kvs', 'nvs', 'kendriya vidyalaya',
    'navodaya', 'cbse', 'icse', 'ctet', 'tet', 'stet', 'net', 'set',
    'university', 'college', 'school', 'education', 'principal', 'headmaster',
    'coaching', 'tutor', 'educator', 'academic', 'teaching assistant'
];

const RESULT_KEYWORDS = ['result', 'declared', 'scorecard', 'mark sheet', 'cut off', 'cutoff', 'merit list', 'qualified'];
const ADMITCARD_KEYWORDS = ['admit card', 'hall ticket', 'call letter', 'download admit', 'exam date'];

// ============================================
// EXPERIENCE LEVEL DETECTION
// ============================================

export type ExperienceLevel = 'Fresher' | '0-2 Years' | '2-5 Years' | '5+ Years' | 'Experienced' | 'Not Specified';

export function detectExperienceLevel(text: string): ExperienceLevel {
    const t = text.toLowerCase();

    if (t.includes('fresher') || t.includes('entry level') || t.includes('0 year') || t.includes('new graduate')) {
        return 'Fresher';
    }

    const expMatch = t.match(/(\d+)\s*[-–to]+\s*(\d+)\s*years?/i);
    if (expMatch) {
        const min = parseInt(expMatch[1]);
        const max = parseInt(expMatch[2]);
        if (max <= 2) return '0-2 Years';
        if (max <= 5) return '2-5 Years';
        return '5+ Years';
    }

    const singleExp = t.match(/(\d+)\+?\s*years?/i);
    if (singleExp) {
        const years = parseInt(singleExp[1]);
        if (years <= 2) return '0-2 Years';
        if (years <= 5) return '2-5 Years';
        return '5+ Years';
    }

    if (t.includes('experienced') || t.includes('senior') || t.includes('lead')) {
        return 'Experienced';
    }

    return 'Not Specified';
}

// ============================================
// CATEGORY CLASSIFICATION
// ============================================

export type JobCategory = 'IT' | 'Govt' | 'Private' | 'Banking' | 'Railway' | 'Police' | 'Defence' | 'Teaching' | 'PSU' | 'Result' | 'Admit Card';

export function classifyJobCategory(title: string, content: string = '', defaultCategory: string = 'Govt'): JobCategory {
    const text = (title + ' ' + content).toLowerCase();

    // Priority 1: Result / Admit Card (Content Type)
    if (RESULT_KEYWORDS.some(k => text.includes(k))) return 'Result';
    if (ADMITCARD_KEYWORDS.some(k => text.includes(k))) return 'Admit Card';

    // Priority 2: Specific Sector Detection
    const scores: { category: JobCategory; score: number }[] = [
        { category: 'IT', score: IT_KEYWORDS.filter(k => text.includes(k)).length * 2 },
        { category: 'Banking', score: BANK_KEYWORDS.filter(k => text.includes(k)).length * 1.5 },
        { category: 'Railway', score: RAILWAY_KEYWORDS.filter(k => text.includes(k)).length * 1.5 },
        { category: 'Police', score: POLICE_KEYWORDS.filter(k => text.includes(k)).length * 1.5 },
        { category: 'Teaching', score: TEACHING_KEYWORDS.filter(k => text.includes(k)).length * 1.5 },
        { category: 'PSU', score: PSU_KEYWORDS.filter(k => text.includes(k)).length * 1.5 },
        { category: 'Govt', score: GOVT_KEYWORDS.filter(k => text.includes(k)).length },
    ];

    const sorted = scores.sort((a, b) => b.score - a.score);
    if (sorted[0].score >= 2) return sorted[0].category;

    // Fallback based on default
    if (defaultCategory === 'Private') return 'Private';
    return 'Govt';
}

// ============================================
// LOCATION INTELLIGENCE
// ============================================

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Chandigarh', 'Puducherry', 'Lakshadweep', 'Andaman and Nicobar'
];

const MAJOR_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Noida', 'Gurugram', 'Gurgaon',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah',
    'Vijayawada', 'Trivandrum', 'Thiruvananthapuram', 'Coimbatore', 'Madurai', 'Mysore', 'Mysuru'
];

export interface LocationInfo {
    location: string;
    state?: string;
    isRemote: boolean;
    isHybrid: boolean;
}

export function detectLocation(text: string): LocationInfo {
    const t = text.toLowerCase();

    const isRemote = t.includes('remote') || t.includes('work from home') || t.includes('wfh');
    const isHybrid = t.includes('hybrid');

    // Check for specific cities
    for (const city of MAJOR_CITIES) {
        if (t.includes(city.toLowerCase())) {
            // Find state for this city
            let state: string | undefined;
            if (['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'].includes(city)) state = 'Maharashtra';
            if (['Bangalore', 'Bengaluru', 'Mysore', 'Mysuru'].includes(city)) state = 'Karnataka';
            if (['Hyderabad'].includes(city)) state = 'Telangana';
            if (['Chennai', 'Madurai', 'Coimbatore'].includes(city)) state = 'Tamil Nadu';
            if (['Kolkata', 'Howrah'].includes(city)) state = 'West Bengal';
            if (['Delhi', 'Noida', 'Gurgaon', 'Gurugram', 'Faridabad', 'Ghaziabad'].includes(city)) state = 'Delhi NCR';

            const locationStr = isRemote ? `${city} / Remote` : isHybrid ? `${city} (Hybrid)` : city;
            return { location: locationStr, state, isRemote, isHybrid };
        }
    }

    // Check for states
    for (const state of INDIAN_STATES) {
        if (t.includes(state.toLowerCase())) {
            return { location: state, state, isRemote, isHybrid };
        }
    }

    if (isRemote) return { location: 'Remote (India)', isRemote: true, isHybrid: false };
    if (isHybrid) return { location: 'Hybrid (India)', isRemote: false, isHybrid: true };

    return { location: 'All India', isRemote: false, isHybrid: false };
}

// ============================================
// DUPLICATE DETECTION
// ============================================

export function generateJobHash(title: string, organization: string, lastDate?: string): string {
    const normalized = `${title.toLowerCase().trim()}|${organization.toLowerCase().trim()}|${lastDate || ''}`;
    return crypto.createHash('md5').update(normalized).digest('hex');
}

// ============================================
// CONTENT QUALITY VALIDATOR
// ============================================

export interface QualityCheck {
    isValid: boolean;
    score: number; // 0-100
    errors: string[];
    warnings: string[];
}

export function validateJobQuality(data: {
    title?: string;
    organization?: string;
    applyLink?: string;
    lastDate?: Date;
    qualification?: string;
    category?: string;
}): QualityCheck {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Critical Checks
    if (!data.title || data.title.length < 10) {
        errors.push('Title is missing or too short');
        score -= 30;
    }

    if (!data.organization || data.organization.length < 2) {
        errors.push('Organization is missing');
        score -= 25;
    }

    if (!data.applyLink) {
        errors.push('Apply link is missing');
        score -= 25;
    }

    // Link validation (must be official for govt jobs)
    if (data.applyLink && data.category !== 'Private' && data.category !== 'IT') {
        const officialPatterns = ['.gov.in', '.nic.in', '.res.in', '.ac.in', '.edu.in', 'ibps.in', 'sbi.co.in'];
        const isOfficial = officialPatterns.some(p => data.applyLink!.includes(p));
        if (!isOfficial) {
            warnings.push('Apply link may not be from official source');
            score -= 10;
        }
    }

    // Warnings
    if (!data.lastDate && data.category !== 'Result' && data.category !== 'Admit Card') {
        warnings.push('Last date not specified');
        score -= 5;
    }

    if (!data.qualification || data.qualification === 'See Notification') {
        warnings.push('Qualification not clearly specified');
        score -= 5;
    }

    return {
        isValid: errors.length === 0 && score >= 50,
        score: Math.max(0, score),
        errors,
        warnings
    };
}

// ============================================
// MASTER CLASSIFIER
// ============================================

export interface ClassificationResult {
    category: JobCategory;
    experienceLevel: ExperienceLevel;
    location: LocationInfo;
    hash: string;
    quality: QualityCheck;
    subCategory?: string;
    tags: string[];
}

export function classifyJob(data: {
    title: string;
    organization: string;
    content?: string;
    applyLink?: string;
    lastDate?: Date;
    qualification?: string;
    defaultCategory?: string;
}): ClassificationResult {
    const fullText = `${data.title} ${data.organization} ${data.content || ''}`;

    const category = classifyJobCategory(data.title, data.content, data.defaultCategory);
    const experienceLevel = detectExperienceLevel(fullText);
    const location = detectLocation(fullText);
    const hash = generateJobHash(data.title, data.organization, data.lastDate?.toISOString());
    const quality = validateJobQuality({ ...data, category });

    // Generate tags
    const tags: string[] = [category.toLowerCase()];
    if (experienceLevel === 'Fresher') tags.push('freshers');
    if (location.isRemote) tags.push('remote');
    if (location.state) tags.push(location.state.toLowerCase().replace(/\s+/g, '-'));

    // Sub-category for more granular classification
    let subCategory: string | undefined;
    if (category === 'Govt') {
        if (fullText.toLowerCase().includes('central')) subCategory = 'Central Govt';
        else if (fullText.toLowerCase().includes('state')) subCategory = 'State Govt';
    }

    return {
        category,
        experienceLevel,
        location,
        hash,
        quality,
        subCategory,
        tags
    };
}
