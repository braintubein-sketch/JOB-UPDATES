'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { JOB_CATEGORIES, EMPLOYMENT_TYPES } from '@/types';

export default function AddJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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

            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/dashboard');
                }, 2000);
            } else {
                setError(data.error || 'Failed to create job');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
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
                    <h2 className="text-2xl font-bold mb-2">Job Created Successfully!</h2>
                    <p className="text-muted-foreground">Redirecting to dashboard...</p>
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
                        href="/admin/dashboard"
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Add New Job</h1>
                        <p className="text-muted-foreground">Create a new IT job listing</p>
                    </div>
                </div>

                {/* Auto-fill from URL */}
                <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <motion.span
                            animate={{ rotate: [0, 15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ⚡
                        </motion.span>
                        Quick Add from URL
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Paste a career page URL to automatically extract job details (Beta).
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            id="scrape-url"
                            placeholder="https://careers.google.com/jobs/results/..."
                            className="input-premium flex-1"
                        />
                        <button
                            type="button"
                            onClick={async () => {
                                const url = (document.getElementById('scrape-url') as HTMLInputElement).value;
                                if (!url) return;

                                setLoading(true);
                                try {
                                    const res = await fetch('/api/admin/scrape', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ url }),
                                    });
                                    const data = await res.json();

                                    if (data.success) {
                                        const d = data.data;
                                        setFormData(prev => ({
                                            ...prev,
                                            company: d.company || prev.company,
                                            title: d.title || prev.title,
                                            description: d.description || prev.description,
                                            applyLink: d.applyLink || prev.applyLink,
                                            category: d.category || prev.category,
                                            locations: d.locations?.length ? d.locations : prev.locations,
                                            skills: d.skills?.length ? d.skills : prev.skills,
                                            experienceMin: d.experience?.min ?? prev.experienceMin,
                                            experienceMax: d.experience?.max ?? prev.experienceMax,
                                        }));
                                    } else {
                                        setError(data.error || 'Failed to scrape URL');
                                    }
                                } catch (err) {
                                    setError('Failed to connect to scraper');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="btn-primary px-6"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Auto-fill'}
                        </button>
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
                                    placeholder="e.g. Google"
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
                                    placeholder="e.g. Software Engineer III"
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
                                    placeholder="e.g. B.Tech/M.Tech in CS/IT"
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
                                        placeholder="e.g. Bangalore"
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
                                        placeholder="e.g. React, Node.js"
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
                            placeholder="Enter job description (HTML supported)..."
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-2">HTML tags are supported for formatting.</p>
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
                                placeholder="https://careers.company.com/apply/..."
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
                        </div>
                    </motion.div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Job...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Create Job
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/dashboard"
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
