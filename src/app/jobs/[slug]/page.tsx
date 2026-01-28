import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailsClient from './JobDetailsClient';
import connectDB from '@/lib/db';
import Job from '@/models/Job';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        await connectDB();
        const job = await Job.findOne({ slug, isActive: true }).lean();

        if (!job) {
            return {
                title: 'Job Not Found',
            };
        }

        const jobData = job as unknown as {
            title: string;
            company: string;
            locations: string[];
            experience: { label: string };
            skills: string[];
            slug: string;
        };

        return {
            title: `${jobData.title} at ${jobData.company}`,
            description: `${jobData.title} job at ${jobData.company}. Location: ${jobData.locations.slice(0, 3).join(', ')}. Experience: ${jobData.experience.label}. Required skills: ${jobData.skills.slice(0, 5).join(', ')}.`,
            openGraph: {
                title: `${jobData.title} at ${jobData.company} | JOB UPDATES`,
                description: `Apply for ${jobData.title} position at ${jobData.company}. ${jobData.experience.label} experience required.`,
                type: 'website',
                url: `https://jobupdate.site/jobs/${jobData.slug}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: `${jobData.title} at ${jobData.company}`,
                description: `Apply for ${jobData.title} at ${jobData.company}`,
            },
        };
    } catch {
        return {
            title: 'Job Details',
        };
    }
}

export default async function JobDetailsPage({ params }: Props) {
    const { slug } = await params;

    return <JobDetailsClient slug={slug} />;
}
