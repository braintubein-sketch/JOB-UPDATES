import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    postName: { type: String },
    vacancies: { type: String },
    qualification: { type: String },
    ageLimit: { type: String },
    salary: { type: String },
    importantDates: { type: Map, of: String }, // { lastDate: "2026-02-15", ... }
    selectionProcess: { type: String },
    applicationFee: { type: String },
    notificationPdf: { type: String },
    applyLink: { type: String },
    faq: [{ question: String, answer: String }],
    category: { type: String, enum: ['Govt', 'Private', 'Result', 'Admit Card'], required: true },
    subCategory: { type: String }, // State-wise, etc.
    state: { type: String },
    source: { type: String }, // Official URL
    status: { type: String, enum: ['PENDING', 'APPROVED', 'EXPIRED'], default: 'APPROVED' },
    isFeatured: { type: Boolean, default: false },
    expiresAt: { type: Date },
}, { timestamps: true });

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

const UpdateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ['RESULT', 'ADMIT_CARD'], required: true },
    organization: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

export const SiteUpdate = mongoose.models.SiteUpdate || mongoose.model('SiteUpdate', UpdateSchema);
