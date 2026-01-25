export default async function HomePage() {
  return (
    <div className="w-full">
      <header className="hero">
        <div className="container">
          <h1 className="hero-title">Official Jobs.<br />Daily Updates.</h1>
          <p className="hero-subtitle">The simple, authoritative way to find your next government or private career move in India.</p>
          <div className="flex justify-center gap-4">
            <a href="/latest-jobs" className="btn btn-primary">Browse Current Openings</a>
            <a href="/api/cron/fetch" className="btn btn-link">Update Database</a>
          </div>
        </div>
      </header>

      <section className="section" style={{ backgroundColor: 'var(--subtle)' }}>
        <div className="container">
          <h2 className="section-title">Latest Recruitments</h2>
          <div className="grid grid-3">
            {/* Dynamic content will load here from database */}
            <div className="card" style={{ opacity: 0.5, borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-secondary italic">Connecting to official data sources...</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Verified Sources</h2>
              <p className="text-secondary">We fetch data exclusively from official government portals like UPSC, SSC, and State PSCs. No rumors, just facts.</p>
            </div>
            <div style={{ paddingLeft: '48px', borderLeft: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Real-time Delivery</h2>
              <p className="text-secondary">Our systems monitor changes 24/7. When a notification goes live, it appears here in seconds.</p>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .gap-4 { gap: 16px; }
      `}</style>
    </div>
  );
}
