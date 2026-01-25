'use client';

import { notFound } from 'next/navigation';
import { Building2, GraduationCap, Calendar, CreditCard, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const MOCK_JOB_DETAIL = {
    title: 'UPSC Civil Services Examination 2026',
    organization: 'Union Public Service Commission',
    postName: 'Civil Services (IAS, IPS, IFS)',
    vacancies: '1056 Posts',
    qualification: 'Any Graduate Degree',
    ageLimit: '21 to 32 Years',
    salary: 'Level 10 (Rs. 56,100 - 1,77,500)',
    applicationFee: 'General: Rs. 100/-; SC/ST: Nil',
    notificationLink: '#',
    applyLink: '#',
    category: 'Govt',
    description: 'The Civil Services Examination is a nationwide competitive examination in India conducted by the Union Public Service Commission for recruitment to various Civil Services of the Government of India.',
};

export default function JobDetailPage({ params }: { params: { slug: string } }) {
    const job = MOCK_JOB_DETAIL; // Mocked for design demo

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <Link href="/latest-jobs" className="btn-link text-sm flex items-center gap-1 mb-24">
                    <ArrowLeft size={14} /> Back to Recruitments
                </Link>

                <div className="badge">{job.category}</div>
                <h1 className="hero-title" style={{ textAlign: 'left', fontSize: '48px', marginBottom: '16px' }}>{job.title}</h1>
                <p className="hero-subtitle" style={{ textAlign: 'left', fontSize: '18px', marginBottom: '48px' }}>{job.organization}</p>

                <div className="card mb-48">
                    <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
                        <InfoItem icon={<Building2 size={18} />} label="Organization" value={job.organization} />
                        <InfoItem icon={<GraduationCap size={18} />} label="Qualification" value={job.qualification} />
                        <InfoItem icon={<Calendar size={18} />} label="Vacancies" value={job.vacancies} />
                        <InfoItem icon={<CreditCard size={18} />} label="Salary" value={job.salary} />
                    </div>
                </div>

                <div className="prose" style={{ marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Requirement Overview</h2>
                    <p className="text-secondary">{job.description}</p>
                </div>

                <div className="flex gap-4">
                    <a href={job.applyLink} className="btn btn-primary">Apply on Official Portal</a>
                    <a href={job.notificationLink} className="btn btn-link flex items-center gap-1">
                        Download PDF <ExternalLink size={14} />
                    </a>
                </div>
            </div>
            <style jsx>{`
                .mb-24 { margin-bottom: 24px; }
                .mb-48 { margin-bottom: 48px; }
                .gap-1 { gap: 4px; }
                .gap-4 { gap: 16px; }
            `}</style>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="text-secondary text-xs flex items-center gap-2">{icon} {label}</div>
            <div className="font-semibold text-sm">{value}</div>
            <style jsx>{`
                .gap-1 { gap: 4px; }
                .gap-2 { gap: 8px; }
            `}</style>
        </div>
    );
}
