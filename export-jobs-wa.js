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
    organization: String,
    category: String,
    qualification: String,
    lastDate: Date
}, { collection: 'jobs' });

async function exportJobs() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) return console.error('DB URI Missing');

        await mongoose.connect(mongoUri);
        const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

        const jobs = await Job.find({ status: { $ne: 'EXPIRED' } }).sort({ createdAt: -1 }).limit(20);

        console.log('--- WHATSAPP CHANNEL MESSAGES ---\n');

        jobs.forEach(job => {
            const link = `https://jobupdate.site/jobs/${job.slug}`;
            const date = job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'Check Notification';

            let emoji = '🚨';
            if (job.category === 'Result') emoji = '✅';
            if (job.category === 'Admit Card') emoji = '🎫';

            console.log(`${emoji} *${job.title}*`);
            console.log(`🏢 *Org:* ${job.organization}`);
            console.log(`🎓 *Qual:* ${job.qualification || 'Refer PDF'}`);
            console.log(`📅 *Last Date:* ${date}`);
            console.log(`🔗 *Apply/Details:* ${link}`);
            console.log('-------------------------------------------');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

exportJobs();
