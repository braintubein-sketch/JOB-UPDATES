import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Job from '@/models/Job';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://JOB UPDATES.com';

    // Static pages
    const staticPages = [
        '',
        '/jobs',
        '/companies',
        '/search',
        '/telegram',
        '/about',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic job pages
    let jobPages: MetadataRoute.Sitemap = [];

    try {
        await connectDB();
        const jobs = await Job.find({ isActive: true })
            .select('slug updatedAt')
            .sort({ postedDate: -1 })
            .limit(1000)
            .lean();

        jobPages = jobs.map((job: { slug: string; updatedAt: Date }) => ({
            url: `${baseUrl}/jobs/${job.slug}`,
            lastModified: job.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Failed to fetch jobs for sitemap:', error);
    }

    return [...staticPages, ...jobPages];
}

