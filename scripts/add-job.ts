// Script to add a job manually and post to Telegram
// Run with: npx ts-node --esm scripts/add-job.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function generateJobHashtags(job: any): string[] {
    const hashtags: string[] = ['#ITJobs', '#TechJobs', '#Hiring'];

    // Category hashtag
    const categoryTag = job.category.replace(/[^a-zA-Z]/g, '');
    hashtags.push(`#${categoryTag}`);

    // Skills hashtags (max 3)
    job.skills.slice(0, 3).forEach((skill: string) => {
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

async function postJobToTelegram(job: any, siteUrl: string): Promise<number | null> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!token || !channelId) {
        console.log('Telegram credentials missing');
        return null;
    }

    const bot = new TelegramBot(token, { polling: false });

    const hashtags = generateJobHashtags(job);
    const jobUrl = `${siteUrl}/jobs/${job.slug}`;

    // Clean, Simple Template matching user request
    const message = `
<b>Company</b> ${job.company}
<b>Roles</b> ${job.title}${job.roles && job.roles.length > 1 ? ' & other' : ''}
<b>Qualification</b> ${job.qualification}
<b>Location</b> ${job.locations.join(', ')}
<b>Work Experience</b> ${job.experience.label}

<b>Link-</b> <a href="${job.applyLink}">${job.applyLink}</a>

━━━━━━━━━━━━━━━━━━━━━━
📢 Join @BraintubeIndia for daily IT job updates!

${hashtags.join(' ')}
`;

    try {
        const msg = await bot.sendMessage(channelId, message.trim(), {
            parse_mode: 'HTML',
            disable_web_page_preview: false,
        });
        return msg.message_id;
    } catch (error: any) {
        console.error('Failed to post to Telegram:', error.message);
        return null;
    }
}

async function addJob() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not set in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Import models after connection - using .ts extension for ts-node ESM
        const Job = (await import('../src/models/Job.ts')).default;

        // Generate slug manually to satisfy required field validation
        const baseSlug = `Paytm-Intern- Talent Acquisition`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const slug = `${baseSlug}-${Date.now()}`;

        // Job data from user request
        const jobData = {
            company: 'Paytm',
            title: 'Intern- Talent Acquisition',
            slug: slug,
            roles: ['Intern- Talent Acquisition', 'other'],
            qualification: 'Graduate, MBA',
            locations: [
                'Gurugram', 'Noida', 'Amritsar', 'Visakhapatnam',
                'Hyderabad', 'Bangalore', 'Jaipur', 'Mumbai',
                'Pune', 'Ahmedabad', 'Chennai'
            ],
            experience: {
                min: 0,
                max: 13,
                label: '0-13 years'
            },
            employmentType: 'Internship' as const,
            description: 'Paytm is hiring for Intern- Talent Acquisition & other roles. This is an excellent opportunity for fresh graduates and MBA students looking to start their career in Human Resources and Talent Acquisition.',
            skills: ['HR', 'Talent Acquisition', 'Recruitment', 'Communication', 'MS Office'],
            applyLink: 'https://foundthejob.com/paytm-internship/#google_vignette',
            category: 'Other IT Roles' as const,
            isVerified: true,
            isActive: true,
            isFeatured: true,
            source: 'manual' as const,
            sourceUrl: 'https://foundthejob.com/paytm-internship/',
            postedDate: new Date(),
            telegramPosted: false
        };

        // Check if job already exists
        const existingJob = await Job.findOne({
            company: jobData.company,
            title: jobData.title,
            'locations.0': jobData.locations[0]
        });

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobupdate.site';

        if (existingJob) {
            console.log('Job already exists:', existingJob.slug);
            console.log('Updating telegramPosted to false to repost...');

            // Force repost
            const messageId = await postJobToTelegram(existingJob.toObject(), siteUrl);

            if (messageId) {
                existingJob.telegramPosted = true;
                existingJob.telegramMessageId = messageId;
                await existingJob.save();
                console.log('✅ Reposted to Telegram! Message ID:', messageId);
            } else {
                console.log('❌ Failed to post to Telegram');
            }
        } else {
            // Create new job
            const newJob = new Job(jobData);
            await newJob.save();
            console.log('✅ Job created successfully!');
            console.log('Slug:', newJob.slug);

            // Post to Telegram
            const messageId = await postJobToTelegram(newJob.toObject(), siteUrl);

            if (messageId) {
                newJob.telegramPosted = true;
                newJob.telegramMessageId = messageId;
                await newJob.save();
                console.log('✅ Posted to Telegram! Message ID:', messageId);
            } else {
                console.log('❌ Failed to post to Telegram. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID');
            }
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addJob();
