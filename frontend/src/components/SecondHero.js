'use client';

import './SecondHero.css';

export default function SecondHero() {
  return (
    <section className="second-hero" id="about">
      <div className="second-hero-content">
        <div className="second-hero-badge">
          <span className="badge-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#7C3AED" strokeWidth="2" />
              <path d="M7 10h6M10 7v6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="badge-text">MEDIVERSE.AI</span>
          <span className="badge-live">Live</span>
        </div>

        <h2 className="second-hero-heading">
          Your Personal AI<br />Healthcare Assistant
        </h2>

        <p className="second-hero-subtext">
          24/7 AI POWERED HEALTHCARE SUPPORT
        </p>

        <a href="/auth/signup" className="btn-primary second-hero-btn">
          Get Into MediVerse
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
