import { ExternalLink, CheckCircle } from 'lucide-react';

const OFFICIAL_SOURCES = [
    { name: 'UPSC (Union Public Service Commission)', url: 'https://upsc.gov.in' },
    { name: 'SSC (Staff Selection Commission)', url: 'https://ssc.gov.in' },
    { name: 'IBPS (Institute of Banking Personnel Selection)', url: 'https://ibps.in' },
    { name: 'National Career Service (NCS)', url: 'https://ncs.gov.in' },
    { name: 'Press Information Bureau (PIB)', url: 'https://pib.gov.in' },
    { name: 'Employment News / Rozgar Samachar', url: 'http://employmentnews.gov.in' },
    { name: 'Indian Railways (RRB)', url: 'https://indianrailways.gov.in' },
    { name: 'State Bank of India (Careers)', url: 'https://sbi.co.in/web/careers' },
];

export default function SourcesPage() {
    return (
        <div className="container py-20 max-w-4xl">
            <h1 className="text-3xl font-bold mb-4">Official Sources of Information</h1>
            <p className="text-secondary mb-12">Transparency is our priority. Below are the official portals we use to verify all our updates.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OFFICIAL_SOURCES.map((source) => (
                    <div key={source.name} className="bg-card-bg p-6 rounded-2xl border border-border flex justify-between items-center group hover:border-primary transition-all">
                        <div>
                            <h3 className="font-bold text-sm mb-1">{source.name}</h3>
                            <span className="text-xs text-secondary flex items-center gap-1">
                                <CheckCircle size={10} className="text-green-500" /> Verified Source
                            </span>
                        </div>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ExternalLink size={18} />
                        </a>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-8 glass rounded-2xl border border-border">
                <h2 className="text-xl font-bold mb-4">Request a Source Verification</h2>
                <p className="text-sm text-secondary leading-relaxed mb-6">
                    Spotted a job update that doesn't match an official source? Let us know immediately and we will investigate and correct the information.
                </p>
                <button className="btn btn-outline">Contact Verification Team</button>
            </div>
        </div>
    );
}
