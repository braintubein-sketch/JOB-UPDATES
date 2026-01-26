import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="container-premium py-12 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Have questions about a job listing or need technical support?
                    Get in touch with the Job Updates team.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Details */}
                <div className="space-y-8">
                    <div className="card-premium">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                <p className="text-slate-600 mb-2">For general inquiries and support:</p>
                                <a href="mailto:support@jobupdate.site" className="text-primary-600 font-bold hover:underline">
                                    support@jobupdate.site
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <Send size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Join Community</h3>
                                <p className="text-slate-600 mb-2">Get instant alerts on Telegram:</p>
                                <a href="https://t.me/jobupdatesite" target="_blank" className="text-green-600 font-bold hover:underline">
                                    @jobupdatesite
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Our Location</h3>
                                <p className="text-slate-600">
                                    Hyderabad, Telangana<br />
                                    India - 500033
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple Form Placeholder */}
                <div className="card-premium p-8">
                    <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="How can we help?"></textarea>
                        </div>
                        <button type="button" className="btn-premium btn-primary w-full py-4 text-lg">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
