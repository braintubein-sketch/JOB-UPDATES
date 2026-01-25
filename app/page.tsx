import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Search, Zap, Bell, ShieldCheck } from 'lucide-react';

export default async function HomePage() {
  await dbConnect();

  // Fetch latest 6 jobs for home
  const jobs = await Job.find({ status: 'APPROVED' })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return (
    <div className="flex flex-col w-full">

      {/* 1. HERO SECTION */}
      <section className="relative py-20 bg-background overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container relative z-10 text-center">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-surface mb-8">
            <Zap size={16} className="text-secondary" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Official 2026 Batch Updates</span>
          </div>

          <h1 className="display-1 mb-8 reveal">
            Your Trustworthy Path <br />
            To <span className="text-gradient underline">Official Indian Jobs.</span>
          </h1>

          <p className="max-w-medium mx-auto text-secondary text-lg md:text-xl mb-12 reveal" style={{ maxWidth: '800px' }}>
            We monitor 500+ official government portals 24/7. Verified recruitments,
            exams, and results delivered directly from the source.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
            <Link href="/latest-jobs" className="btn-premium btn-primary w-full sm:w-auto">
              Browse All Jobs <ArrowRight size={20} />
            </Link>
            <Link href="/govt-jobs" className="btn-premium btn-outline w-full sm:w-auto">
              Govt Notifications
            </Link>
          </div>
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-[120px] -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-accent/5 rounded-full blur-[100px] -ml-20"></div>
      </section>

      {/* 2. TRENDING CATEGORIES */}
      <section className="pb-20">
        <div className="container grid md:grid-cols-4 gap-6">
          {['Central Govt', 'Banking', 'Railway', 'Defence'].map((cat, i) => (
            <div key={i} className="card-stack flex items-center gap-6 p-6 cursor-pointer">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{cat} Jobs</h3>
                <span className="text-xs font-black uppercase tracking-widest text-secondary">Active Now</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LATEST UPDATES (REAL DATA) */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="container">
          <div className="flex items-center justify-between mb-16">
            <h2 className="display-2">Latest <span className="text-primary italic">Live</span> Updates</h2>
            <Link href="/latest-jobs" className="flex items-center gap-2 font-black uppercase tracking-widest text-sm hover:text-primary">
              View Full List <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {jobs.length > 0 ? jobs.map((job: any) => (
              <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
            )) : (
              <div className="col-span-3 card-stack text-center py-20 border-dashed">
                <p className="text-secondary italic">Connecting safely to official database... No jobs found yet.</p>
                <Link href="/api/cron/fetch" className="btn-premium btn-outline mt-8">Refresh Live Data</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. STATE-WISE GRID */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center display-2 mb-16">Explore by State</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {['Andhra', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'UP', 'WB', 'MP', 'Kerala', 'Bihar'].map((state, i) => (
              <Link key={i} href={`/state-wise/${state.toLowerCase()}`} className="card-stack p-4 text-center hover:border-primary">
                <span className="font-bold text-sm">{state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
