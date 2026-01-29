import connectDB from '../src/lib/db';
import Job from '../src/models/Job';
import { isITJob } from '../src/lib/scraper';
import dotenv from 'dotenv';
dotenv.config();

async function cleanupJunk() {
    await connectDB();
    const jobs = await Job.find({ isActive: true });
    let removed = 0;

    for (const job of jobs) {
        if (!isITJob(job.title, job.description)) {
            console.log(`Removing Junk: ${job.title}`);
            job.isActive = false;
            await job.save();
            removed++;
        }
    }

    console.log(`Cleanup complete. Removed ${removed} junk entries.`);
    process.exit(0);
}

cleanupJunk();
