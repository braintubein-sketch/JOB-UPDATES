import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    description?: string;
    industry: string;
    size?: string;
    headquarters?: string;
    jobCount: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        logo: String,
        website: String,
        description: String,
        industry: {
            type: String,
            default: 'Technology',
        },
        size: String,
        headquarters: String,
        jobCount: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to generate slug
CompanySchema.pre('save', function (next) {
    if (this.isNew || this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
