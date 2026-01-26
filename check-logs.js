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

const LogSchema = new mongoose.Schema({
    action: String,
    status: String,
    createdAt: Date,
    details: String
}, { collection: 'activitylogs' });

async function checkLogs() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI not found');
            return;
        }

        await mongoose.connect(mongoUri);
        const Log = mongoose.models.ActivityLog || mongoose.model('ActivityLog', LogSchema);

        const latestLogs = await Log.find().sort({ createdAt: -1 }).limit(10);
        console.log('LATEST 10 ACTIVITY LOGS:');
        latestLogs.forEach(log => {
            console.log(`- [${log.createdAt}] ${log.action} | Status: ${log.status} | Details: ${log.details}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkLogs();
