import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import Link from 'next/link';
import {
    Building2, MapPin, GraduationCap, Calendar,
    CreditCard, ArrowLeft, ExternalLink, ShieldCheck,
    Download, FileText
} from 'lucide-react';

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
    await dbConnect();
    const job = await Job.findOne({ slug: params.slug }).lean();

    if (!job) return notFound();

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description || job.title,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.organization,
        },
        "datePosted": job.createdAt,
        "validThrough": job.expiresAt,
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
            }
        }
    };

    return (
        <div className="flex flex-col w-full pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HEADER */}
            <section className="bg-surface border-b border-border py-12">
                <div className="container">
                    <Link href="/latest-jobs" className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary mb-8">
                        <ArrowLeft size={16} /> Back to Updates
                    </Link>
                    <div className="flex flex-col gap-4">
                        <span className="p-badge p-badge-govt w-fit">{job.category} Official Pulse</span>
                        <h1 className="display-2 leading-tight">{job.title}</h1>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT AREA */}
            <section className="py-12">
                <div className="container grid md:grid-cols-3 gap-12">

                    {/* DETAILS COLUMN */}
                    <div className="md:col-span-2 space-y-12">

                        {/* 1. KEY INFO VISTA */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <DetailIconBox icon={<Building2 />} label="Organiser" value={job.organization} />
                            <DetailIconBox icon={<GraduationCap />} label="Qualification" value={job.qualification || 'Refer PDF'} />
                            <DetailIconBox icon={<MapPin />} label="Job Location" value={job.state || 'All India'} />
                        </div>

                        {/* 2. DESCRIPTION / OVERVIEW */}
                        <div className="card-stack space-y-8">
                            <div>
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <FileText className="text-primary" size={24} /> Recruitment Overview
                                </h3>
                                <p className="text-secondary leading-relaxed text-lg">
                                    {job.description || `The ${job.organization} has officially released the notification for the post of ${job.postName || job.title}. 
                                    Eligible candidates are invited to apply from official channels.`}
                                </p>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-border">
                                <h4 className="font-black uppercase tracking-widest text-xs text-secondary">Post Details & Compensation</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <DataRow label="Post Name" value={job.postName || 'Not Specific'} />
                                    <DataRow label="Total Vacancies" value={job.vacancies || 'Check PDF'} />
                                    <DataRow label="Salary Scale" value={job.salary || 'As per norms'} />
                                    <DataRow label="Age Bracket" value={job.ageLimit || '21 - 32 Years'} />
                                </div>
                            </div>
                        </div>

                        {/* 3. CTA BLOCK */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <a href={job.applyLink} target="_blank" className="btn-premium btn-primary flex-1 justify-center py-5 text-xl">
                                Official Apply Link <ExternalLink size={24} />
                            </a>
                            <a href={job.source} target="_blank" className="btn-premium btn-outline flex-1 justify-center py-5 text-xl">
                                Download Notification <Download size={24} />
                            </a>
                        </div>

                    </div>

                    {/* SIDEBAR */}
                    <aside className="space-y-8">
                        <div className="card-stack bg-primary text-white border-none shadow-glow">
                            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                <ShieldCheck size={24} /> Trust Verified
                            </h3>
                            <p className="text-white/80 text-sm leading-relaxed mb-6">
                                This content is fetched directly from government portals. We never modify dates or fee details.
                            </p>
                            <Link href="/sources" className="text-white font-bold text-xs uppercase tracking-widest hover:underline">
                                View Source Policy
                            </Link>
                        </div>

                        <div className="card-stack">
                            <h3 className="text-lg font-black mb-6">Trending Results</h3>
                            <ul className="space-y-4">
                                {['SSC CGL 2025 Tier 1', 'UPSC Mains Merit List', 'Bank PO Finale'].map((item) => (
                                    <li key={item} className="pb-4 border-b border-border last:border-0">
                                        <Link href="#" className="flex justify-between items-center group">
                                            <span className="text-sm font-bold group-hover:text-primary">{item}</span>
                                            <ArrowLeft size={14} className="rotate-180 opacity-40" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                </div>
            </section>
        </div>
    );
}

function DetailIconBox({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="card-stack p-6 flex flex-col gap-2 items-center text-center">
            <div className="text-primary mb-2 opacity-60">{icon}</div>
            <span className="text-[10px] uppercase font-black tracking-widest text-secondary">{label}</span>
            <span className="font-bold text-sm tracking-tight">{value}</span>
        </div>
    );
}

function DataRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase text-secondary tracking-wider">{label}</span>
            <span className="text-lg font-bold">{value}</span>
        </div>
    );
}
