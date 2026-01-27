import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ArrowRight, MapPin, Briefcase, Zap, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Top Tech Companies Hiring | JOB UPDATES',
    description: 'Explore opportunities at the world\'s leading tech companies and Indian startups. From Google to Zomato, find your dream career.',
};

const companies = [
    { name: 'Google', jobCount: 45, logo: null, locations: ['Bangalore', 'Hyderabad'], color: 'from-blue-500 to-green-500' },
    { name: 'Microsoft', jobCount: 38, logo: null, locations: ['Bangalore', 'Hyderabad', 'Noida'], color: 'from-blue-600 to-cyan-400' },
    { name: 'Amazon', jobCount: 52, logo: null, locations: ['Bangalore', 'Chennai', 'Hyderabad'], color: 'from-orange-500 to-yellow-500' },
    { name: 'Meta', jobCount: 28, logo: null, locations: ['Bangalore'], color: 'from-blue-500 to-purple-500' },
    { name: 'Apple', jobCount: 22, logo: null, locations: ['Bangalore', 'Hyderabad'], color: 'from-gray-600 to-gray-400' },
    { name: 'Netflix', jobCount: 15, logo: null, locations: ['Bangalore'], color: 'from-red-600 to-red-400' },
    { name: 'Infosys', jobCount: 120, logo: null, locations: ['Bangalore', 'Pune', 'Chennai', 'Mysore'], color: 'from-blue-700 to-blue-500' },
    { name: 'TCS', jobCount: 95, logo: null, locations: ['Mumbai', 'Chennai', 'Bangalore', 'Pune'], color: 'from-purple-600 to-pink-500' },
    { name: 'Wipro', jobCount: 78, logo: null, locations: ['Bangalore', 'Hyderabad', 'Chennai'], color: 'from-teal-500 to-green-400' },
    { name: 'Accenture', jobCount: 85, logo: null, locations: ['Bangalore', 'Chennai', 'Mumbai', 'Pune'], color: 'from-purple-700 to-purple-500' },
    { name: 'Flipkart', jobCount: 32, logo: null, locations: ['Bangalore'], color: 'from-yellow-500 to-blue-500' },
    { name: 'Swiggy', jobCount: 18, logo: null, locations: ['Bangalore'], color: 'from-orange-600 to-orange-400' },
    { name: 'Zomato', jobCount: 16, logo: null, locations: ['Gurgaon'], color: 'from-red-500 to-pink-500' },
    { name: 'PhonePe', jobCount: 24, logo: null, locations: ['Bangalore'], color: 'from-purple-600 to-indigo-500' },
    { name: 'Razorpay', jobCount: 19, logo: null, locations: ['Bangalore'], color: 'from-blue-600 to-blue-400' },
    { name: 'Meesho', jobCount: 14, logo: null, locations: ['Bangalore'], color: 'from-pink-500 to-pink-400' },
    { name: 'CRED', jobCount: 12, logo: null, locations: ['Bangalore'], color: 'from-gray-700 to-gray-500' },
    { name: 'Zerodha', jobCount: 8, logo: null, locations: ['Bangalore'], color: 'from-blue-600 to-purple-600' },
];

export default function CompaniesPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="relative py-20 overflow-hidden text-center">
                <div className="absolute inset-0 bg-mesh opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-6">
                        <Globe className="w-4 h-4" />
                        <span>Global Hiring Partners</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                        Top <span className="gradient-text italic">Innovators</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto">
                        Connect with industry leaders and high-growth startups currently expanding their tech teams in India.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Companies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {companies.map((company, i) => (
                        <Link
                            key={company.name}
                            href={`/jobs?company=${encodeURIComponent(company.name)}`}
                            className="group card-premium !p-8 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            {/* Logo Wrapper */}
                            <div className="relative mb-8">
                                <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${company.color} flex items-center justify-center shadow-xl group-hover:shadow-primary/20 transition-all`}>
                                    <span className="text-white font-black text-3xl italic">
                                        {company.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-primary fill-primary" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors">
                                {company.name}
                            </h2>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    <span>{company.jobCount} Positons</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="line-clamp-1">{company.locations.join(', ')}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 font-black text-sm text-primary group-hover:gap-4 transition-all uppercase tracking-tighter">
                                BROWSE JOBS
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile Show More */}
                <div className="mt-20 text-center">
                    <button className="btn-secondary !rounded-[2rem] !px-12 font-black italic">
                        REVEAL ALL PARTNERS
                    </button>
                </div>
            </div>
        </div>
    );
}
