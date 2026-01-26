import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import JobCard from '@/components/JobCard';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';
import { ArrowRight, Briefcase, Building2, Award, FileText, Smartphone, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredJobs: any[] = [];
  let govtJobs: any[] = [];
  let latestResults: any[] = [];

  try {
    await dbConnect();
    featuredJobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(6).lean();
    govtJobs = await Job.find({ status: 'PUBLISHED', category: 'Govt' }).sort({ createdAt: -1 }).limit(4).lean();
    latestResults = await Job.find({ status: 'PUBLISHED', category: 'Result' }).sort({ createdAt: -1 }).limit(3).lean();
  } catch (error) {
    console.error('Home page error:', error);
  }

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Jobs Section */}
      <section className="section">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="flex items-center gap-2 text-slate-900 dark:text-white">
                <TrendingUp className="text-blue-600" size={28} />
                Latest Job Updates
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Fresh opportunities updated hourly</p>
            </div>
            <Link href="/latest-jobs" className="btn-secondary btn-sm hidden md:inline-flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job: any, index: number) => (
              <div key={job._id.toString()} className={`animate-fade-in-up stagger-${index + 1}`}>
                <JobCard job={{ ...job, id: job._id.toString() }} />
              </div>
            ))}
            {featuredJobs.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Briefcase className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 dark:text-slate-400">No jobs available. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/latest-jobs" className="btn-secondary inline-flex items-center gap-2">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Government Jobs Section */}
      <section className="section-gray">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Building2 className="text-blue-600" size={28} />
                Government Jobs
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Central & State recruitment notifications</p>
            </div>
            <Link href="/govt-jobs" className="btn-secondary btn-sm hidden md:inline-flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {govtJobs.map((job: any) => (
              <JobCard key={job._id.toString()} job={{ ...job, id: job._id.toString() }} />
            ))}
            {govtJobs.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No government jobs available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results & Admit Cards */}
      <section className="section">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                  <Award className="text-orange-500" size={24} />
                  Latest Results
                </h3>
                <Link href="/results" className="text-sm font-medium text-blue-600 hover:underline">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {latestResults.length > 0 ? latestResults.map((result: any) => (
                  <Link
                    key={result._id.toString()}
                    href={`/jobs/${result.slug}`}
                    className="card-hover p-4 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                      <Award size={24} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{result.organization}</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-slate-500 dark:text-slate-400 py-8 text-center">No results available.</p>
                )}
              </div>
            </div>

            {/* App Download Banner */}
            <div>
              <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Smartphone size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Get Instant Alerts</h3>
                    <p className="text-blue-100 mb-6">
                      Join our Telegram channel for real-time job notifications. Never miss an opportunity!
                    </p>
                    <a
                      href="https://t.me/jobupdatesite"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      Join Telegram Channel
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-gray">
        <div className="container-main">
          <h2 className="text-center mb-10 text-slate-900 dark:text-white">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Railway Jobs', href: '/latest-jobs?q=railway', icon: '🚂' },
              { name: 'Bank Jobs', href: '/latest-jobs?q=bank', icon: '🏦' },
              { name: 'Police Jobs', href: '/latest-jobs?q=police', icon: '👮' },
              { name: 'Teaching', href: '/latest-jobs?q=teacher', icon: '👨‍🏫' },
              { name: 'Defence', href: '/latest-jobs?q=defence', icon: '🎖️' },
              { name: 'SSC', href: '/latest-jobs?q=ssc', icon: '📋' },
              { name: 'UPSC', href: '/latest-jobs?q=upsc', icon: '🏛️' },
              { name: 'IT Jobs', href: '/latest-jobs?q=it', icon: '💻' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="card-hover text-center py-6"
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
