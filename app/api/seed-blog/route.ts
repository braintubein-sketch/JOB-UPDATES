import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Blog } from '@/models/Blog';
import { generateSlug } from '@/lib/utils';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key !== 'Raghu@2244') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const articles = [
            {
                title: "How to Prepare for Government Exams in 2026: A Complete Guide",
                excerpt: "Cracking a government exam requires a strategic approach. Learn the top tips for SSC, Railway, and Bank exam preparation.",
                content: `
                    Thinking about a career in the government sector? You're not alone. Every year, millions of Indians strive for the stability and prestige of a 'Sarkari Naukri'. Here is how you can stand out:
                    
                    1. Understand the Syllabus: Every board (SSC, UPSC, RRB) has a different pattern. Start by downloading the official notification.
                    2. Consistency is Key: Studying for 4 hours every day is better than studying for 15 hours once a week.
                    3. Mock Tests: This is the secret weapon. Solve at least 2 full-length mock tests per week.
                    4. Current Affairs: Stay updated with daily news updates on portals like JobUpdate.site.
                    
                    Conclusion: With the right dedication and resources, 2026 can be the year you land your dream job.
                `,
                category: "Career Tips"
            },
            {
                title: "Top 5 High-Paying Private Sector Jobs for Freshers in India",
                excerpt: "Looking for a big start? Discover the industries offering the highest packages to new graduates this year.",
                content: `
                    The private sector in India is booming with opportunities for fresh graduates. If you are looking for a high-paying start, consider these fields:
                    
                    1. Data Science & AI: With the rise of LLMs, data specialists are in high demand.
                    2. Full Stack Development: Companies like TCS and Infosys are always hiring skilled developers.
                    3. Digital Marketing: Every brand needs an online presence.
                    4. Product Management: A bridge between technology and business.
                    5. Financial Analysis: Banking and Fintech are offering great entry-level roles.
                `,
                category: "Private Jobs"
            },
            {
                title: "Resume Writing Tips for 2026: Get Noticed by Recruiters",
                excerpt: "Your resume is your first impression. Use these modern tips to bypass ATS and get an interview.",
                content: `
                    In 2026, most resumes are first read by AI (Applicant Tracking Systems). To get past the robot, follow these steps:
                    
                    1. Use Keywords: Match your skills to the job description keywords.
                    2. Simple Formatting: Avoid complex graphics that AI can't read.
                    3. Quantifiable Results: Don't just say 'Team Player'. Say 'Led a team of 5 to increase sales by 20%'.
                    4. Standard Fonts: Stick to Arial or Helvetica.
                `,
                category: "Career Tips"
            },
            {
                title: "Remote Work in India: Future Trends and Opportunities",
                excerpt: "Work-from-home culture is here to stay. Find out which sectors are offering the most remote roles.",
                content: `
                    Since 2020, the landscape of work in India has changed forever. Remote work is no longer just for freelancers. 
                    Top sectors for WFH:
                    - IT & Software Services
                    - Customer Support
                    - Online Teaching
                    - Content Writing
                    - Graphic Design
                    
                    Remote work offers the flexibility to work for global companies while staying in your hometown.
                `,
                category: "Career Tips"
            },
            {
                title: "Why Railway Jobs are still the most sought after in India",
                excerpt: "Explore the benefits, perks, and career growth opportunities offered by the Indian Railways.",
                content: `
                    The Indian Railways (RRB) is one of the world's largest employers. But why do people prefer it over private jobs?
                    1. Job Security: High stability regardless of market conditions.
                    2. Great Perks: Medical benefits, travel passes, and housing.
                    3. Respect: Being a railway employee is a matter of pride in many Indian families.
                    4. Growth: Regular internal promotions and departmental exams.
                `,
                category: "Govt Jobs"
            }
        ];

        for (const art of articles) {
            const slug = generateSlug(art.title);
            await Blog.findOneAndUpdate(
                { slug },
                { ...art, slug },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true, message: "5 AdSense-ready articles seeded!" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
