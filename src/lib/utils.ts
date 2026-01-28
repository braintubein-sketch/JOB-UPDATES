import { formatDistanceToNow, format, isWithinInterval, subDays } from 'date-fns';

export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'MMM dd, yyyy');
}

export function formatRelativeDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
}

export function isNewJob(postedDate: string | Date): boolean {
    const d = typeof postedDate === 'string' ? new Date(postedDate) : postedDate;
    const sevenDaysAgo = subDays(new Date(), 7);
    return isWithinInterval(d, { start: sevenDaysAgo, end: new Date() });
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export function formatExperience(min: number, max: number): string {
    if (min === 0 && max === 0) return 'Freshers Only';
    if (min === 0) return `0-${max} Years`;
    if (min === max) return `${min} Years`;
    return `${min}-${max} Years`;
}

export function formatSalary(
    min?: number,
    max?: number,
    currency: string = 'INR',
    period: 'yearly' | 'monthly' | 'hourly' = 'yearly'
): string {
    if (!min && !max) return 'Not Disclosed';

    const formatNumber = (n: number) => {
        if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
        if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
        if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
        return n.toString();
    };

    const periodLabel = period === 'yearly' ? '/year' : period === 'monthly' ? '/month' : '/hour';

    if (min && max) {
        return `${currency} ${formatNumber(min)} - ${formatNumber(max)}${periodLabel}`;
    }
    if (min) return `${currency} ${formatNumber(min)}+${periodLabel}`;
    if (max) return `Up to ${currency} ${formatNumber(max)}${periodLabel}`;
    return 'Not Disclosed';
}

export function formatLocations(locations: string[], maxShow: number = 3): string {
    if (locations.length <= maxShow) return locations.join(', ');
    return `${locations.slice(0, maxShow).join(', ')} +${locations.length - maxShow} more`;
}

export function generateJobHashtags(job: {
    category: string;
    skills: string[];
    experience: { min: number; max: number };
    employmentType: string;
}): string[] {
    const hashtags: string[] = ['#ITJobs', '#TechJobs', '#Hiring'];

    // Category hashtag
    const categoryTag = job.category.replace(/[^a-zA-Z]/g, '');
    hashtags.push(`#${categoryTag}`);

    // Skills hashtags (max 3)
    job.skills.slice(0, 3).forEach(skill => {
        const skillTag = skill.replace(/[^a-zA-Z]/g, '');
        if (skillTag) hashtags.push(`#${skillTag}`);
    });

    // Experience level
    if (job.experience.min === 0) {
        hashtags.push('#Freshers');
    } else if (job.experience.min >= 5) {
        hashtags.push('#SeniorRoles');
    }

    // Employment type
    if (job.employmentType === 'Internship') {
        hashtags.push('#Internship');
    } else if (job.employmentType === 'Remote') {
        hashtags.push('#RemoteJobs');
    }

    return [...new Set(hashtags)];
}

export function parseExperience(text: string): { min: number; max: number } {
    const match = text.match(/(\d+)\s*[-–to]\s*(\d+)/);
    if (match) {
        return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    const single = text.match(/(\d+)/);
    if (single) {
        const num = parseInt(single[1]);
        return { min: num, max: num };
    }
    return { min: 0, max: 15 };
}

export function getExperienceLabel(min: number, max: number): string {
    if (min === 0 && max <= 1) return 'Fresher';
    if (min <= 2 && max <= 4) return 'Junior';
    if (min <= 4 && max <= 7) return 'Mid-Level';
    if (min <= 7 && max <= 12) return 'Senior';
    return 'Lead/Principal';
}

export function getCompanyLogo(companyName: string): string {
    const formattedName = companyName.toLowerCase().trim()
        .replace(/ (?:india|private|limited|ltd|solutions|technologies|services|recruitment|hiring|off campus|drive).*/g, '')
        .replace(/[^a-z0-9]/g, '');

    // High quality logos for major companies (Manual overrides)
    const manualLogos: Record<string, string> = {
        'google': 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
        'microsoft': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        'amazon': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
        'meta': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
        'apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        'netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
        'infosys': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
        'tcs': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
        'wipro': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Wipro_Logo.svg',
        'accenture': 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
        'flipkart': 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fk_header_logo_dot-05622a.svg',
        'swiggy': 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.png',
        'zomato': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.svg',
        'capgemini': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Capgemini_logo.svg',
        'cognizant': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg',
        'hcl': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/HCL_Technologies_logo.svg',
        'oracle': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
        'ibm': 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
        'dell': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg',
        'intel': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%2C_dark_blue%29.svg',
        'hp': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg',
        'samsung': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    };

    if (manualLogos[formattedName]) return manualLogos[formattedName];

    // Better Domain Fallback
    const domain = `${formattedName}.com`;
    // DuckDuckGo Icon API is very reliable for logos
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}
