import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { JobFilters } from '@/types';

// GET /api/jobs - Fetch jobs with filters
export async function GET(request: NextRequest) {
    try {
        // Try to connect to MongoDB
        try {
            await connectDB();
        } catch (dbError) {
            console.warn('MongoDB not configured, returning mock data');
            // Return mock data for development when MongoDB is not configured
            return NextResponse.json({
                success: true,
                data: getMockJobs(),
                pagination: {
                    total: 8,
                    page: 1,
                    limit: 12,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            });
        }

        const searchParams = request.nextUrl.searchParams;

        // Parse query parameters
        const filters: JobFilters = {
            search: searchParams.get('q') || undefined,
            category: searchParams.get('category') || undefined,
            location: searchParams.get('location') || undefined,
            experienceMin: searchParams.get('expMin') ? parseInt(searchParams.get('expMin')!) : undefined,
            experienceMax: searchParams.get('expMax') ? parseInt(searchParams.get('expMax')!) : undefined,
            employmentType: searchParams.get('type') || undefined,
            company: searchParams.get('company') || undefined,
            page: parseInt(searchParams.get('page') || '1'),
            limit: Math.min(parseInt(searchParams.get('limit') || '12'), 50),
            sortBy: (searchParams.get('sortBy') as 'postedDate' | 'views' | 'company') || 'postedDate',
            sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        };

        const featured = searchParams.get('featured') === 'true';

        // Build query
        const query: Record<string, unknown> = { isActive: true };

        if (featured) {
            query.isFeatured = true;
        }

        if (filters.search) {
            query.$text = { $search: filters.search };
        }

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.location) {
            query.locations = { $regex: filters.location, $options: 'i' };
        }

        if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) {
            query['experience.min'] = { $gte: filters.experienceMin || 0 };
            if (filters.experienceMax !== undefined) {
                query['experience.max'] = { $lte: filters.experienceMax };
            }
        }

        if (filters.employmentType) {
            query.employmentType = filters.employmentType;
        }

        if (filters.company) {
            query.company = { $regex: filters.company, $options: 'i' };
        }

        // Calculate pagination
        const skip = ((filters.page || 1) - 1) * (filters.limit || 12);

        // Build sort
        const sort: Record<string, 1 | -1> = {};
        sort[filters.sortBy || 'postedDate'] = filters.sortOrder === 'asc' ? 1 : -1;

        // Execute queries
        const [jobs, total] = await Promise.all([
            Job.find(query)
                .sort(sort)
                .skip(skip)
                .limit(filters.limit || 12)
                .lean(),
            Job.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / (filters.limit || 12));

        return NextResponse.json({
            success: true,
            data: jobs,
            pagination: {
                total,
                page: filters.page || 1,
                limit: filters.limit || 12,
                totalPages,
                hasNext: (filters.page || 1) < totalPages,
                hasPrev: (filters.page || 1) > 1,
            },
        });
    } catch (error) {
        console.error('Failed to fetch jobs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

// Mock jobs data for when MongoDB is not configured
function getMockJobs() {
    const now = Date.now();
    return [
        {
            _id: 'mock-1',
            company: 'Google',
            title: 'Software Engineer III',
            qualification: 'B.Tech/M.Tech in CS',
            locations: ['Bangalore', 'Hyderabad'],
            experience: { min: 3, max: 5, label: '3-5 Years' },
            employmentType: 'Full-time',
            description: '<p>Build scalable systems at Google.</p>',
            skills: ['Python', 'Java', 'Kubernetes', 'GCP'],
            applyLink: 'https://careers.google.com',
            postedDate: new Date(now - 24 * 60 * 60 * 1000),
            category: 'Software Engineer',
            isVerified: true,
            isFeatured: true,
            isRecent: true,
            isActive: true,
            views: 150,
            clicks: 45,
            slug: 'google-software-engineer-iii-mock',
            tags: ['google', 'backend'],
        },
        {
            _id: 'mock-2',
            company: 'Microsoft',
            title: 'Cloud Solutions Architect',
            qualification: 'B.Tech/B.E in CS/IT',
            locations: ['Bangalore', 'Hyderabad', 'Noida'],
            experience: { min: 5, max: 8, label: '5-8 Years' },
            employmentType: 'Full-time',
            description: '<p>Design cloud architectures for enterprise clients.</p>',
            skills: ['Azure', 'AWS', 'Kubernetes', 'Terraform'],
            applyLink: 'https://careers.microsoft.com',
            postedDate: new Date(now - 2 * 24 * 60 * 60 * 1000),
            category: 'Cloud Engineer',
            isVerified: true,
            isFeatured: true,
            isRecent: true,
            isActive: true,
            views: 120,
            clicks: 35,
            slug: 'microsoft-cloud-architect-mock',
            tags: ['microsoft', 'cloud', 'azure'],
        },
        {
            _id: 'mock-3',
            company: 'Amazon',
            title: 'Data Engineer',
            qualification: 'B.Tech/M.Tech in CS',
            locations: ['Bangalore', 'Chennai'],
            experience: { min: 2, max: 5, label: '2-5 Years' },
            employmentType: 'Full-time',
            description: '<p>Build data pipelines at Amazon scale.</p>',
            skills: ['Python', 'SQL', 'Spark', 'AWS', 'Redshift'],
            applyLink: 'https://amazon.jobs',
            postedDate: new Date(now - 3 * 24 * 60 * 60 * 1000),
            category: 'Data Engineer',
            isVerified: true,
            isFeatured: false,
            isRecent: true,
            isActive: true,
            views: 89,
            clicks: 22,
            slug: 'amazon-data-engineer-mock',
            tags: ['amazon', 'data'],
        },
        {
            _id: 'mock-4',
            company: 'Meta',
            title: 'Machine Learning Engineer',
            qualification: 'M.Tech/Ph.D in ML/AI',
            locations: ['Bangalore'],
            experience: { min: 3, max: 7, label: '3-7 Years' },
            employmentType: 'Full-time',
            description: '<p>Work on cutting-edge ML systems.</p>',
            skills: ['PyTorch', 'Python', 'TensorFlow', 'Deep Learning'],
            applyLink: 'https://metacareers.com',
            postedDate: new Date(now - 4 * 24 * 60 * 60 * 1000),
            category: 'AI/ML Engineer',
            isVerified: true,
            isFeatured: true,
            isRecent: true,
            isActive: true,
            views: 200,
            clicks: 55,
            slug: 'meta-ml-engineer-mock',
            tags: ['meta', 'ml', 'ai'],
        },
        {
            _id: 'mock-5',
            company: 'Flipkart',
            title: 'Frontend Developer',
            qualification: 'B.Tech in CS',
            locations: ['Bangalore'],
            experience: { min: 1, max: 3, label: '1-3 Years' },
            employmentType: 'Full-time',
            description: '<p>Build beautiful web experiences.</p>',
            skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
            applyLink: 'https://flipkartcareers.com',
            postedDate: new Date(now - 5 * 24 * 60 * 60 * 1000),
            category: 'Frontend Developer',
            isVerified: true,
            isFeatured: false,
            isRecent: true,
            isActive: true,
            views: 75,
            clicks: 18,
            slug: 'flipkart-frontend-mock',
            tags: ['flipkart', 'frontend', 'react'],
        },
        {
            _id: 'mock-6',
            company: 'Infosys',
            title: 'DevOps Engineer',
            qualification: 'B.Tech/B.E',
            locations: ['Bangalore', 'Pune', 'Chennai'],
            experience: { min: 0, max: 2, label: '0-2 Years' },
            employmentType: 'Full-time',
            description: '<p>Join our DevOps team.</p>',
            skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
            applyLink: 'https://infosys.com/careers',
            postedDate: new Date(now - 6 * 24 * 60 * 60 * 1000),
            category: 'DevOps Engineer',
            isVerified: true,
            isFeatured: false,
            isRecent: true,
            isActive: true,
            views: 250,
            clicks: 80,
            slug: 'infosys-devops-mock',
            tags: ['infosys', 'devops', 'fresher'],
        },
        {
            _id: 'mock-7',
            company: 'TCS',
            title: 'Associate Software Engineer',
            qualification: 'B.Tech/B.E/MCA',
            locations: ['Mumbai', 'Chennai', 'Bangalore'],
            experience: { min: 0, max: 1, label: '0-1 Years' },
            employmentType: 'Full-time',
            description: '<p>Join India\'s largest IT company.</p>',
            skills: ['Java', 'Python', 'SQL'],
            applyLink: 'https://tcs.com/careers',
            postedDate: new Date(now - 7 * 24 * 60 * 60 * 1000),
            category: 'Software Engineer',
            isVerified: true,
            isFeatured: false,
            isRecent: false,
            isActive: true,
            views: 500,
            clicks: 150,
            slug: 'tcs-associate-engineer-mock',
            tags: ['tcs', 'fresher'],
        },
        {
            _id: 'mock-8',
            company: 'Razorpay',
            title: 'Backend Engineer',
            qualification: 'B.Tech in CS',
            locations: ['Bangalore'],
            experience: { min: 2, max: 5, label: '2-5 Years' },
            employmentType: 'Full-time',
            description: '<p>Build payment infrastructure.</p>',
            skills: ['Go', 'Python', 'PostgreSQL', 'Kafka'],
            applyLink: 'https://razorpay.com/jobs',
            postedDate: new Date(now - 8 * 24 * 60 * 60 * 1000),
            category: 'Backend Developer',
            isVerified: true,
            isFeatured: true,
            isRecent: false,
            isActive: true,
            views: 95,
            clicks: 28,
            slug: 'razorpay-backend-engineer-mock',
            tags: ['razorpay', 'backend', 'fintech'],
        },
    ];
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        const requiredFields = ['company', 'title', 'qualification', 'locations', 'description', 'applyLink', 'category'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Check for duplicates
        const existingJob = await Job.findOne({
            company: body.company,
            title: body.title,
            'locations.0': body.locations?.[0],
            postedDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });

        if (existingJob) {
            return NextResponse.json(
                { success: false, error: 'Duplicate job posting detected' },
                { status: 409 }
            );
        }

        const job = new Job({
            ...body,
            experience: body.experience || { min: 0, max: 15, label: '0-15 Years' },
            skills: body.skills || [],
            tags: body.tags || [],
            source: body.source || 'manual',
            postedDate: body.postedDate || new Date(),
        });

        await job.save();

        return NextResponse.json(
            { success: true, data: job },
            { status: 201 }
        );
    } catch (error) {
        console.error('Failed to create job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create job' },
            { status: 500 }
        );
    }
}
