import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
    _id: mongoose.Types.ObjectId;
    company: string;
    title: string;
    roles: string[];
    qualification: string;
    locations: string[];
    experience: {
        min: number;
        max: number;
        label: string;
    };
    employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';
    description: string;
    skills: string[];
    applyLink: string;
    postedDate: Date;
    expiryDate?: Date;
    tags: string[];
    slug: string;
    salary?: {
        min?: number;
        max?: number;
        currency: string;
        period: 'yearly' | 'monthly' | 'hourly';
    };
    category: string;
    isVerified: boolean;
    isActive: boolean;
    isFeatured: boolean;
    isRecent: boolean;
    views: number;
    clicks: number;
    source: 'manual' | 'automated' | 'api';
    sourceUrl?: string;
    companyLogo?: string;
    telegramPosted: boolean;
    telegramMessageId?: number;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
    {
        company: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        roles: [{
            type: String,
            trim: true,
        }],
        qualification: {
            type: String,
            required: true,
            trim: true,
        },
        locations: [{
            type: String,
            required: true,
            trim: true,
            index: true,
        }],
        experience: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 15 },
            label: { type: String, default: '0-15 Years' },
        },
        employmentType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
            default: 'Full-time',
        },
        description: {
            type: String,
            required: true,
        },
        skills: [{
            type: String,
            trim: true,
            index: true,
        }],
        applyLink: {
            type: String,
            required: true,
        },
        postedDate: {
            type: Date,
            default: Date.now,
            index: true,
        },
        expiryDate: {
            type: Date,
        },
        tags: [{
            type: String,
            trim: true,
            lowercase: true,
            index: true,
        }],
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        salary: {
            min: Number,
            max: Number,
            currency: { type: String, default: 'INR' },
            period: { type: String, enum: ['yearly', 'monthly', 'hourly'], default: 'yearly' },
        },
        category: {
            type: String,
            required: true,
            enum: [
                'Software Engineer',
                'Systems Engineer',
                'Data Engineer',
                'AI/ML Engineer',
                'Cloud Engineer',
                'DevOps Engineer',
                'Cybersecurity',
                'QA/Testing',
                'Product & Tech',
                'Frontend Developer',
                'Backend Developer',
                'Full Stack Developer',
                'Mobile Developer',
                'Other IT Roles',
            ],
            index: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isRecent: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        source: {
            type: String,
            enum: ['manual', 'automated', 'api'],
            default: 'manual',
        },
        sourceUrl: String,
        companyLogo: String,
        telegramPosted: {
            type: Boolean,
            default: false,
        },
        telegramMessageId: Number,
    },
    {
        timestamps: true,
    }
);

// Indexes for search
JobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

// Pre-save middleware to generate slug
JobSchema.pre('save', function (next: any) {
    // Only generate slug if not already provided
    if (!this.slug && (this.isNew || this.isModified('title') || this.isModified('company'))) {
        const baseSlug = `${this.company}-${this.title}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        this.slug = `${baseSlug}-${Date.now()}`;
    }

    // Mark as recent if posted within 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.isRecent = this.postedDate >= sevenDaysAgo;

    next();
});

// Static method to find similar jobs (for deduplication)
JobSchema.statics.findSimilar = async function (job: Partial<IJob>) {
    return this.findOne({
        company: job.company,
        title: job.title,
        'locations.0': job.locations?.[0],
        postedDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
};

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
