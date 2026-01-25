import { ShieldCheck, Info, ExternalLink, Globe, CheckCircle } from 'lucide-react';

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
        <div className="section-premium">
            <div className="container-premium max-w-4xl">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600">
                            <ShieldCheck size={40} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Official Sources Policy</h1>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto">
                        Transparency is our core value. We fetch information ONLY from official Indian government portals and verified corporate websites.
                    </p>
                </div>

                <div className="card-premium space-y-12 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                            <Info size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Our Data Integrity</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Every single job post on jobupdate.site contains the direct source URL.
                                We do not host or modify official notification PDFs. We only provide pointers
                                to help applicants reach the official apply portals safely.
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-200">
                        <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400 mb-8 flex items-center gap-2">
                            <Globe size={14} /> Pillars of Content Verification
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {OFFICIAL_SOURCES.map(source => (
                                <a key={source.name} href={source.url} target="_blank" className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:border-primary-500 hover:shadow-md transition-all group bg-slate-50/50">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{source.name}</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{source.description}</span>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-300 group-hover:text-primary-500 transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-center">
                        <p className="text-sm font-semibold text-amber-800 flex items-center justify-center gap-2">
                            <CheckCircle size={16} />
                            If you find any link not pointing to an official domain, please report it to support@jobupdate.site immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
