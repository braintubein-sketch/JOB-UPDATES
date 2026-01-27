import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Job from '@/models/Job';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobupdate.site';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        '',
        '/jobs',
        '/companies',
        '/search',
        '/telegram',
        '/about',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
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

        jobPages = jobs.map((job: any) => ({
            url: `${baseUrl}/jobs/${job.slug}`,
            lastModified: new Date(job.updatedAt),
            changeFrequency: 'daily' as 'daily',
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Failed to fetch jobs for sitemap:', error);
    }

    return [...staticPages, ...jobPages];
}
