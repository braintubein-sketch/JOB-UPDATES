const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts[0] && parts[1]) {
                    process.env[parts[0].trim()] = parts[1].trim().replace(/^"|"$/g, '');
                }
            });
        }
    } catch (e) { }
}

loadEnv();

const JobSchema = new mongoose.Schema({
    title: String,
    slug: String,
    createdAt: Date,
}, { collection: 'jobs' });

async function checkSlugs() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI not found');
            return;
        }

        await mongoose.connect(mongoUri);
        const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

        const latestJobs = await Job.find().sort({ createdAt: -1 }).limit(10);

        console.log('LATEST 10 JOBS WITH SLUGS:');
        latestJobs.forEach(job => {
            console.log(`- ${job.title}`);
            console.log(`  Slug in DB: ${job.slug}`);
            console.log('------------------');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkSlugs();
