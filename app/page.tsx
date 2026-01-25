import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Zap, ShieldCheck, Clock, TrendingUp, Briefcase, Award, Building2, Train, Landmark, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

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

    // Featured Jobs
    featuredJobs = await Job.find({ status: 'PUBLISHED', isFeatured: true })
      .sort({ priority: -1, createdAt: -1 })
      .limit(3)
      .lean();

    // Today's Jobs (posted today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    todayJobs = await Job.find({
      status: 'PUBLISHED',
      createdAt: { $gte: todayStart }
    }).sort({ createdAt: -1 }).limit(6).lean();

    // Urgent Jobs (last date within 3 days)
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    urgentJobs = await Job.find({
      status: 'PUBLISHED',
      lastDate: { $gte: new Date(), $lte: threeDaysFromNow }
    }).sort({ lastDate: 1 }).limit(4).lean();

    // Latest Jobs
    latestJobs = await Job.find({ status: 'PUBLISHED' })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Government Jobs
    govtJobs = await Job.find({ status: 'PUBLISHED', category: 'Govt' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    // Private Jobs
    privateJobs = await Job.find({ status: 'PUBLISHED', category: 'Private' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    // Results
    results = await Job.find({ status: 'PUBLISHED', category: 'Result' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    // Admit Cards
    admitCards = await Job.find({ status: 'PUBLISHED', category: 'Admit Card' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

  } catch (error) {
    console.error('Home page DB error:', error);
  }

  const categories = [
    { name: 'Central Govt', icon: Landmark, href: '/govt-jobs', color: 'text-blue-600 bg-blue-50' },
    { name: 'Banking', icon: Building2, href: '/category/banking', color: 'text-green-600 bg-green-50' },
    { name: 'Railway', icon: Train, href: '/category/railway', color: 'text-orange-600 bg-orange-50' },
    { name: 'Defence', icon: Shield, href: '/category/defence', color: 'text-red-600 bg-red-50' },
    { name: 'Teaching', icon: Award, href: '/category/teaching', color: 'text-purple-600 bg-purple-50' },
    { name: 'Private', icon: Briefcase, href: '/private-jobs', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="flex flex-col w-full">

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container-premium relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
              <Zap size={14} className="text-primary-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700">
                Official 2026 Updates
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-slide-up">
              Your Trusted Path to{' '}
              <span className="text-gradient">Official Indian Jobs</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              We monitor 500+ official government portals 24/7. Verified recruitments,
              exams, and results delivered directly from the source. No spam, only official links.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/latest-jobs" className="btn-premium btn-primary px-8 py-4 text-base">
                Browse All Jobs <ArrowRight size={18} />
              </Link>
              <Link href="/results" className="btn-premium btn-outline px-8 py-4 text-base">
                Check Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <section className="py-12 border-b border-slate-100 bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href} className="card-premium flex flex-col items-center gap-3 p-5 text-center hover:border-primary-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color}`}>
                  <cat.icon size={24} />
                </div>
                <span className="font-bold text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* URGENT - LAST DATE SOON */}
      {urgentJobs.length > 0 && (
        <section className="section-premium bg-gradient-to-r from-red-50 to-amber-50">
          <div className="container-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <Clock size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">⏰ Apply Now - Last Date Soon!</h2>
                <p className="text-sm text-slate-600">These jobs are closing within 3 days. Don't miss out!</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {urgentJobs.map((job: any) => (
                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} showCountdown={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TODAY'S JOBS */}
      {todayJobs.length > 0 && (
        <section className="section-premium bg-white">
          <div className="container-premium">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-display font-bold">🆕 Today's Fresh Updates</h2>
              </div>
              <Link href="/latest-jobs" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayJobs.map((job: any) => (
                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED JOBS */}
      {featuredJobs.length > 0 && (
        <section className="section-premium bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="container-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Award size={20} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-display font-bold">⭐ Featured Opportunities</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredJobs.map((job: any) => (
                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST JOBS */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold">
              Latest <span className="text-primary-600">Live</span> Updates
            </h2>
            <Link href="/latest-jobs" className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.length > 0 ? latestJobs.map((job: any) => (
              <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
            )) : (
              <div className="col-span-3 card-premium text-center py-16 border-dashed border-2">
                <p className="text-slate-500 mb-4">Connecting to official database...</p>
                <Link href="/api/cron/fetch" className="btn-premium btn-secondary">
                  Refresh Data
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GOVERNMENT JOBS */}
      {govtJobs.length > 0 && (
        <section className="section-premium bg-slate-50">
          <div className="container-premium">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-display font-bold">🏛️ Government Jobs</h2>
              </div>
              <Link href="/govt-jobs" className="text-sm font-semibold text-primary-600 flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {govtJobs.map((job: any) => (
                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRIVATE JOBS */}
      {privateJobs.length > 0 && (
        <section className="section-premium bg-white">
          <div className="container-premium">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Briefcase size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-display font-bold">💼 Private Sector</h2>
              </div>
              <Link href="/private-jobs" className="text-sm font-semibold text-primary-600 flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {privateJobs.map((job: any) => (
                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULTS & ADMIT CARDS GRID */}
      <section className="section-premium bg-slate-50">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  📊 Latest Results
                </h2>
                <Link href="/results" className="text-sm font-semibold text-primary-600">View All →</Link>
              </div>
              <div className="space-y-4">
                {results.length > 0 ? results.map((job: any) => (
                  <Link key={job._id.toString()} href={`/jobs/${job.slug}`} className="card-premium flex items-center gap-4 p-4 hover:border-primary-500">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <TrendingUp size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{job.title}</h3>
                      <p className="text-xs text-slate-500 truncate">{job.organization}</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-slate-500 text-sm text-center py-8">No results available</p>
                )}
              </div>
            </div>

            {/* Admit Cards */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  🎫 Admit Cards
                </h2>
                <Link href="/admit-cards" className="text-sm font-semibold text-primary-600">View All →</Link>
              </div>
              <div className="space-y-4">
                {admitCards.length > 0 ? admitCards.map((job: any) => (
                  <Link key={job._id.toString()} href={`/jobs/${job.slug}`} className="card-premium flex items-center gap-4 p-4 hover:border-primary-500">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                      <Award size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{job.title}</h3>
                      <p className="text-xs text-slate-500 truncate">{job.organization}</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-slate-500 text-sm text-center py-8">No admit cards available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATE-WISE */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <h2 className="text-3xl font-display font-bold text-center mb-10">
            Explore by State
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Kerala', 'Bihar'].map((state, i) => (
              <Link
                key={i}
                href={`/state-wise/${state.toLowerCase().replace(' ', '-')}`}
                className="card-premium p-4 text-center hover:border-primary-500 hover:text-primary-600"
              >
                <span className="font-semibold text-sm">{state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Never Miss a Sarkari Notification
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join 500,000+ applicants who get real-time job alerts. Verified sources only.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/latest-jobs" className="btn-premium bg-white text-primary-700 hover:bg-primary-50 px-8 py-4">
              Browse All Jobs
            </Link>
            <a href="https://t.me/jobupdatesite" target="_blank" className="btn-premium bg-primary-700 text-white hover:bg-primary-800 border border-primary-500 px-8 py-4">
              📢 Join Telegram
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
