import { notFound } from 'next/navigation';
import {
    Building2, MapPin, GraduationCap, Calendar,
    CreditCard, UserCheck, Briefcase, FileText,
    Download, ExternalLink, HelpCircle, ArrowLeft,
    AlertCircle, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Detailed Mock data for Job Detail Page
const MOCK_JOB_DETAIL = {
    id: '1',
    slug: 'upsc-civil-services-2026',
    title: 'UPSC Civil Services Examination 2026- Apply Online for 1056 Vacancies',
    organization: 'Union Public Service Commission (UPSC)',
    postName: 'Civil Services (IAS, IPS, IFS)',
    vacancies: '1056 Posts',
    qualification: 'Any Graduate Degree from a recognized University',
    ageLimit: '21 to 32 Years (Age relaxation as per rules)',
    salary: 'Level 10 (Rs. 56,100 - 1,77,500) as per 7th CPC',
    importantDates: [
        { label: 'Notification Released', value: 'January 25, 2026' },
        { label: 'Start Date to Apply', value: 'February 01, 2026' },
        { label: 'Last Date to Apply', value: 'February 21, 2026' },
        { label: 'Prelims Exam Date', value: 'May 25, 2026' },
    ],
    selectionProcess: 'The selection process consists of three stages: 1. Civil Services (Preliminary) Exam, 2. Civil Services (Main) Exam, 3. Interview / Personality Test.',
    applicationFee: 'General/OBC: Rs. 100/-; Female/SC/ST/PwBD: Nil',
    notificationLink: 'https://upsc.gov.in/notif.pdf',
    applyLink: 'https://upsconline.nic.in',
    category: 'Govt',
    faq: [
        { q: 'What is the last date to apply for UPSC CSE 2026?', a: 'The last date to apply is February 21, 2026.' },
        { q: 'Can final year students apply?', a: 'Yes, candidates who have appeared in the qualifying degree exam and awaiting result can apply.' },
    ],
    description: 'Union Public Service Commission (UPSC) has released the official notification for Civil Services Examination 2026. This is a prestigious opportunity for graduates looking to serve in administrative, police, and foreign services of India.',
};

export default function JobDetailPage({ params }: { params: { slug: string } }) {
    const job = MOCK_JOB_DETAIL; // In real app, fetch by slug

    if (!job) return notFound();

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.organization,
        },
        "datePosted": job.importantDates[0].value,
        "validThrough": job.importantDates[2].value,
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
            }
        }
    };

    return (
        <div className="bg-background pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header / Breadcrumb */}
            <div className="bg-card-bg border-b border-border py-6 mb-8">
                <div className="container">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-4">
                        <ArrowLeft size={16} /> Back to Updates
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                        {job.title}
                    </h1>
                </div>
            </div>

            <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-card-bg p-4 rounded-xl border border-border flex flex-col gap-1">
                            <span className="text-xs text-secondary flex items-center gap-1 uppercase font-bold tracking-wider">
                                <Building2 size={12} /> Organization
                            </span>
                            <span className="font-bold text-sm">{job.organization}</span>
                        </div>
                        <div className="bg-card-bg p-4 rounded-xl border border-border flex flex-col gap-1">
                            <span className="text-xs text-secondary flex items-center gap-1 uppercase font-bold tracking-wider">
                                <Briefcase size={12} /> Total Vacancies
                            </span>
                            <span className="font-bold text-sm">{job.vacancies}</span>
                        </div>
                        <div className="bg-card-bg p-4 rounded-xl border border-border flex flex-col gap-1">
                            <span className="text-xs text-secondary flex items-center gap-1 uppercase font-bold tracking-wider">
                                <MapPin size={12} /> Job Location
                            </span>
                            <span className="font-bold text-sm">All India</span>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl border border-border space-y-8">
                        {/* Introduction */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FileText className="text-primary" size={20} /> Recruitment Overview
                            </h2>
                            <p className="text-secondary leading-relaxed">{job.description}</p>
                        </section>

                        {/* Details Table-like sections */}
                        <div className="space-y-6">
                            <DetailSection icon={<GraduationCap size={18} />} title="Qualification" content={job.qualification} />
                            <DetailSection icon={<UserCheck size={18} />} title="Age Limit" content={job.ageLimit} />
                            <DetailSection icon={<CreditCard size={18} />} title="Salary Details" content={job.salary} />
                            <DetailSection icon={<CreditCard size={18} />} title="Application Fee" content={job.applicationFee} />
                            <DetailSection icon={<FileText size={18} />} title="Selection Process" content={job.selectionProcess} />
                        </div>

                        {/* Important Dates */}
                        <section className="bg-background/50 p-6 rounded-xl border border-border">
                            <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-xs text-secondary">
                                <Calendar size={14} /> Important Dates
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.importantDates.map((date, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm font-medium">{date.label}</span>
                                        <span className="text-sm font-bold text-primary">{date.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 justify-center py-4">
                                Apply Online (Official Site) <ExternalLink size={18} />
                            </a>
                            <a href={job.notificationLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex-1 justify-center py-4">
                                Download PDF Notification <Download size={18} />
                            </a>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <section className="bg-card-bg p-8 rounded-2xl border border-border">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <HelpCircle className="text-accent" size={20} /> FAQ Section
                        </h2>
                        <div className="space-y-6">
                            {job.faq.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h4 className="font-bold text-foreground">Q: {item.q}</h4>
                                    <p className="text-sm text-secondary">A: {item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                        <h3 className="font-bold text-accent mb-2 flex items-center gap-2">
                            <AlertCircle size={20} /> Important Note
                        </h3>
                        <p className="text-sm text-secondary leading-relaxed">
                            Candidates are advised to read the full official notification before applying. Use only official government websites to submit applications.
                        </p>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-border">
                        <h3 className="font-bold mb-4">Latest Admit Cards</h3>
                        <ul className="space-y-4">
                            {['SSC CHSL Admit Card', 'IBPS PO Main Call Letter', 'UPSC Prelims Admit Card'].map((item) => (
                                <li key={item} className="text-sm border-b border-border pb-3">
                                    <Link href="#" className="hover:text-primary transition-colors flex justify-between items-center group">
                                        {item} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailSection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-sm text-secondary leading-relaxed">{content}</p>
            </div>
        </div>
    );
}
