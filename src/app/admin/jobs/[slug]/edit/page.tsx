'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    X,
    Loader2,
    AlertCircle,
    CheckCircle,
    Save,
} from 'lucide-react';
import { JOB_CATEGORIES, EMPLOYMENT_TYPES } from '@/types';

interface Props {
    params: Promise<{ slug: string }>;
}

export default function EditJobPage({ params }: Props) {
    const { slug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        qualification: '',
        locations: [''],
        experienceMin: 0,
        experienceMax: 15,
        employmentType: 'Full-time',
        description: '',
        skills: [''],
        applyLink: '',
        category: 'Software Engineer',
        tags: [''],
        isFeatured: false,
        isVerified: false,
        isActive: true,
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${slug}`);
                const data = await res.json();
                if (data.success) {
                    const job = data.data;
                    setFormData({
                        company: job.company,
                        title: job.title,
                        qualification: job.qualification,
                        locations: job.locations.length ? job.locations : [''],
                        experienceMin: job.experience?.min || 0,
                        experienceMax: job.experience?.max || 15,
                        employmentType: job.employmentType,
                        description: job.description,
                        skills: job.skills.length ? job.skills : [''],
                        applyLink: job.applyLink,
                        category: job.category,
                        tags: job.tags.length ? job.tags : [''],
                        isFeatured: job.isFeatured || false,
                        isVerified: job.isVerified || false,
                        isActive: job.isActive ?? true,
                    });
                } else {
                    setError('Failed to load job details');
                }
            } catch (err) {
                setError('An error occurred while fetching the job');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const jobData = {
                ...formData,
                locations: formData.locations.filter((l) => l.trim()),
                skills: formData.skills.filter((s) => s.trim()),
                tags: formData.tags.filter((t) => t.trim()),
                experience: {
                    min: formData.experienceMin,
                    max: formData.experienceMax,
                    label: `${formData.experienceMin}-${formData.experienceMax} Years`,
                },
            };

            const res = await fetch(`/api/jobs/${slug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/jobs');
                }, 2000);
            } else {
                setError(data.error || 'Failed to update job');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleArrayField = (
        field: 'locations' | 'skills' | 'tags',
        index: number,
        value: string
    ) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addArrayItem = (field: 'locations' | 'skills' | 'tags') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (field: 'locations' | 'skills' | 'tags', index: number) => {
        const updated = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updated.length ? updated : [''] });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Job Updated Successfully!</h2>
                    <p className="text-muted-foreground">Redirecting to jobs list...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin/jobs"
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Job</h1>
                        <p className="text-muted-foreground">Modify job listing for {formData.company}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="input-premium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Job Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-premium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-premium"
                                    required
                                >
                                    {JOB_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Employment Type *</label>
                                <select
                                    value={formData.employmentType}
                                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                    className="input-premium"
                                    required
                                >
                                    {EMPLOYMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Qualification *</label>
                                <input
                                    type="text"
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                    className="input-premium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Experience (Years)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={formData.experienceMin}
                                        onChange={(e) => setFormData({ ...formData, experienceMin: parseInt(e.target.value) || 0 })}
                                        className="input-premium w-20"
                                    />
                                    <span className="text-muted-foreground">to</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={formData.experienceMax}
                                        onChange={(e) => setFormData({ ...formData, experienceMax: parseInt(e.target.value) || 0 })}
                                        className="input-premium w-20"
                                    />
                                    <span className="text-muted-foreground">years</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Locations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4">Locations</h2>
                        <div className="space-y-3">
                            {formData.locations.map((location, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => handleArrayField('locations', index, e.target.value)}
                                        className="input-premium flex-1"
                                    />
                                    {formData.locations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('locations', index)}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('locations')}
                                className="flex items-center gap-2 text-primary text-sm hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Add Location
                            </button>
                        </div>
                    </motion.div>

                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4">Required Skills</h2>
                        <div className="space-y-3">
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={skill}
                                        onChange={(e) => handleArrayField('skills', index, e.target.value)}
                                        className="input-premium flex-1"
                                    />
                                    {formData.skills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('skills', index)}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('skills')}
                                className="flex items-center gap-2 text-primary text-sm hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Add Skill
                            </button>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4">Job Description *</h2>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-premium min-h-[200px] resize-y"
                            required
                        />
                    </motion.div>

                    {/* Apply Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4">Application</h2>
                        <div>
                            <label className="block text-sm font-medium mb-2">Apply Link *</label>
                            <input
                                type="url"
                                value={formData.applyLink}
                                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                                className="input-premium"
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Options */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4">Options</h2>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded border-border"
                                />
                                <span>Featured Job</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isVerified}
                                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                                    className="w-5 h-5 rounded border-border"
                                />
                                <span>Verified Listing</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded border-border"
                                />
                                <span>Active Listing</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/jobs"
                            className="btn-secondary py-4 px-8"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
