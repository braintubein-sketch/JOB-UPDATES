import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://jobupdate.site';

    const staticEntries = [
        '',
        '/latest-jobs',
        '/govt-jobs',
        '/private-jobs',
        '/results',
        '/admit-cards',
        '/contact',
        '/about',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    try {
        // Skip DB connection during static optimization if MONGODB_URI is missing
        if (!process.env.MONGODB_URI) return staticEntries;

        await dbConnect();
        const jobs = await Job.find({ status: 'PUBLISHED' })
            .select('slug updatedAt')
            .limit(1000)
            .lean();

        const jobEntries = jobs.map((job: any) => ({
            url: `${baseUrl}/jobs/${job.slug}`,
            lastModified: job.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...staticEntries, ...jobEntries];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return staticEntries;
    }
}
