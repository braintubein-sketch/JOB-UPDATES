import mongoose from 'mongoose';

// ============================================
// RESULT MODEL
// ============================================

const ResultSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    examName: { type: String, required: true },
    organization: { type: String, required: true },

    releaseDate: { type: Date },

    resultLink: { type: String, required: true },
    directLink: { type: String }, // Direct PDF/Result page link
    notificationPdf: { type: String },

    cutOffMarks: { type: String },
    totalCandidates: { type: String },
    selectedCandidates: { type: String },

    description: { type: String },

    source: { type: String },
    sourceUrl: { type: String },

    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'PUBLISHED'
    },

    telegramPosted: { type: Boolean, default: false },
    whatsappPosted: { type: Boolean, default: false },

    views: { type: Number, default: 0 },

    // Duplicate prevention
    contentHash: { type: String, unique: true, sparse: true },

}, { timestamps: true });

ResultSchema.index({ organization: 1, releaseDate: -1 });
ResultSchema.index({ status: 1, createdAt: -1 });

export const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);

// ============================================
// ADMIT CARD MODEL
// ============================================

const AdmitCardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    examName: { type: String, required: true },
    organization: { type: String, required: true },

    releaseDate: { type: Date },
    examDate: { type: Date },

    downloadLink: { type: String, required: true },
    directLink: { type: String }, // Direct download page
    notificationPdf: { type: String },

    examCenter: { type: String },
    reportingTime: { type: String },

    description: { type: String },

    source: { type: String },
    sourceUrl: { type: String },

    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'PUBLISHED'
    },

    telegramPosted: { type: Boolean, default: false },
    whatsappPosted: { type: Boolean, default: false },

    views: { type: Number, default: 0 },

    // Duplicate prevention
    contentHash: { type: String, unique: true, sparse: true },

}, { timestamps: true });

AdmitCardSchema.index({ organization: 1, examDate: -1 });
AdmitCardSchema.index({ status: 1, createdAt: -1 });

export const AdmitCard = mongoose.models.AdmitCard || mongoose.model('AdmitCard', AdmitCardSchema);

// ============================================
// AUTOMATION LOG MODEL
// ============================================

const AutomationLogSchema = new mongoose.Schema({
    runType: {
        type: String,
        enum: ['FETCH_JOBS', 'FETCH_RESULTS', 'FETCH_ADMITCARDS', 'TELEGRAM_POST', 'CLEANUP'],
        required: true
    },

    status: {
        type: String,
        enum: ['STARTED', 'COMPLETED', 'FAILED'],
        required: true
    },

    stats: {
        fetched: { type: Number, default: 0 },
        added: { type: Number, default: 0 },
        skipped: { type: Number, default: 0 },
        duplicates: { type: Number, default: 0 },
        errors: { type: Number, default: 0 },
        posted: { type: Number, default: 0 },
    },

    sources: [{ type: String }],

    errorDetails: [{
        source: String,
        message: String,
        timestamp: Date
    }],

    duration: { type: Number }, // in milliseconds

}, { timestamps: true });

AutomationLogSchema.index({ runType: 1, createdAt: -1 });

export const AutomationLog = mongoose.models.AutomationLog || mongoose.model('AutomationLog', AutomationLogSchema);

// ============================================
// DUPLICATE HASH TRACKER
// ============================================

const ContentHashSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    contentType: { type: String, enum: ['JOB', 'RESULT', 'ADMITCARD'], required: true },
    title: { type: String },
    createdAt: { type: Date, default: Date.now },
});

ContentHashSchema.index({ hash: 1 });
ContentHashSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // Auto-delete after 90 days

export const ContentHash = mongoose.models.ContentHash || mongoose.model('ContentHash', ContentHashSchema);
