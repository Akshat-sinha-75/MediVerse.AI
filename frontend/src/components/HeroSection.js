'use client';

import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        {/* Top Badge */}
        <div className="hero-badge animate-fade-in-up">
          <span className="badge-year">2025</span>
          <span className="badge-text">MEDIVERSE.AI</span>
          <span className="badge-live">Live</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-heading">
          All healthcare intelligence.<br />
          One unified AI platform.
        </h1>

        {/* Subheading */}
        <p className="hero-subheading animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          24/7 AI POWERED HEALTHCARE SUPPORT
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
          <a href="#contact" className="btn-primary hero-btn">
            Connect With Us
          </a>
          <a href="#about" className="btn-outline hero-btn">
            What is MediVerse.AI?
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <span>SCROLL</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
