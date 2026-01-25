import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

const OFFICIAL_SOURCES = [
    { name: 'UPSC', url: 'https://upsc.gov.in', description: 'Union Public Service Commission' },
    { name: 'SSC', url: 'https://ssc.nic.in', description: 'Staff Selection Commission' },
    { name: 'NCS', url: 'https://www.ncs.gov.in', description: 'National Career Service' },
    { name: 'IBPS', url: 'https://ibps.in', description: 'Institute of Banking Personnel Selection' },
    { name: 'RRB', url: 'https://indianrailways.gov.in', description: 'Railway Recruitment Board' },
    { name: 'NTA', url: 'https://nta.ac.in', description: 'National Testing Agency' },
];

export default function SourcesPage() {
    return (
        <div className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary">
                            <ShieldCheck size={48} />
                        </div>
                    </div>
                    <h1 className="display-2 mb-4">Official Sources Policy</h1>
                    <p className="text-secondary text-lg">Transparency is our core value. We fetch information ONLY from official Indian government portals and verified corporate websites.</p>
                </div>

                <div className="card-stack space-y-12">
                    <div className="flex gap-6">
                        <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary shrink-0">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black mb-2">Our Data Integrity</h3>
                            <p className="text-secondary leading-relaxed">
                                Every single job post on jobupdate.site contains the direct source URL.
                                We do not host or modify official notification PDFs. We only provide pointers
                                to help applicants reach the official apply portals safely.
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-border">
                        <h4 className="font-black uppercase tracking-widest text-xs text-secondary mb-8">Pillars of Content Verification</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {OFFICIAL_SOURCES.map(source => (
                                <a key={source.name} href={source.url} target="_blank" className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary group">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{source.name}</span>
                                        <span className="text-[10px] uppercase font-black text-secondary tracking-widest">{source.description}</span>
                                    </div>
                                    <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-xs font-bold text-secondary opacity-50">
                        If you find any link not pointing to an official domain, please report it to support@jobupdate.site immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
