'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FileText, Sparkles, Send, Loader2, Copy, Check, ArrowLeft,
    Brain, PenTool, Target, RotateCcw
} from 'lucide-react';

type Tool = 'resume' | 'cover-letter' | 'recommend';

export default function AIToolsClient() {
    const [activeTool, setActiveTool] = useState<Tool>('resume');
    const [input, setInput] = useState('');
    const [context, setContext] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const tools = [
        {
            id: 'resume' as Tool,
            icon: FileText,
            title: 'Resume Analyzer',
            description: 'Get AI-powered feedback on your resume',
            placeholder: 'Paste your resume text here...\n\nExample:\nJohn Doe\nSoftware Engineer\n\nSkills: React, Node.js, Python, SQL\n\nExperience:\n- Built a full-stack task management app\n- Contributed to open-source projects\n\nEducation:\nB.Tech in Computer Science, VTU (2024)\nCGPA: 8.5',
            buttonText: 'Analyze Resume',
        },
        {
            id: 'cover-letter' as Tool,
            icon: PenTool,
            title: 'Cover Letter Writer',
            description: 'Generate a tailored cover letter',
            placeholder: 'Enter the job details:\n\nJob Title: Software Engineer\nCompany: Google\nLocation: Bangalore\n\nKey Requirements:\n- React.js, Node.js\n- 2+ years experience\n- System Design knowledge',
            buttonText: 'Generate Cover Letter',
            hasContext: true,
            contextPlaceholder: 'Your skills & experience (brief summary):\n\nE.g., 2 years experience in React, Node.js. Built 3 production apps. B.Tech CSE from VTU.',
        },
        {
            id: 'recommend' as Tool,
            icon: Target,
            title: 'Job Recommendations',
            description: 'Get personalized job suggestions',
            placeholder: 'Tell me about yourself:\n\nSkills: React, Node.js, Python, AWS\nExperience: 1 year as Full-Stack Developer\nLocation Preference: Bangalore / Remote\nExpected Salary: 10-15 LPA\nPreferred Role: Frontend or Full-Stack',
            buttonText: 'Get Recommendations',
        },
    ];

    const currentTool = tools.find((t) => t.id === activeTool)!;

    const handleSubmit = async () => {
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult('');

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    mode: activeTool,
                    context: context,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setResult(data.response);
            } else {
                setResult(`❌ Error: ${data.error}`);
            }
        } catch {
            setResult('❌ Unable to connect to AI service. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyResult = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatResult = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-6 mb-2 gradient-text">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 gradient-text">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-black mt-6 mb-3 gradient-text">$1</h1>')
            .replace(/^- (.*$)/gm, '<li class="ml-4 text-muted-foreground">• $1</li>')
            .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 text-muted-foreground">$&</li>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="py-16 md:py-24 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-8 border border-primary/20">
                        <Sparkles className="w-4 h-4 fill-primary" />
                        <span>Powered by AI</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                        AI Career <br />
                        <span className="gradient-text italic">Tools</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                        Free AI-powered tools to supercharge your job search. Analyze resumes, generate cover letters, and get personalized job recommendations.
                    </p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Tool Selector */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => {
                                setActiveTool(tool.id);
                                setResult('');
                                setInput('');
                                setContext('');
                            }}
                            className={`flex-1 flex items-center gap-3 p-5 rounded-2xl border-2 font-bold text-left transition-all ${
                                activeTool === tool.id
                                    ? 'border-primary bg-primary/5 text-foreground'
                                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/30'
                            }`}
                        >
                            <tool.icon className={`w-6 h-6 ${activeTool === tool.id ? 'text-primary' : ''}`} />
                            <div>
                                <div className="font-black text-sm">{tool.title}</div>
                                <div className="text-xs font-medium opacity-70">{tool.description}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <motion.div
                    key={activeTool}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="glass rounded-3xl p-6 md:p-8 border-primary/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-5 h-5 text-primary" />
                            <h2 className="font-black text-lg">{currentTool.title}</h2>
                        </div>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={currentTool.placeholder}
                            className="w-full h-48 bg-secondary border border-border rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors resize-none"
                        />

                        {currentTool.hasContext && (
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder={currentTool.contextPlaceholder}
                                className="w-full h-28 mt-4 bg-secondary border border-border rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            />
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-muted-foreground">
                                {input.length}/5000 characters
                            </span>
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || loading}
                                className="btn-primary flex items-center gap-2 px-8 disabled:opacity-40"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        {currentTool.buttonText}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Result */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-3xl p-6 md:p-8 border-primary/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <h3 className="font-black text-lg">AI Response</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyResult}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-xl text-xs font-bold hover:border-primary/30 transition-colors"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setResult('');
                                            setInput('');
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-xl text-xs font-bold hover:border-primary/30 transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div
                                className="prose prose-invert max-w-none text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                            />

                            <div className="mt-8 pt-6 border-t border-border text-center">
                                <p className="text-sm text-muted-foreground mb-4">Ready to apply with your improved profile?</p>
                                <Link href="/jobs" className="btn-primary inline-flex items-center gap-2 px-6 text-sm">
                                    Browse Jobs <Send className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
