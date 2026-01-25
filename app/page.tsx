'use client';

import { ArrowRight, ChevronRight, Globe, ShieldCheck, Zap, Bell, Search, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="relative py-lux overflow-hidden bg-white/30">
        <div className="mesh-bg"></div>

        <div className="container relative z-10">
          <div className="max-w-medium mx-auto text-center">
            <div className="reveal flex justify-center mb-8">
              <span className="lux-badge lux-badge-primary">
                <Bell size={14} /> 2026 Batch Official Updates
              </span>
            </div>

            <h1 className="display-1 mb-8 reveal" style={{ animationDelay: '0.1s' }}>
              The Gold Standard for <br />
              <span className="hero-gradient-text">Indian Careers.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted mb-12 reveal leading-relaxed" style={{ animationDelay: '0.2s' }}>
              We crawl verified government portals across all 28 states to bring you pristine,
              direct job notifications. No spam, only results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal" style={{ animationDelay: '0.3s' }}>
              <Link href="/latest-jobs" className="btn-luxury btn-lux-primary w-full sm:w-auto">
                Discover Latest Jobs <ArrowRight size={20} />
              </Link>
              <Link href="/govt-jobs" className="btn-luxury btn-lux-outline w-full sm:w-auto">
                Official Notifications
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Abstract Element */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-primary/5 blur-[120px] rounded-full"></div>
      </section>

      {/* --- PREMIUM FEATURES --- */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card reveal" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Official Sources</h3>
              <p className="text-text-muted">Direct links to UPSC, SSC, and State Public Service Commissions. We never use third-party links.</p>
            </div>

            <div className="premium-card reveal" style={{ animationDelay: '0.5s' }}>
              <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Alerts</h3>
              <p className="text-text-muted">Our custom crawler monitors sites 24/7. Get notified the second a new notification drops.</p>
            </div>

            <div className="premium-card reveal" style={{ animationDelay: '0.6s' }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">All State Portal</h3>
              <p className="text-text-muted">From Kerala to Kashmir, we cover notifications from every single Indian state and union territory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATISTICS / TRUST --- */}
      <section className="py-20 bg-bg-color">
        <div className="container">
          <div className="glass p-12 rounded-lg grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl font-black text-primary mb-2">1M+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Daily Visits</div>
            </div>
            <div>
              <div className="text-4xl font-black text-primary mb-2">500+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Daily Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-black text-primary mb-2">Official</div>
              <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Trust Factor</div>
            </div>
            <div>
              <div className="text-4xl font-black text-primary mb-2">24/7</div>
              <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Live Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEARCH / FILTER PREVIEW --- */}
      <section className="py-lux">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Browse by Location</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Select your state to find tailored opportunities in your local region.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {['Andhra', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'UP', 'WB', 'MP', 'Kerala', 'Bihar'].map((state, i) => (
              <Link key={i} href={`/state-wise/${state.toLowerCase()}`} className="border border-border-light bg-white p-4 rounded-xl flex items-center justify-between hover:border-primary hover:text-primary transition-all group">
                <span className="font-bold text-sm">{state}</span>
                <MapPin size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER / CTA --- */}
      <section className="container mb-24">
        <div className="relative p-12 md:p-20 rounded-lg overflow-hidden bg-primary shadow-glow">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">Never miss a Sarkari <br />Notification again.</h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl">Join 500,000+ applicants who get real-time job alerts delivered via email and WhatsApp. Verified sources only.</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Enter your email address" className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all" />
              <button className="btn-luxury bg-white text-primary hover:bg-white/90 shadow-lg">Subscribe Now</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
