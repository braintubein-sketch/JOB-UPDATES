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
        applyLink?: string;
        location?: string;
    };
}

export default function CopyJobDetails({ job }: CopyJobDetailsProps) {
    const [copied, setCopied] = useState(false);

    const formatJobText = () => {
        const lines = [
            `📢 *${job.title}*`,
            ``,
            `🏢 Organization: ${job.organization}`,
            job.qualification ? `📚 Qualification: ${job.qualification}` : '',
            job.salary ? `💰 Salary: ${job.salary}` : '',
            job.location ? `📍 Location: ${job.location}` : '',
            job.lastDate ? `📅 Last Date: ${new Date(job.lastDate).toLocaleDateString('en-IN')}` : '',
            ``,
            job.applyLink ? `🔗 Apply: ${job.applyLink}` : '',
            ``,
            `━━━━━━━━━━━━━━━━━`,
            `📱 More Jobs: jobupdate.site`,
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
        window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
    };

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={handleCopy}
                className={`btn-premium ${copied ? 'bg-green-600 text-white' : 'btn-secondary'} flex items-center gap-2`}
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
                className="btn-premium bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
                <Share2 size={18} />
                WhatsApp
            </button>

            <button
                onClick={handleTelegramShare}
                className="btn-premium bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
                <Send size={18} />
                Telegram
            </button>
        </div>
    );
}
