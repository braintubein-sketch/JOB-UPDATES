import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with JOB UPDATES team for any queries or suggestions.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-muted-foreground text-lg">
                        Have questions or feedback? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    className="input-premium"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Subject</label>
                                <select className="input-premium">
                                    <option>General Inquiry</option>
                                    <option>Report an Issue</option>
                                    <option>Job Listing Request</option>
                                    <option>Partnership</option>
                                    <option>Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    className="input-premium min-h-[150px] resize-none"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-3">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h2 className="text-xl font-semibold mb-4">Quick Contact</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <a href="mailto:contact@braintube.in" className="text-primary hover:underline">
                                        contact@braintube.in
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Telegram</p>
                                    <a href="https://t.me/jobupdatesite" className="text-primary hover:underline">
                                        @jobupdatesite
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Response Time</p>
                                    <p>Usually within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-primary/20 rounded-2xl p-8">
                            <h2 className="text-xl font-semibold mb-4">Join Our Community</h2>
                            <p className="text-muted-foreground mb-4">
                                Get instant IT job alerts on Telegram. Join 50K+ professionals.
                            </p>
                            <Link href="/telegram" className="btn-primary inline-block">
                                Join Telegram Channel
                            </Link>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h2 className="text-xl font-semibold mb-4">FAQs</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium">How do I apply for a job?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Click on any job listing and then click &quot;Apply Now&quot; to be redirected to the official application page.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Are these jobs verified?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Yes, we source jobs from official company career pages and trusted job portals.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Is JOB UPDATES free to use?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Yes, completely free for job seekers!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

