import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../src/lib/db';
import Job from '../src/models/Job';

async function checkJobLinks() {
    await connectDB();
    const jobs = await Job.find({
        applyLink: { $regex: /^\/\// }
    }).sort({ createdAt: -1 }).limit(100);
    console.log(`--- Found ${jobs.length} Protocol-Relative Links ---`);
    jobs.forEach(job => {
        console.log(`Company: ${job.company}`);
        console.log(`Title: ${job.title}`);
        console.log(`Apply Link: ${job.applyLink}`);
        console.log(`Source: ${job.source}`);
        console.log(`Source URL: ${job.sourceUrl}`);
        console.log('------------------------------');
    });
    process.exit(0);
}

checkJobLinks();
