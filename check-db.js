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
    createdAt: Date,
    organization: String,
    category: String,
}, { collection: 'jobs' });

async function checkJobs() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-updates';
        console.log(`Using URI: ${mongoUri}`);

        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to MongoDB');

        const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

        const latestJobs = await Job.find().sort({ createdAt: -1 }).limit(5);

        console.log('LATEST 5 JOBS:');
        latestJobs.forEach(job => {
            console.log(`- ${job.title} (${job.organization}) | Created: ${job.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkJobs();
