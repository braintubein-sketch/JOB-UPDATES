'use client';

import { ArrowRight, CheckCircle2, Globe, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', top: '0', right: '0', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%', z-index: -1 }}></div>

        <div className="container text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8" style={{ border: '1px solid var(--border)', borderRadius: '20px', backgroundColor: 'var(--card)', fontSize: '13px', fontWeight: 600 }}>
             <span style={{ color: 'var(--primary)' }}>•</span> Real-time Job Notifications 2026
          </div>

          <h1 className="hero-title">
            The Authority on Official <br /> 
            <span style={{ color: 'var(--primary)' }}>Indian Job Updates.</span>
          </h1>
          
          <p className="max-w-medium mx-auto text-secondary text-lg mb-12 mb-8" style={{ maxWidth: '750px' }}>
            Direct access to official recruitment notifications across all 28 states. We crawl verified government portals so you can apply with 100% confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/latest-jobs" className="btn btn-primary w-full sm:w-auto" style={{ height: '52px', padding: '0 32px' }}>
              Explore Jobs <ArrowRight size={18} />
            </Link>
            <Link href="/govt-jobs" className="btn btn-outline w-full sm:w-auto" style={{ height: '52px', padding: '0 32px' }}>
              Official Notifications
            </Link>
          </div>
        </div>
      </section >

    {/* Trust Badges */ }
    < section className = "pb-20" style = {{ borderBottom: '1px solid var(--border)' }
}>
  <div className="container">
    <div className="flex flex-wrap justify-between items-center gap-8 text-secondary" style={{ opacity: 0.6 }}>
      <div className="flex items-center gap-2"><Globe size={18} /> 28 States Covered</div>
      <div className="flex items-center gap-2"><ShieldCheck size={18} /> Verified Sources Only</div>
      <div className="flex items-center gap-2"><Zap size={18} /> Instant Alerts</div>
    </div>
  </div>
      </section >

  {/* Categories Preview */ }
  < section className = "py-20 bg-primary-soft" >
    <div className="container">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="font-heading" style={{ fontSize: '32px' }}>Browse by Category</h2>
          <p className="text-secondary">Expertly curated job listings for every professional level.</p>
        </div>
        <Link href="/latest-jobs" className="btn btn-outline">View All</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <CategoryCard title="Govt Jobs" count="500+" icon={<ShieldCheck className="text-primary" />} href="/govt-jobs" />
        <CategoryCard title="Private Sector" count="1200+" icon={<Zap className="text-accent" />} href="/private-jobs" />
        <CategoryCard title="Freshers" count="300+" icon={<CheckCircle2 className="text-primary" />} href="/latest-jobs" />
      </div>
    </div>
      </section >

  {/* Featured Jobs Placeholder */ }
  < section className = "py-20" >
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="font-heading" style={{ fontSize: '32px' }}>Latest Live Openings</h2>
        <p className="text-secondary">Updates as of Today, {new Date().toLocaleDateString()}</p>
      </div>

      <div className="card-premium text-center py-20" style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}>
        <p className="text-secondary italic mb-6">Connecting to official data sources...</p>
        <Link href="/api/cron/fetch" className="btn btn-outline">Manual Data Refresh</Link>
      </div>
    </div>
      </section >
    </div >
  );
}

function CategoryCard({ title, count, icon, href }: { title: string, count: string, icon: any, href: string }) {
  return (
    <Link href={href} className="card-premium flex items-center justify-between group" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center bg-background" style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold">{title}</h4>
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider">{count} Postings</span>
        </div>
      </div>
      <ArrowRight size={18} className="text-border group-hover:text-primary transition-colors" />
    </Link>
  );
}
