'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function ManualFetchButton() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFetch = async () => {
        setLoading(true);
        setStatus('idle');
        try {
            const res = await fetch('/api/cron/fetch');
            if (!res.ok) throw new Error('Fetch failed');
            setStatus('success');
            // Refresh page after 2 seconds to show new jobs
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFetch}
            disabled={loading}
            className={`btn-premium flex items-center gap-2 ${status === 'success' ? 'bg-green-600 text-white' :
                status === 'error' ? 'bg-red-600 text-white' :
                    'btn-primary'
                }`}
        >
            {loading ? (
                <>
                    <RefreshCw size={18} className="animate-spin" />
                    Fetching...
                </>
            ) : status === 'success' ? (
                <>
                    <CheckCircle size={18} />
                    Updated!
                </>
            ) : status === 'error' ? (
                <>
                    <AlertCircle size={18} />
                    Failed
                </>
            ) : (
                <>
                    <RefreshCw size={18} />
                    Fetch Jobs Now
                </>
            )}
        </button>
    );
}
