import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Zap, ShieldCheck, Clock, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let jobs: any[] = [];
  let lastDateJobs: any[] = [];

  try {
    await dbConnect();
    jobs = await Job.find({ status: 'APPROVED' })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Get jobs expiring today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    lastDateJobs = await Job.find({
      status: 'APPROVED',
      expiresAt: { $gte: today, $lt: tomorrow }
    }).limit(3).lean();
  } catch (error) {
    console.error('Home page DB error:', error);
  }

  return (
    <div className="flex flex-col w-full">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container-premium relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 mb-8 animate-fade-in">
              <Zap size={14} className="text-primary-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
                Official 2026 Updates
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-slide-up">
              Your Trusted Path to{' '}
              <span className="text-gradient">Official Indian Jobs</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              We monitor 500+ official government portals 24/7. Verified recruitments,
              exams, and results delivered directly from the source.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/latest-jobs" className="btn-premium btn-primary px-8 py-4 text-base">
                Browse All Jobs <ArrowRight size={18} />
              </Link>
              <Link href="/govt-jobs" className="btn-premium btn-outline px-8 py-4 text-base">
                Govt Notifications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Central Govt', icon: ShieldCheck, color: 'text-blue-600' },
              { name: 'Banking', icon: TrendingUp, color: 'text-green-600' },
              { name: 'Railway', icon: Zap, color: 'text-amber-600' },
              { name: 'Defence', icon: ShieldCheck, color: 'text-red-600' },
            ].map((cat, i) => (
              <div key={i} className="card-premium flex items-center gap-4 p-5 cursor-pointer hover:border-primary-500">
                <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${cat.color}`}>
                  <cat.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{cat.name}</h3>
                  <span className="text-xs text-slate-500">Active Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAST DATE TODAY */}
      {lastDateJobs.length > 0 && (
        <section className="section-premium bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10">
          <div className="container-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Clock size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Last Date Today</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Apply before midnight!</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {lastDateJobs.map((job: any) => (
                <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST JOBS */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-display font-bold">
              Latest <span className="text-primary-600">Live</span> Updates
            </h2>
            <Link href="/latest-jobs" className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? jobs.map((job: any) => (
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

          <div className="mt-8 text-center md:hidden">
            <Link href="/latest-jobs" className="btn-premium btn-outline">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATE-WISE */}
      <section className="section-premium bg-slate-50 dark:bg-slate-900/50">
        <div className="container-premium">
          <h2 className="text-3xl font-display font-bold text-center mb-10">
            Explore by State
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {['Andhra', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'UP', 'West Bengal', 'MP', 'Kerala', 'Bihar'].map((state, i) => (
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

    </div>
  );
}
