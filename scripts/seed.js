const mongoose = require('mongoose');

// Use the local or remote connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-updates';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    postName: { type: String },
    vacancies: { type: String },
    qualification: { type: String },
    ageLimit: { type: String },
    salary: { type: String },
    importantDates: { type: Map, of: String },
    selectionProcess: { type: String },
    applicationFee: { type: String },
    notificationPdf: { type: String },
    applyLink: { type: String },
    faq: [{ question: String, answer: String }],
    category: { type: String, enum: ['Govt', 'Private', 'Result', 'Admit Card'], required: true },
    subCategory: { type: String },
    state: { type: String },
    source: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'EXPIRED'], default: 'APPROVED' },
    isFeatured: { type: Boolean, default: false },
    expiresAt: { type: Date },
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const sampleJobs = [
            {
                title: 'UPSC Civil Services Examination 2026 Notification',
                slug: 'upsc-civil-services-2026',
                organization: 'Union Public Service Commission',
                postName: 'IAS, IPS, IFS',
                vacancies: '1056 Posts',
                qualification: 'Any Graduate Degree',
                ageLimit: '21 to 32 Years',
                salary: 'Level 10 (Rs. 56,100 - 1,77,500)',
                category: 'Govt',
                state: 'All India',
                source: 'https://upsc.gov.in',
                applyLink: 'https://upsconline.nic.in',
                status: 'APPROVED',
                expiresAt: new Date('2026-03-05'),
            },
            {
                title: 'SSC CGL 2026 Recruitment - Apply Online',
                slug: 'ssc-cgl-2026-recruitment',
                organization: 'Staff Selection Commission',
                postName: 'Inspector, Assistant, Auditor',
                vacancies: '8500+ Posts (Expected)',
                qualification: 'Bachelor Degree',
                category: 'Govt',
                state: 'All India',
                source: 'https://ssc.nic.in',
                applyLink: 'https://ssc.nic.in',
                status: 'APPROVED',
                expiresAt: new Date('2026-04-10'),
            },
            {
                title: 'SBI PO Recruitment 2026 Notification',
                slug: 'sbi-po-recruitment-2026',
                organization: 'State Bank of India',
                postName: 'Probationary Officer',
                vacancies: '2000 Posts',
                qualification: 'Graduate',
                category: 'Private',
                state: 'All India',
                source: 'https://sbi.co.in/careers',
                status: 'APPROVED',
                expiresAt: new Date('2026-02-28'),
            },
            {
                title: 'Indian Railways RRB NTPC Result 2025 Declared',
                slug: 'rrb-ntpc-result-2025',
                organization: 'Railway Recruitment Board',
                category: 'Result',
                state: 'All India',
                source: 'https://indianrailways.gov.in',
                status: 'APPROVED',
                postName: 'NTPC Graduate Level',
                description: 'The Railway Recruitment Board has officially declared the final results for the NTPC Graduate Level examination 2025.',
                expiresAt: new Date('2026-12-31'),
            },
            {
                title: 'CTET Jan 2026 Admit Card Download',
                slug: 'ctet-jan-2026-admit-card',
                organization: 'CBSE',
                category: 'Admit Card',
                state: 'All India',
                source: 'https://ctet.nic.in',
                status: 'APPROVED',
                postName: 'Teacher Eligibility Test',
                expiresAt: new Date('2026-02-20'),
            },
            {
                title: 'TCS NQT 2026 for Freshers - Registration Open',
                slug: 'tcs-nqt-2026-freshers',
                organization: 'Tata Consultancy Services',
                postName: 'System Engineer',
                vacancies: 'Unlimited',
                qualification: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc',
                category: 'Private',
                state: 'All India',
                source: 'https://learning.tcsionhub.in',
                status: 'APPROVED',
                expiresAt: new Date('2026-05-15'),
            }
        ];

        for (const job of sampleJobs) {
            const existing = await Job.findOne({ slug: job.slug });
            if (!existing) {
                await Job.create(job);
                console.log(`+ Added: ${job.title}`);
            } else {
                console.log(`* Skipped (Exists): ${job.title}`);
            }
        }

        console.log('Seeding complete. Disconnecting...');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding error:', err);
    }
}

seed();
