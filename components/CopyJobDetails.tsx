'use client';

import { useState } from 'react';
import { Copy, Check, Share2, Send } from 'lucide-react';

interface CopyJobDetailsProps {
    job: {
        title: string;
        organization: string;
        qualification?: string;
        salary?: string;
        lastDate?: string;
        slug: string; // Added slug for website URL
        location?: string;
        category?: string;
    };
}

export default function CopyJobDetails({ job }: CopyJobDetailsProps) {
    const [copied, setCopied] = useState(false);

    // Always use your website URL
    const jobUrl = `https://jobupdate.site/jobs/${job.slug}`;

    const formatJobText = () => {
        const categoryEmoji = job.category === 'Result' ? '📊' : job.category === 'Admit Card' ? '🎫' : '💼';
        const categoryLabel = job.category === 'Result' ? 'RESULT ANNOUNCED' : job.category === 'Admit Card' ? 'ADMIT CARD OUT' : 'NEW JOB ALERT';

        const lines = [
            `${categoryEmoji} *${categoryLabel}*`,
            ``,
            `📢 *${job.title}*`,
            ``,
            `🏢 Organization: ${job.organization}`,
            job.qualification ? `📚 Qualification: ${job.qualification}` : '',
            job.salary ? `💰 Salary: ${job.salary}` : '',
            job.location ? `📍 Location: ${job.location}` : '',
            job.lastDate ? `📅 Last Date: ${new Date(job.lastDate).toLocaleDateString('en-IN')}` : '',
            ``,
            `🔗 *${job.category === 'Result' ? 'View Result' : job.category === 'Admit Card' ? 'Download' : 'Apply Online'}:*`,
            jobUrl,
            ``,
            `━━━━━━━━━━━━━━━━━`,
            `📱 More Updates: jobupdate.site`,
        ].filter(line => line !== '');

        return lines.join('\n');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formatJobText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(formatJobText());
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleTelegramShare = () => {
        const text = encodeURIComponent(formatJobText());
        window.open(`https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${text}`, '_blank');
    };

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={handleCopy}
                className={`btn ${copied ? 'bg-green-600 text-white' : 'btn-secondary'} flex items-center gap-2`}
            >
                {copied ? (
                    <>
                        <Check size={18} />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy size={18} />
                        Copy Details
                    </>
                )}
            </button>

            <button
                onClick={handleWhatsAppShare}
                className="btn bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
                <Share2 size={18} />
                WhatsApp
            </button>

            <button
                onClick={handleTelegramShare}
                className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
                <Send size={18} />
                Telegram
            </button>
        </div>
    );
}
