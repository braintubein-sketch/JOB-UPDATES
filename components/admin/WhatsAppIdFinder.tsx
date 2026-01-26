'use client';

import { useState } from 'react';
import { Search, Loader2, Copy, CheckCircle } from 'lucide-react';

export default function WhatsAppIdFinder() {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const fetchIds = async () => {
        setLoading(true);
        try {
            // We fetch this via a secure proxy route to avoid CORS issues
            const res = await fetch('/api/admin/whatsapp-chats');
            const data = await res.json();
            if (data.success) {
                setChats(data.chats);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Could not connect to WhatsApp Gateway. Check your Render settings.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="card-premium p-6 mt-8 border-t-4 border-t-emerald-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900">WhatsApp ID Finder</h3>
                    <p className="text-sm text-slate-500 font-bold">Find your Channel or Group ID for auto-posting.</p>
                </div>
                <button
                    onClick={fetchIds}
                    disabled={loading}
                    className="btn-action bg-emerald-600 text-white px-6 h-12 rounded-xl text-sm"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Scan All Chats'}
                </button>
            </div>

            {chats.length > 0 && (
                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {chats.map((chat: any) => (
                        <div key={chat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all">
                            <div className="min-w-0">
                                <div className="font-black text-slate-800 truncate">{chat.name || 'Unnamed Chat'}</div>
                                <div className="text-[10px] font-bold text-slate-400 font-mono mt-1 truncate">{chat.id}</div>
                            </div>
                            <button
                                onClick={() => copyToClipboard(chat.id)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied === chat.id ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 hover:text-emerald-600 border border-slate-200 shadow-sm'
                                    }`}
                            >
                                {copied === chat.id ? <CheckCircle size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {chats.length === 0 && !loading && (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                    <Search className="mx-auto text-slate-200 mb-2" size={32} />
                    <p className="text-slate-400 text-xs font-bold">Click "Scan All Chats" to see your ID list.</p>
                </div>
            )}
        </div>
    );
}
