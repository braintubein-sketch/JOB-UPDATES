'use client';

import { useState } from 'react';
import { FileText, CheckCircle, ClipboardList, Calendar, Info } from 'lucide-react';

interface JobTabsProps {
    job: {
        category: string;
        description?: string;
        eligibility?: string;
        selectionProcess?: string;
        howToApply?: string;
        organization: string;
        title: string;
        postName?: string;
        notificationPdf?: string;
        importantDates?: Array<{ label: string; date: string; isUrgent?: boolean }>;
    };
}

export default function JobTabs({ job }: JobTabsProps) {
    const [activeTab, setActiveTab] = useState('description');

    const isResult = job.category === 'Result';
    const isAdmitCard = job.category === 'Admit Card';

    const tabs = [
        { id: 'description', label: isResult ? 'Result Info' : isAdmitCard ? 'Card Details' : 'Job Summary', icon: FileText },
        ...(!isResult && !isAdmitCard ? [{ id: 'eligibility', label: 'Eligibility', icon: CheckCircle }] : []),
        { id: 'selection', label: isResult ? 'How to Check' : isAdmitCard ? 'How to Download' : 'Selection Process', icon: ClipboardList },
        { id: 'dates', label: isResult ? 'Announcements' : 'Schedule', icon: Calendar },
        { id: 'official', label: isResult ? 'Result Link' : isAdmitCard ? 'Portal Link' : 'Official Notice', icon: Info },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'description':
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {isResult ? 'Result Declaration Info' : isAdmitCard ? 'Admit Card Status' : 'Job Summary'}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                            {job.description || (
                                isResult
                                    ? `The ${job.organization} has officially declared the results for ${job.postName || job.title}. Candidates who appeared for the exam can now check their scores and merit list status using the direct links provided.`
                                    : isAdmitCard
                                        ? `The Admit Cards for ${job.organization} ${job.postName || job.title} are now available for download. Candidates are advised to download and print their hall tickets early to avoid last-minute rush.`
                                        : `The ${job.organization} has officially released the notification for ${job.postName || job.title}. Eligible candidates are invited to apply through official channels before the last date.`
                            )}
                        </p>
                        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Key Highlights:</h3>
                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                                <li>Organization: {job.organization}</li>
                                <li>Type: {job.category}</li>
                                {isResult && <li>Status: Declared / Released</li>}
                                {isAdmitCard && <li>Status: Available for Download</li>}
                                {!isResult && !isAdmitCard && <li>Post: {job.postName || 'Relevant Post'}</li>}
                            </ul>
                        </div>
                    </div>
                );
            case 'official':
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Official Notification Details</h2>
                        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                            <Info className="mx-auto text-blue-600 mb-4" size={40} />
                            <h3 className="font-bold text-lg mb-2">View Official Document</h3>
                            <p className="text-slate-500 text-sm mb-6">Click below to view the official recruitment notification from {job.organization}.</p>
                            <a
                                href={job.notificationPdf}
                                target="_blank"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <FileText size={18} />
                                Open Official Link
                            </a>
                        </div>
                    </div>
                );
            case 'eligibility':
                // ... (rest of the cases remain the same but I'll paste the full switches to be safe)
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Eligibility Criteria</h2>
                        {job.eligibility ? (
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                {job.eligibility}
                            </p>
                        ) : (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex gap-3 text-blue-700 dark:text-blue-400">
                                <Info size={20} className="shrink-0" />
                                <p className="text-sm font-medium">Please refer to the official notification for detailed eligibility criteria.</p>
                            </div>
                        )}
                    </div>
                );
            case 'selection':
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {isResult ? 'Steps to Check Result' : isAdmitCard ? 'Steps to Download Admit Card' : 'Selection Process'}
                        </h2>
                        <div className="space-y-4">
                            {job.selectionProcess || (
                                isResult
                                    ? "1. Click on the Official Result Link.\n2. Enter your Registration Number and DOB.\n3. View your result/scorecard.\n4. Take a printout if required."
                                    : isAdmitCard
                                        ? "1. Visit the official portal provided below.\n2. Login with your credentials.\n3. Find the 'Download Admit Card' tab.\n4. Download and print your hall ticket."
                                        : "Selection involves Written Exam, Interview, and Document Verification. Refer to the official notice for the exact sequence."
                            ).split('\n').map((step, i) => (
                                <div key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                                    <CheckCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-sm">{step.replace(/^\d+\.\s*/, '')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'dates':
                return (
                    <div className="animate-fade-in-up px-0">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Schedule</h2>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {job.importantDates?.map((item, idx) => (
                                <div key={idx} className={`flex justify-between py-4 ${item.isUrgent ? 'bg-red-50 dark:bg-red-900/10 -mx-4 px-4 rounded-lg' : ''}`}>
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
                                    <span className={`font-bold ${item.isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                        {item.date}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card border-0 shadow-none md:border md:shadow-sm md:p-0 overflow-hidden">
            {/* Tab Header */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 md:bg-transparent">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === tab.id
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-8">
                {renderContent()}
            </div>
        </div>
    );
}
