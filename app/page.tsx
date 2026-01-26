import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Zap, ShieldCheck, Clock, TrendingUp, Briefcase, Award, Building2, Train, Landmark, Shield } from 'lucide-react';

// Revalidate page every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  let featuredJobs: any[] = [];
  let todayJobs: any[] = [];
  let latestJobs: any[] = [];
  let govtJobs: any[] = [];
  let privateJobs: any[] = [];
  let results: any[] = [];
  let admitCards: any[] = [];
  let urgentJobs: any[] = [];

  try {
    await dbConnect();

    featuredJobs = await Job.find({ status: 'PUBLISHED', isFeatured: true })
      .sort({ priority: -1, createdAt: -1 }).limit(3).lean();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    todayJobs = await Job.find({
      status: 'PUBLISHED',
      createdAt: { $gte: todayStart }
    }).sort({ createdAt: -1 }).limit(6).lean();

    latestJobs = await Job.find({ status: 'PUBLISHED' })
      .sort({ createdAt: -1 }).limit(6).lean();

    govtJobs = await Job.find({ status: 'PUBLISHED', category: 'Govt' })
      .sort({ createdAt: -1 }).limit(4).lean();

    privateJobs = await Job.find({ status: 'PUBLISHED', category: 'Private' })
      .sort({ createdAt: -1 }).limit(4).lean();

    results = await Job.find({ status: 'PUBLISHED', category: 'Result' })
      .sort({ createdAt: -1 }).limit(4).lean();

    admitCards = await Job.find({ status: 'PUBLISHED', category: 'Admit Card' })
      .sort({ createdAt: -1 }).limit(4).lean();

  } catch (error) {
    console.error('Home page DB error:', error);
  }

  const categories = [
    { name: 'Govt Jobs', icon: Landmark, href: '/govt-jobs', bg: 'bg-blue-50', text: 'text-blue-600' },
    { name: 'Banking', icon: Building2, href: '/category/banking', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { name: 'Railway', icon: Train, href: '/category/railway', bg: 'bg-orange-50', text: 'text-orange-600' },
    { name: 'Defence', icon: Shield, href: '/category/defence', bg: 'bg-red-50', text: 'text-red-600' },
    { name: 'Teaching', icon: Award, href: '/category/teaching', bg: 'bg-purple-50', text: 'text-purple-600' },
    { name: 'Private', icon: Briefcase, href: '/private-jobs', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="w-full flex flex-col gap-20 pb-20">

      {/* HERO SECTION */}
      <section className="relative pt-10 overflow-hidden">
        <div className="container-premium relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Zap size={14} className="text-blue-600 fill-blue-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-700">Official 2026 Updates</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Find Your <span className="text-primary-600 italic">Dream Career</span> <br />
            in the Official Portals.
          </h1>

          <p className="max-w-2xl text-lg text-slate-500 mb-10 font-medium leading-relaxed font-sans">
            Verified sarkari results, private openings, and admit cards fetched 24/7
            directly from 500+ government sources. No fake ads, only official links.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/latest-jobs" className="btn-action btn-primary px-10 h-16 text-lg">
              Explore All Jobs <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link href="/results" className="btn-action btn-outline px-10 h-16 text-lg">
              Check Results
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK GRID */}
      <section>
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="job-card flex flex-col items-center gap-4 py-8 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.text} group-hover:scale-110 transition-transform`}>
                  <cat.icon size={26} />
                </div>
                <span className="font-black text-sm text-slate-800">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY JOBS */}
      {todayJobs.length > 0 && (
        <section>
          <div className="container-premium">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <Zap className="text-amber-500 fill-amber-500" size={28} /> Fresh Today
              </h2>
              <Link href="/latest-jobs" className="nav-link font-black text-primary-600">View All</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayJobs.map(job => <JobCard key={job._id} job={{ ...job, id: job._id.toString() }} />)}
            </div>
          </div>
        </section>
      )}

      {/* LATEST UPDATES */}
      <section>
        <div className="container-premium">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={28} /> Latest Live Updates
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.length > 0 ? (
              latestJobs.map(job => <JobCard key={job._id} job={{ ...job, id: job._id.toString() }} />)
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold mb-4 italic">Waiting for official signals...</p>
                <Link href="/api/cron/fetch" className="btn-action btn-outline py-2.5 px-6 text-sm">Refresh Data</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RESULTS GRID */}
      <section className="bg-slate-900 py-24 -mx-10 px-10 text-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Results */}
            <div>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-emerald-400">
                <TrendingUp size={24} /> Official Results
              </h3>
              <div className="grid gap-4">
                {results.map(job => (
                  <Link key={job._id} href={`/jobs/${job.slug}`} className="group flex items-center p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-all">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{job.title}</h4>
                      <p className="text-xs font-black uppercase text-slate-500 mt-1">{job.organization}</p>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" size={20} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Admit Cards */}
            <div>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-primary-400">
                <Award size={24} /> Exam Hall Tickets
              </h3>
              <div className="grid gap-4">
                {admitCards.map(job => (
                  <Link key={job._id} href={`/jobs/${job.slug}`} className="group flex items-center p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-primary-500/50 transition-all">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{job.title}</h4>
                      <p className="text-xs font-black uppercase text-slate-500 mt-1">{job.organization}</p>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-premium">
        <div className="relative bg-primary-600 rounded-[40px] p-12 md:p-20 overflow-hidden text-center text-white shadow-2xl shadow-primary-900/40">
          <h2 className="relative z-10 text-4xl md:text-5xl font-black mb-6">Never Miss an Official Update.</h2>
          <p className="relative z-10 text-lg text-primary-100 max-w-xl mx-auto mb-10 font-bold opacity-80"> Join 500,000+ job seekers receiving real-time alerts. Guaranteed no spam. </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/latest-jobs" className="btn-action bg-white text-primary-700 h-16 px-10 text-lg hover:bg-slate-50 ring-4 ring-white/10">Browse Jobs</Link>
            <a href="https://t.me/jobupdatesite" target="_blank" className="btn-action bg-primary-900 text-white h-16 px-10 text-lg hover:bg-slate-950 ring-4 ring-black/10">📢 Join Telegram</a>
          </div>
        </div>
      </section>

    </div>
  );
}
