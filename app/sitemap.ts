import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://jobupdate.site';

    // Fetch all approved jobs to include in the sitemap
    const jobs = await prisma.job.findMany({
        where: { status: 'APPROVED' },
        select: { slug: true, updatedAt: true },
    });

    const jobEntries = jobs.map((job: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: job.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const staticPages = [
        '',
        '/latest-jobs',
        '/govt-jobs',
        '/private-jobs',
        '/results',
        '/admit-cards',
        '/about',
        '/contact',
        '/sources',
        '/privacy',
        '/disclaimer',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return [...staticPages, ...jobEntries];
}
