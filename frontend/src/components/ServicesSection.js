'use client';

import './ServicesSection.css';

const services = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="url(#svc1)" strokeWidth="2" />
        <path d="M11 16l3 3 7-7" stroke="url(#svc1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="svc1" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'AI Development',
    description:
      'Custom AI solutions tailored to healthcare workflows, from diagnosis support to patient engagement systems.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="18" rx="4" stroke="url(#svc2)" strokeWidth="2" />
        <path d="M10 14h4l2-3 2 6 2-3h4" stroke="url(#svc2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="28" r="1.5" fill="#7C3AED" />
        <defs>
          <linearGradient id="svc2" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'AI Chatbots',
    description:
      'Intelligent conversational agents that provide 24/7 health guidance, symptom analysis, and medication reminders.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 24l6-8 5 4 7-10 6 8" stroke="url(#svc3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="16" r="2" fill="rgba(124,58,237,0.3)" stroke="#7C3AED" strokeWidth="1" />
        <circle cx="22" cy="10" r="2" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" strokeWidth="1" />
        <defs>
          <linearGradient id="svc3" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Predictive Analytics',
    description:
      'Data-driven health predictions and trend analysis to enable proactive care and early intervention strategies.',
  },
];

export default function ServicesSection() {
  return (
    <section className="services-section" id="services">
      <div className="services-inner">
        <h2 className="services-heading">
          AI-Powered Services for<br />Future-Driven Businesses
        </h2>
        <p className="services-subtext">
          Our cutting-edge AI solutions are designed to transform businesses,
          enhance efficiency, and drive innovation.
        </p>
        <a href="#contact" className="btn-primary services-cta">
          Book a 15-min call
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div className="services-grid">
          {services.map((service, i) => (
            <div key={i} className="service-card glass-card" id={`service-card-${i}`}>
              <div className="card-accent"></div>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
