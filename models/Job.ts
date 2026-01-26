import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    // Core Fields
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },

    // Job Details
    postName: { type: String },
    vacancies: { type: String },
    qualification: { type: String },
    ageLimit: { type: String },
    salary: { type: String },
    location: { type: String, default: 'All India' },
    experience: { type: String },

    // Important Dates
    lastDate: { type: Date },
    startDate: { type: Date },
    examDate: { type: Date },
    importantDates: { type: Map, of: String },

    // Eligibility & Process
    eligibility: { type: String },
    selectionProcess: { type: String },
    applicationFee: { type: String },
    howToApply: { type: String },

    // Links
    applyLink: { type: String },
    notificationPdf: { type: String },
    source: { type: String },

    // Content
    description: { type: String },
    shortDescription: { type: String },
    faq: [{ question: String, answer: String }],

    // Categorization
    category: {
        type: String,
        enum: ['Govt', 'Private', 'Result', 'Admit Card', 'Railway', 'Banking', 'Defence', 'Teaching', 'PSU'],
        required: true
    },
    subCategory: { type: String },
    state: { type: String },
    tags: [{ type: String }],

    // Status & Workflow
    status: {
        type: String,
        enum: ['DRAFT', 'PENDING', 'APPROVED', 'PUBLISHED', 'EXPIRED', 'ARCHIVED'],
        default: 'PUBLISHED'
    },

    // Visibility Features
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isToday: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },

    // Analytics
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },

    // Automation & Publishing
    publishedAt: { type: Date },
    telegramPosted: { type: Boolean, default: false },
    whatsappPosted: { type: Boolean, default: false },
    lastRepostedAt: { type: Date },

    // Expiry
    expiresAt: { type: Date },

}, { timestamps: true });

// Indexes for fast queries
JobSchema.index({ category: 1, status: 1, createdAt: -1 });
JobSchema.index({ lastDate: 1 });
JobSchema.index({ isFeatured: 1, isTrending: 1 });
JobSchema.index({ slug: 1 });

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

// Admin User Schema
const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['ADMIN', 'EDITOR', 'VIEWER'], default: 'EDITOR' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

// Activity Log Schema
const LogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    entity: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAILED'] },
}, { timestamps: true });

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', LogSchema);
