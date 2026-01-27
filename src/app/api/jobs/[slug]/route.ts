import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { postJobToTelegram } from '@/lib/telegram';

// GET /api/jobs/[slug] - Get job by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        // Try to connect and fetch from DB
        try {
            await connectDB();
            const job = await Job.findOne({ slug, isActive: true });

            if (job) {
                // Increment views
                job.views += 1;
                await job.save();
                return NextResponse.json({ success: true, data: job });
            }
        } catch (dbError) {
            console.warn('MongoDB not available or job not found in DB, checking mock data');
        }

        // Fallback to mock data for development
        const mockJobs = getMockJobs();
        const mockJob = mockJobs.find(j => j.slug === slug);

        if (mockJob) {
            return NextResponse.json({ success: true, data: mockJob });
        }

        return NextResponse.json(
            { success: false, error: 'Job not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Failed to fetch job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch job' },
            { status: 500 }
        );
    }
}

// Mock data helper (same as in jobs/route.ts)
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
            description: '<h3>About the Role</h3><p>Build scalable systems at Google.</p><h3>Responsibilities</h3><ul><li>Design high-quality software</li><li>Collaborate with teams</li></ul>',
            skills: ['Python', 'Java', 'Kubernetes', 'GCP'],
            applyLink: 'https://careers.google.com',
            postedDate: new Date(now - 24 * 60 * 60 * 1000),
            category: 'Software Engineer',
            isVerified: true,
            isFeatured: true,
            isNew: true,
            isActive: true,
            views: 150,
            clicks: 45,
            slug: 'google-software-engineer-iii-mock',
            tags: ['google', 'backend'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
        },
        {
            _id: 'mock-2',
            company: 'Microsoft',
            title: 'Cloud Solutions Architect',
            qualification: 'B.Tech/B.E in CS/IT',
            locations: ['Bangalore', 'Hyderabad', 'Noida'],
            experience: { min: 5, max: 8, label: '5-8 Years' },
            employmentType: 'Full-time',
            description: '<h3>Cloud Architecture</h3><p>Design cloud architectures for enterprise clients.</p>',
            skills: ['Azure', 'AWS', 'Kubernetes', 'Terraform'],
            applyLink: 'https://careers.microsoft.com',
            postedDate: new Date(now - 2 * 24 * 60 * 60 * 1000),
            category: 'Cloud Engineer',
            isVerified: true,
            isFeatured: true,
            isNew: true,
            isActive: true,
            views: 120,
            clicks: 35,
            slug: 'microsoft-cloud-architect-mock',
            tags: ['microsoft', 'cloud', 'azure'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
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
            isNew: true,
            isActive: true,
            views: 89,
            clicks: 22,
            slug: 'amazon-data-engineer-mock',
            tags: ['amazon', 'data'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
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
            isNew: true,
            isActive: true,
            views: 200,
            clicks: 55,
            slug: 'meta-ml-engineer-mock',
            tags: ['meta', 'ml', 'ai'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
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
            isNew: true,
            isActive: true,
            views: 75,
            clicks: 18,
            slug: 'flipkart-frontend-mock',
            tags: ['flipkart', 'frontend', 'react'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
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
            isNew: true,
            isActive: true,
            views: 250,
            clicks: 80,
            slug: 'infosys-devops-mock',
            tags: ['infosys', 'devops', 'fresher'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
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
            isNew: false,
            isActive: true,
            views: 500,
            clicks: 150,
            slug: 'tcs-associate-engineer-mock',
            tags: ['tcs', 'fresher'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
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
            isNew: false,
            isActive: true,
            views: 95,
            clicks: 28,
            slug: 'razorpay-backend-engineer-mock',
            tags: ['razorpay', 'backend', 'fintech'],
            expiryDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
        },
    ];
}

// PATCH /api/jobs/[slug] - Update job
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;
        const body = await request.json();

        const job = await Job.findOneAndUpdate(
            { slug },
            { $set: body },
            { new: true }
        );

        if (!job) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: job });
    } catch (error) {
        console.error('Failed to update job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update job' },
            { status: 500 }
        );
    }
}

// DELETE /api/jobs/[slug] - Delete job
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        const job = await Job.findOneAndDelete({ slug });

        if (!job) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Failed to delete job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}

// POST /api/jobs/[slug] - Special actions (publish to Telegram, track click)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;
        const body = await request.json();
        const { action } = body;

        const job = await Job.findOne({ slug });

        if (!job) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        switch (action) {
            case 'track-click':
                job.clicks += 1;
                await job.save();
                return NextResponse.json({ success: true, message: 'Click tracked' });

            case 'publish-telegram':
                if (job.telegramPosted) {
                    return NextResponse.json(
                        { success: false, error: 'Already posted to Telegram' },
                        { status: 400 }
                    );
                }

                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techhirehub.com';
                const messageId = await postJobToTelegram(job.toObject() as any, siteUrl);

                if (messageId) {
                    job.telegramPosted = true;
                    job.telegramMessageId = messageId;
                    await job.save();
                    return NextResponse.json({ success: true, message: 'Posted to Telegram', messageId });
                } else {
                    return NextResponse.json(
                        { success: false, error: 'Failed to post to Telegram' },
                        { status: 500 }
                    );
                }

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Failed to perform job action:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to perform action' },
            { status: 500 }
        );
    }
}
