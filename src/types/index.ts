export interface Job {
    _id: string;
    company: string;
    title: string;
    roles: string[];
    qualification: string;
    locations: string[];
    experience: {
        min: number;
        max: number;
        label: string;
    };
    employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';
    description: string;
    skills: string[];
    applyLink: string;
    postedDate: string;
    expiryDate?: string;
    tags: string[];
    slug: string;
    salary?: {
        min?: number;
        max?: number;
        currency: string;
        period: 'yearly' | 'monthly' | 'hourly';
    };
    category: string;
    isVerified: boolean;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    views: number;
    clicks: number;
    source: 'manual' | 'automated' | 'api';
    sourceUrl?: string;
    companyLogo?: string;
    telegramPosted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Company {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    description?: string;
    industry: string;
    size?: string;
    headquarters?: string;
    jobCount: number;
    isVerified: boolean;
}

export interface JobFilters {
    search?: string;
    category?: string;
    location?: string;
    experienceMin?: number;
    experienceMax?: number;
    employmentType?: string;
    company?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    sortBy?: 'postedDate' | 'views' | 'company';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const JOB_CATEGORIES = [
    'Software Engineer',
    'Systems Engineer',
    'Data Engineer',
    'AI/ML Engineer',
    'Cloud Engineer',
    'DevOps Engineer',
    'Cybersecurity',
    'QA/Testing',
    'Product & Tech',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'Other IT Roles',
] as const;

export const EMPLOYMENT_TYPES = [
    'Full-time',
    'Part-time',
    'Internship',
    'Contract',
    'Freelance',
] as const;

export const EXPERIENCE_LEVELS = [
    { label: 'Fresher (0-1 Years)', min: 0, max: 1 },
    { label: 'Junior (1-3 Years)', min: 1, max: 3 },
    { label: 'Mid (3-5 Years)', min: 3, max: 5 },
    { label: 'Senior (5-8 Years)', min: 5, max: 8 },
    { label: 'Lead (8-12 Years)', min: 8, max: 12 },
    { label: 'Expert (12+ Years)', min: 12, max: 20 },
] as const;

export const POPULAR_LOCATIONS = [
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Mumbai',
    'Pune',
    'Delhi NCR',
    'Noida',
    'Gurgaon',
    'Kolkata',
    'Remote',
];

export const POPULAR_SKILLS = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'AWS',
    'Azure',
    'Docker',
    'Kubernetes',
    'SQL',
    'MongoDB',
    'Machine Learning',
    'DevOps',
    'Git',
];
