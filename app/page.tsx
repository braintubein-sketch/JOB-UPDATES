import JobListItem from '@/components/JobListItem';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';
import { ArrowRight, Building2, Award, FileText, Smartphone, TrendingUp, Calendar } from 'lucide-react';
import dbConnect from '@/lib/mongodb/dbConnect';
import { Job } from '@/models/Job';
import { Result, AdmitCard } from '@/models/Automation';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 mins

async function getHomeData() {
  try {
    await dbConnect();
    const [featuredJobs, govtJobs, privateJobs, latestResults, admitCards] = await Promise.all([
      Job.find({ status: 'PUBLISHED' }).sort({ publishedAt: -1, createdAt: -1 }).limit(10).lean(),
      Job.find({ status: 'PUBLISHED', category: { $in: ['Govt', 'PSU', 'Railway', 'Banking', 'Police', 'Defence'] } }).sort({ publishedAt: -1, createdAt: -1 }).limit(3).lean(),
      Job.find({ status: 'PUBLISHED', category: { $in: ['Private', 'IT'] } }).sort({ publishedAt: -1, createdAt: -1 }).limit(3).lean(),
      Result.find({ status: 'PUBLISHED' }).sort({ releaseDate: -1, createdAt: -1 }).limit(3).lean(),
      AdmitCard.find({ status: 'PUBLISHED' }).sort({ examDate: -1, createdAt: -1 }).limit(3).lean(),
    ]);

    return JSON.parse(JSON.stringify({
      featuredJobs,
      govtJobs,
      privateJobs,
      latestResults,
      admitCards
    }));
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      featuredJobs: [],
      govtJobs: [],
      privateJobs: [],
      latestResults: [],
      admitCards: []
    };
  }
}

export default async function HomePage() {
  const { featuredJobs, govtJobs, privateJobs, latestResults, admitCards } = await getHomeData();

  return (
    <div className="pb-20 lg:pb-0 bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest Job Updates Section */}
      <section className="section">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-slate-900 dark:text-white">
                <TrendingUp className="text-blue-600" size={24} />
                Latest Job Updates
              </h2>
            </div>
            <Link href="/latest-jobs" className="btn-secondary btn-sm hidden md:inline-flex items-center gap-2 text-xs">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="list-item-container">
            {featuredJobs.map((job: any) => (
              <JobListItem key={job._id} job={job} />
            ))}
            {featuredJobs.length === 0 && (
              <div className="p-8 text-center border border-slate-100 rounded-lg">
                <p className="text-slate-500">No updates available at the moment.</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/latest-jobs" className="btn-secondary w-full justify-center">
              View All Updates
            </Link>
          </div>
        </div>
      </section>

      {/* Govt & Private Jobs Split */}
      <section className="section-gray">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Govt Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Building2 className="text-blue-600" size={20} />
                  Govt Jobs
                </h3>
                <Link href="/govt-jobs" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="list-item-container">
                {govtJobs.map((job: any) => (
                  <JobListItem key={job._id} job={job} />
                ))}
                {govtJobs.length === 0 && (
                  <div className="p-8 text-center border border-slate-200 rounded-lg bg-white dark:bg-slate-900">
                    <p className="text-slate-500">Stay tuned for govt job updates.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Private Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Smartphone className="text-green-600" size={20} />
                  Private Jobs
                </h3>
                <Link href="/private-jobs" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="list-item-container">
                {privateJobs.map((job: any) => (
                  <JobListItem key={job._id} job={job} />
                ))}
                {privateJobs.length === 0 && (
                  <div className="p-8 text-center border border-slate-200 rounded-lg bg-white dark:bg-slate-900">
                    <p className="text-slate-500">No private jobs listed yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Admit Cards Split */}
      <section className="section">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Results */}
            <div className="card border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Award className="text-orange-500" size={24} />
                  Latest Results
                </h3>
                <Link href="/results" className="btn-sm btn-outline text-xs">View All</Link>
              </div>
              <ul className="space-y-4">
                {latestResults.map((result: any) => (
                  <li key={result._id}>
                    <Link href={`/jobs/${result.slug}`} className="block group">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block mb-1">
                        {result.title}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> Declared on {formatDate(result.releaseDate || result.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
                {latestResults.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No results released recently.</p>
                )}
              </ul>
            </div>

            {/* Admit Cards */}
            <div className="card border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <FileText className="text-red-500" size={24} />
                  Admit Cards
                </h3>
                <Link href="/admit-cards" className="btn-sm btn-outline text-xs">View All</Link>
              </div>
              <ul className="space-y-4">
                {admitCards.map((card: any) => (
                  <li key={card._id}>
                    <Link href={`/jobs/${card.slug}`} className="block group">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block mb-1">
                        {card.title}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> Released on {formatDate(card.examDate || card.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
                {admitCards.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No admit cards released recently.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Links / Categories */}
      <section className="section-gray">
        <div className="container-main">
          <h2 className="mb-8 text-center text-slate-900 dark:text-white">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Railway Recruitment', href: '/latest-jobs?q=railway', icon: '🚂' },
              { name: 'Bank Jobs', href: '/latest-jobs?q=bank', icon: '🏦' },
              { name: 'Police / Defence', href: '/latest-jobs?q=police', icon: '👮' },
              { name: 'Teaching Jobs', href: '/latest-jobs?q=teacher', icon: '👨‍🏫' },
              { name: 'SSC Exams', href: '/latest-jobs?q=ssc', icon: '📋' },
              { name: 'UPSC / Civil Services', href: '/latest-jobs?q=upsc', icon: '🏛️' },
              { name: 'Software / IT', href: '/latest-jobs?q=it', icon: '💻' },
              { name: 'Medical Jobs', href: '/latest-jobs?q=medical', icon: '⚕️' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="card hover:border-blue-500 hover:shadow-md transition-all text-center py-6 flex flex-col items-center gap-2 group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
