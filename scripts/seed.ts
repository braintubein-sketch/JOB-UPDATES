import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/itjobs';

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    isActive: { type: Boolean, default: true },
});

// Job Schema (simplified for seeding)
const JobSchema = new mongoose.Schema({
    company: String,
    title: String,
    roles: [String],
    qualification: String,
    locations: [String],
    experience: {
        min: Number,
        max: Number,
        label: String,
    },
    employmentType: String,
    description: String,
    skills: [String],
    applyLink: String,
    postedDate: Date,
    tags: [String],
    slug: String,
    category: String,
    isVerified: Boolean,
    isActive: Boolean,
    isFeatured: Boolean,
    isNew: Boolean,
    views: Number,
    clicks: Number,
    source: String,
    telegramPosted: Boolean,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

// Sample jobs data
const sampleJobs = [
    {
        company: 'Google',
        title: 'Software Engineer III',
        roles: ['Software Engineer'],
        qualification: 'B.Tech/M.Tech in Computer Science or related field',
        locations: ['Bangalore', 'Hyderabad'],
        experience: { min: 3, max: 5, label: '3-5 Years' },
        employmentType: 'Full-time',
        description: `<h3>About the Role</h3>
    <p>We are looking for a talented Software Engineer to join our team and help build scalable systems.</p>
    <h3>Responsibilities</h3>
    <ul>
      <li>Design and develop high-quality software</li>
      <li>Collaborate with cross-functional teams</li>
      <li>Write clean, maintainable code</li>
      <li>Participate in code reviews</li>
    </ul>
    <h3>Requirements</h3>
    <ul>
      <li>3+ years of software development experience</li>
      <li>Strong problem-solving skills</li>
      <li>Experience with distributed systems</li>
      <li>Excellent communication skills</li>
    </ul>`,
        skills: ['Python', 'Java', 'Go', 'Kubernetes', 'GCP', 'Distributed Systems'],
        applyLink: 'https://careers.google.com/',
        postedDate: new Date(),
        tags: ['google', 'software', 'backend', 'distributed-systems'],
        category: 'Software Engineer',
        isVerified: true,
        isActive: true,
        isFeatured: true,
        isNew: true,
        views: 150,
        clicks: 45,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'Microsoft',
        title: 'Cloud Solutions Architect',
        roles: ['Cloud Engineer', 'Solutions Architect'],
        qualification: 'B.Tech/B.E in CS/IT or equivalent',
        locations: ['Bangalore', 'Hyderabad', 'Noida'],
        experience: { min: 5, max: 8, label: '5-8 Years' },
        employmentType: 'Full-time',
        description: `<h3>About Microsoft</h3>
    <p>Join our Azure team and help enterprises transform their infrastructure.</p>
    <h3>What You'll Do</h3>
    <ul>
      <li>Design cloud architectures for enterprise clients</li>
      <li>Lead technical discussions with customers</li>
      <li>Implement best practices for cloud adoption</li>
    </ul>`,
        skills: ['Azure', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
        applyLink: 'https://careers.microsoft.com/',
        postedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        tags: ['microsoft', 'cloud', 'azure', 'architect'],
        category: 'Cloud Engineer',
        isVerified: true,
        isActive: true,
        isFeatured: true,
        isNew: true,
        views: 120,
        clicks: 35,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'Amazon',
        title: 'Data Engineer',
        roles: ['Data Engineer'],
        qualification: 'B.Tech/M.Tech in CS/Data Science',
        locations: ['Bangalore', 'Chennai', 'Hyderabad'],
        experience: { min: 2, max: 5, label: '2-5 Years' },
        employmentType: 'Full-time',
        description: `<h3>About the Team</h3>
    <p>Build data pipelines that power Amazon's business decisions.</p>
    <h3>Key Responsibilities</h3>
    <ul>
      <li>Design and build data pipelines</li>
      <li>Optimize data warehouse performance</li>
      <li>Work with petabyte-scale data</li>
    </ul>`,
        skills: ['Python', 'SQL', 'Spark', 'AWS', 'Redshift', 'Airflow'],
        applyLink: 'https://www.amazon.jobs/',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['amazon', 'data', 'aws', 'spark'],
        category: 'Data Engineer',
        isVerified: true,
        isActive: true,
        isFeatured: false,
        isNew: true,
        views: 89,
        clicks: 22,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'Meta',
        title: 'Machine Learning Engineer',
        roles: ['ML Engineer', 'AI Engineer'],
        qualification: 'M.Tech/Ph.D in ML/AI/Computer Science',
        locations: ['Bangalore'],
        experience: { min: 3, max: 7, label: '3-7 Years' },
        employmentType: 'Full-time',
        description: `<h3>About Meta AI</h3>
    <p>Work on cutting-edge ML systems powering billions of users.</p>
    <ul>
      <li>Build and deploy ML models at scale</li>
      <li>Research and implement new ML techniques</li>
      <li>Collaborate with product teams</li>
    </ul>`,
        skills: ['PyTorch', 'Python', 'TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision'],
        applyLink: 'https://www.metacareers.com/',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ['meta', 'ml', 'ai', 'deep-learning'],
        category: 'AI/ML Engineer',
        isVerified: true,
        isActive: true,
        isFeatured: true,
        isNew: true,
        views: 200,
        clicks: 55,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'Flipkart',
        title: 'Frontend Developer',
        roles: ['Frontend Developer'],
        qualification: 'B.Tech in Computer Science or equivalent',
        locations: ['Bangalore'],
        experience: { min: 1, max: 3, label: '1-3 Years' },
        employmentType: 'Full-time',
        description: `<h3>About the Role</h3>
    <p>Build beautiful and performant web experiences for millions of users.</p>
    <h3>Requirements</h3>
    <ul>
      <li>Strong JavaScript fundamentals</li>
      <li>Experience with React or Vue</li>
      <li>Understanding of web performance</li>
    </ul>`,
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Redux', 'Next.js'],
        applyLink: 'https://www.flipkartcareers.com/',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        tags: ['flipkart', 'frontend', 'react', 'javascript'],
        category: 'Frontend Developer',
        isVerified: true,
        isActive: true,
        isFeatured: false,
        isNew: true,
        views: 75,
        clicks: 18,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'Infosys',
        title: 'DevOps Engineer',
        roles: ['DevOps Engineer'],
        qualification: 'B.Tech/B.E in any stream',
        locations: ['Bangalore', 'Pune', 'Chennai', 'Mysore'],
        experience: { min: 0, max: 2, label: '0-2 Years' },
        employmentType: 'Full-time',
        description: `<h3>About the Role</h3>
    <p>Join our DevOps team and help automate infrastructure.</p>
    <ul>
      <li>Implement CI/CD pipelines</li>
      <li>Manage cloud infrastructure</li>
      <li>Monitor and optimize systems</li>
    </ul>`,
        skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Linux', 'Python'],
        applyLink: 'https://www.infosys.com/careers/',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['infosys', 'devops', 'fresher', 'docker'],
        category: 'DevOps Engineer',
        isVerified: true,
        isActive: true,
        isFeatured: false,
        isNew: true,
        views: 250,
        clicks: 80,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'TCS',
        title: 'Associate Software Engineer',
        roles: ['Software Engineer'],
        qualification: 'B.Tech/B.E/MCA with 60% or above',
        locations: ['Mumbai', 'Chennai', 'Bangalore', 'Pune', 'Kolkata'],
        experience: { min: 0, max: 1, label: '0-1 Years' },
        employmentType: 'Full-time',
        description: `<h3>TCS NQT Hiring</h3>
    <p>Join India's largest IT company as a fresher!</p>
    <h3>What We Offer</h3>
    <ul>
      <li>Comprehensive training program</li>
      <li>Work on global projects</li>
      <li>Career growth opportunities</li>
    </ul>`,
        skills: ['Java', 'Python', 'SQL', 'Problem Solving', 'DSA'],
        applyLink: 'https://www.tcs.com/careers',
        postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        tags: ['tcs', 'fresher', 'nqt', 'entry-level'],
        category: 'Software Engineer',
        isVerified: true,
        isActive: true,
        isFeatured: false,
        isNew: true,
        views: 500,
        clicks: 150,
        source: 'manual',
        telegramPosted: false,
    },
    {
        company: 'Razorpay',
        title: 'Backend Engineer',
        roles: ['Backend Developer'],
        qualification: 'B.Tech in Computer Science',
        locations: ['Bangalore'],
        experience: { min: 2, max: 5, label: '2-5 Years' },
        employmentType: 'Full-time',
        description: `<h3>Build Payment Infrastructure</h3>
    <p>Work on systems processing billions in transactions.</p>
    <ul>
      <li>Design highly available systems</li>
      <li>Optimize for low latency</li>
      <li>Build secure payment APIs</li>
    </ul>`,
        skills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices'],
        applyLink: 'https://razorpay.com/jobs/',
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ['razorpay', 'backend', 'fintech', 'golang'],
        category: 'Backend Developer',
        isVerified: true,
        isActive: true,
        isFeatured: true,
        isNew: false,
        views: 95,
        clicks: 28,
        source: 'manual',
        telegramPosted: false,
    },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // Create admin user
        console.log('\nCreating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 12);

        await User.findOneAndUpdate(
            { email: 'admin@JOB UPDATES.com' },
            {
                email: 'admin@JOB UPDATES.com',
                password: hashedPassword,
                name: 'Admin',
                role: 'admin',
                isActive: true,
            },
            { upsert: true, new: true }
        );
        console.log('Admin user created: admin@JOB UPDATES.com / admin123');

        // Seed jobs
        console.log('\nSeeding jobs...');
        for (const job of sampleJobs) {
            const slug = `${job.company}-${job.title}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') + '-' + Date.now();

            await Job.findOneAndUpdate(
                { company: job.company, title: job.title },
                { ...job, slug },
                { upsert: true, new: true }
            );
            console.log(`  ✓ ${job.company} - ${job.title}`);
        }

        console.log(`\n✅ Seeded ${sampleJobs.length} jobs successfully!`);
        console.log('\nYou can now run the application with: npm run dev');

    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();

