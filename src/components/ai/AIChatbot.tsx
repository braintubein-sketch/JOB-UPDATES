'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2, Trash2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi! I\'m **JobBot** 🤖, your AI career assistant. I can help you with:\n\n• **Job search tips**\n• **Career advice**\n• **Interview preparation**\n• **Salary guidance**\n\nHow can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content, mode: 'chat' }),
            });

            const data = await res.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.success
                    ? data.response
                    : 'Sorry, I\'m having trouble right now. Please try again in a moment.',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Unable to connect to AI service. Please check your internet connection.',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: 'Chat cleared! How can I help you?',
                timestamp: new Date(),
            },
        ]);
    };

    const formatContent = (content: string) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-xs">$1</code>')
            .replace(/^• /gm, '• ')
            .replace(/\n/g, '<br />');
    };

    const quickQuestions = [
        'Best skills to learn in 2026?',
        'How to prepare for interviews?',
        'Average salary for freshers?',
        'Remote job tips',
    ];

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 md:bottom-8 right-6 z-50 w-16 h-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <Bot className="w-7 h-7" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-50 w-[calc(100%-2rem)] md:w-[420px] h-[500px] md:h-[560px] bg-background border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm">JobBot AI</h3>
                                    <p className="text-xs text-muted-foreground">Career Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearChat}
                                    className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    title="Clear chat"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-secondary border border-border rounded-bl-md'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                                    />
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions (show only at start) */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {quickQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => {
                                            setInput(q);
                                            setTimeout(() => {
                                                const form = document.getElementById('ai-chat-form');
                                                form?.dispatchEvent(new Event('submit', { bubbles: true }));
                                            }, 100);
                                        }}
                                        className="text-xs font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form
                            id="ai-chat-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex items-center gap-2 px-4 py-3 border-t border-border bg-secondary/20"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything about careers..."
                                className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
