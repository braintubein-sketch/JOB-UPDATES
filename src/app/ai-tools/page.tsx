import { Metadata } from 'next';
import AIToolsClient from './AIToolsClient';

export const metadata: Metadata = {
    title: 'AI Career Tools | Resume Analyzer, Cover Letter Generator & Job Recommendations',
    description: 'Free AI-powered career tools for IT professionals. Analyze your resume, generate tailored cover letters, and get personalized job recommendations.',
};

export default function AIToolsPage() {
    return <AIToolsClient />;
}
