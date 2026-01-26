import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    category: { type: String, default: 'Career Tips' },
    image: { type: String },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED'],
        default: 'PUBLISHED'
    },
    views: { type: Number, default: 0 },
}, { timestamps: true });

BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: -1 });

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
