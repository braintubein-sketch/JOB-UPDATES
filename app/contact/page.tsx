import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="container py-20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h1 className="text-4xl font-extrabold mb-6">Get in Touch</h1>
                    <p className="text-secondary text-lg mb-10 leading-relaxed">
                        Have questions about a job notification? Or want to report an error? We're here to help you.
                    </p>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">Email Us</h4>
                                <p className="text-secondary">support@jobupdates.india</p>
                                <p className="text-xs text-secondary mt-1">Response time: within 24 hours</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">WhatsApp Channel</h4>
                                <p className="text-secondary">Join for instant alerts</p>
                                <button className="text-xs font-bold text-accent mt-1 hover:underline">Join Now →</button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">Registered Office</h4>
                                <p className="text-secondary">New Delhi, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-2xl border border-border shadow-2xl">
                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-secondary">First Name</label>
                                <input type="text" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Last Name</label>
                                <input type="text" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Email Address</label>
                            <input type="email" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Subject</label>
                            <select className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary">
                                <option>Job Update Query</option>
                                <option>Error Report</option>
                                <option>AdSense/Advertising</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Message</label>
                            <textarea rows={4} className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary"></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary w-full justify-center py-4 text-lg">
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
