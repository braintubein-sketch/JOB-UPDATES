import Link from 'next/link';
import { Search, TrendingUp, Calendar, ArrowRight, ChevronRight, GraduationCap, Building2, MapPin, Clock } from 'lucide-react';
import JobCard from '@/components/JobCard';

// Mock data for initial UI
const MOCK_JOBS = [
  {
    id: '1',
    slug: 'upsc-civil-services-2026',
    title: 'UPSC Civil Services Examination 2026 Notification',
    organization: 'Union Public Service Commission',
    qualification: 'Graduate',
    category: 'Govt',
    state: 'All India',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'ssc-cgl-tier-1-results',
    title: 'SSC CGL Tier 1 Examination Results Declared',
    organization: 'Staff Selection Commission',
    qualification: 'N/A',
    category: 'Result',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'sbi-clerk-admit-card-2026',
    title: 'SBI Clerk Prelims Admit Card Out - Download Now',
    organization: 'State Bank of India',
    qualification: 'Graduate',
    category: 'Admit Card',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'tcs-off-campus-hiring-2026',
    title: 'TCS Off Campus Hiring for Freshers - Batch 2025/26',
    organization: 'TATA Consultancy Services',
    qualification: 'B.E/B.Tech/MCA',
    category: 'Private',
    createdAt: new Date().toISOString(),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundImage: 'linear-gradient(to bottom, var(--primary) 0%, transparent 10%)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Official Indian <span className="text-primary">Job Updates</span>
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Fast, Accurate & Official. Get the latest government and private sector job notifications, results, and admit cards first.
          </p>

          <div className="max-w-3xl mx-auto glass p-2 rounded-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-3 bg-card-bg rounded-xl border border-border">
              <Search className="text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search by post, org, or qualification..."
                className="w-full py-4 bg-transparent outline-none text-foreground"
              />
            </div>
            <button className="btn btn-primary px-8 py-4 rounded-xl text-lg">
              Find Jobs
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium text-secondary">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> 450+ New Updates Today</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Official Sources Only</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-accent rounded-full"></span> Verfied Information</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column: Latest Updates */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-8">
            <h2 className="section-title">Latest Job Updates</h2>
            <Link href="/latest-jobs" className="text-primary font-semibold flex items-center gap-1 mb-8 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-10">
          {/* Last Date Today */}
          <div className="glass p-6 rounded-2xl border border-border">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-accent" size={20} />
              Last Date Today
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Link key={i} href="#" className="flex gap-4 group p-2 rounded-lg hover:bg-border/50 transition-colors">
                  <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center text-accent font-bold">
                    {25 + i}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold group-hover:text-primary leading-tight">RBI Grade B Officer Application {i}</h4>
                    <p className="text-xs text-secondary mt-1">Reserve Bank of India</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="#" className="block text-center mt-6 text-sm font-bold text-primary">View All Deadlines</Link>
          </div>

          {/* Important Notifications */}
          <div className="bg-primary p-6 rounded-2xl text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Trending Now
            </h3>
            <ul className="space-y-4 text-sm opacity-90">
              <li className="flex gap-2"><ArrowRight size={14} className="mt-1" /> RRB NTPC Exam City Link Active</li>
              <li className="flex gap-2"><ArrowRight size={14} className="mt-1" /> CISF Head Constable Exam Postponed</li>
              <li className="flex gap-2"><ArrowRight size={14} className="mt-1" /> Navy SSR/MR 01/2026 Notification Out</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Results', 'Admit Cards', 'Answer Key', 'Syllabus', 'Admission', 'State Jobs'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase().replace(' ', '-')}`} className="btn btn-outline text-xs justify-between">
                  {link} <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
