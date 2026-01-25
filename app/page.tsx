'use client';

import { ArrowRight, Search, Zap, Bell, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative section-py overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent-soft mb-8 animate-fade-in">
            <Zap size={16} className="text-secondary" />
            <span className="text-xs font-bold uppercase tracking-widest leading-none">Instant Job Alerts 2026</span>
          </div>

          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your Reliable Career <br />
            <span className="gradient-text">Gateway to India.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-secondary text-lg md:text-xl mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            We fetch official recruitment notifications across 28 states directly from verified government portals, so you never miss an opportunity again.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/latest-jobs" className="btn-premium btn-primary w-full sm:w-auto">
              Explore All Jobs <ArrowRight size={18} />
            </Link>
            <Link href="/govt-jobs" className="btn-premium btn-outline w-full sm:w-auto">
              Govt. Recruitment
            </Link>
          </div>
        </div>
      </section>

      {/* --- QUICK CATEGORIES --- */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'UPSC / IAS', icon: <ShieldCheck className="text-primary" /> },
              { label: 'SSC / CGL', icon: <TrendingUp className="text-primary" /> },
              { label: 'Banking', icon: <Zap className="text-primary" /> },
              { label: 'Railways', icon: <Bell className="text-primary" /> },
            ].map((cat, i) => (
              <div key={i} className="premium-card text-center p-6 flex flex-col items-center group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  {cat.icon}
                </div>
                <span className="font-bold text-sm tracking-wide">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST BANNER --- */}
      <section className="bg-fg-main text-white py-16 mb-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(18,62,156,0.3),transparent)]"></div>
        <div className="container relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-2">100% Official Sources Only</h3>
            <p className="text-gray-400">No rumors. No third-party spam. Only verified links.</p>
          </div>
          <div className="flex gap-8 items-center grayscale opacity-60">
            {/* Placeholders for Gov Logos - in real use these would be SVG/images */}
            <span className="text-2xl font-black italic">UPSC</span>
            <span className="text-2xl font-black italic">SSC</span>
            <span className="text-2xl font-black italic">IBPS</span>
            <span className="text-2xl font-black italic">RRB</span>
          </div>
        </div>
      </section>

      {/* --- LATEST UPDATES PLACEHOLDER --- */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">Recent <span className="text-primary">Recruitments</span></h2>
          <Link href="/latest-jobs" className="text-primary font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="text-center py-24 rounded-3xl border-2 border-dashed border-border-hard bg-white/50">
          <p className="text-secondary italic">Connecting safely to secure official database...</p>
          <Link href="/api/cron/fetch" className="btn-premium btn-outline mt-6">
            Initial Fetch Data
          </Link>
        </div>
      </section>
    </div>
  );
}
